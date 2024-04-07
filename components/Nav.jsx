"use client";
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faHouseChimney, faComments, faSignOut, faBell } from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut, getProviders } from 'next-auth/react';


function extractFields(array, ...fields) {
    return array.map(item => {
      const extractedItem = {};
      fields.forEach(field => {
        if (item[field]) {
          extractedItem[field] = item[field];
        }
      });
      return extractedItem;
    });
}

const Nav = () => {
    
    const {data:session} = useSession();
    const [profiles, setProfiles] = useState([]);
    const [searchText, setSearchText] = useState('');

    const [providers, setProviders] = useState(null);
    const [toggleDropdown, setToggleDropdown] = useState(false);
    const [friendRequestsCount, setFriendRequestsCount] = useState(0);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    }

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }
        setUpProviders();
    }, []);




    useEffect(() => {
        setProfiles([]);
        const fetchProfiles = async () => {
            try {
                const res = await fetch(`/api/profile/names/${searchText}`);
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();
                setProfiles(extractFields(data, '_id', 'username', "image"));
              } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        }
    
        if (searchText.length > 3) {
            fetchProfiles();
        }
    }, [searchText]);

    useEffect(() => {
        const fetchFriendRequestsCount = async () => {
            try {
                const res = await fetch(`/api/profile/${session?.user.id}/requests/`,{
                    method: 'GET',
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch friend requests count');
                }
                const data = await res.json();
                setFriendRequestsCount(data.user.friend_requests.length);
            } catch (error) {
                console.error('Error fetching friend requests count:', error);
            }
        };

        if (session?.user) {
            fetchFriendRequestsCount();
        }
    }, [session]);

    return (
        <nav className='flex-between w-full pt-3 shadow-xl p-6 fixed top-0 bg-white'>
            <Link href='/' className='flex gap-2 flex-center'>
            <Image 
            src="/assets/images/logo.svg"
            alt="Logo"
            width={30}
            height={30}
            className='object-contain'/>
            
            <p className='logo_text'>NIG</p>
            </Link>
            <div className='sm:flex hidden ml-36'>
                {session?.user ? (
                    
                    <div className='flex gap-5 md:gap-5'>
                        <Link href="/" className='mt-2 mr-3'>
                            <FontAwesomeIcon icon={faHouseChimney} style={{ fontSize: '24px' }}/>
                        </Link>
                        <Link href={`/profile/friend-requests/${session?.user.id}`} className="mt-2 mr-3" onClick={() => {/* Handle friend requests click */}}>
                        <FontAwesomeIcon icon={faBell} style={{ fontSize: '24px' }} /> {friendRequestsCount}
                        </Link>
                        <Link href="/" className='mt-2 mr-3'>
                            <FontAwesomeIcon icon={faComments} style={{ fontSize: '24px' }}/>
                        </Link>
                        <Link href={`/profile/friend-list?id=${session?.user.id}`} className='mt-2 mr-3'>
                            <FontAwesomeIcon icon={faUserFriends} style={{ fontSize: '24px' }}/>
                        </Link>
                        
                        <button
                        type="button"
                        onClick={signOut}
                        className='mr-3'>
                            <FontAwesomeIcon icon={faSignOut} style={{ fontSize: '24px' }}/>
                        </button>
                   
                    
                                    
                  
                     
                    </div>
                ): (
                    <div>
                        {providers &&
                            Object.values(providers).map((provider) => (
                                <button
                                type="button"
                                onClick={() => signIn(provider.id)}
                                key={provider.name}
                                className='black_btn'>
                                Sign In            
                              </button>

                        ))}
                    </div>

                )}
                
            </div>

            <div className='sm:hidden flex relative border'>
                {session?.user.id &&
                <form className=''>
                    <input
                        type='text'
                        placeholder='Search profiles...'
                        value={searchText}
                        onChange={handleSearchChange}
                        required
                        className='search_input peer' 
                    />
                    {profiles.length > 0 && (
                    <div className='w-full absolute overflow-hidden rounded-md bg-white'>
                    {profiles.map(profile => (
                        profile._id !== session?.user.id && (
                            <div className="cursor-pointer flex py-2 px-3 hover:bg-slate-100" key={profile._id}>
                            <Image 
                                src={profile.image} 
                                className="w-8 mr-5 h-8 rounded-full inline-block mr-2" 
                                alt=""
                                width={20}
                                height={20}
                            />
                            <Link 
                                href={`/profile/?id=${profile._id}`} 
                                className="text-sm font-medium text-gray-600 block"
                            >
                                {profile.username}
                            </Link>
                            </div>
                        )
                        ))}
                    </div>
                    )}
                </form>
                }
            </div>

            {session?.user.id &&
            <form className='flex sm:flex hidden'>
                <input
                    type='text'
                    placeholder='Search profiles...'
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className='search_input peer' 
                />
                        {profiles.length > 0 && (
                        <div className='w-full absolute overflow-hidden rounded-md bg-white'>
                        {profiles.map(profile => (
                            profile._id !== session?.user.id && (
                                <div className="cursor-pointer flex py-2 px-3 hover:bg-slate-100" key={profile._id}>
                                <Image 
                                    src={profile.image} 
                                    className="w-8 mr-5 h-8 rounded-full inline-block mr-2" 
                                    alt=""
                                    width={20}
                                    height={20}
                                />
                                <Link 
                                    href={`/profile/?id=${profile._id}`} 
                                    className="text-sm font-medium text-gray-600 block"
                                >
                                    {profile.username}
                                </Link>
                                </div>
                            )
                            ))}
                        </div>
                        )}
                            
                </form>
            }
                    
            <div className='sm:hidden flex relative'>
                {session?.user ? (
                        <div className='flex flex-wrap'>
                            
                            <Image
                            src={session?.user.image}
                            width={37}
                            height={37}
                            className='rounded-full'
                            alt="profile"
                            onClick={() => setToggleDropdown((prev) => !prev)}
                            />
                            {toggleDropdown && (
                                <div className='dropdown'>
                                    <Link 
                                    href="/profile"
                                    className='dropdown_link'
                                    onClick={() => setToggleDropdown(false)}>
                                        My Profile
                                    </Link>
                                    <Link 
                                    href="/create-prompt"
                                    className='dropdown_link'
                                    onClick={() => setToggleDropdown(false)}>
                                        Create Post
                                    </Link>
                                    <Link 
                                    href={`/profile/friend-requests/${session?.user.id}`}
                                    className='dropdown_link'
                                    onClick={() => setToggleDropdown(false)}>
                                        Friend requests
                                    </Link>
                                    <button 
                                    type='button'
                                    onClick={() => {
                                        setToggleDropdown(false);
                                        signOut();
                                    }}
                                    className='mt-5 w-full black_btn'>
                                        Sign out
                                    </button>
                                </div>
                            )}
                            
                        </div>
                    
                    ): (
                        <div>
                            {providers &&
                                Object.values(providers).map((provider) => (
                                    <button
                                    type="button"
                                    onClick={() => signIn(provider.id)}
                                    key={provider.name}
                                    className='black_btn'>
                                    Sign In            
                                </button>

                            ))}
                        </div>
                        
                    )}
            </div>
        </nav>

  )
}

export default Nav