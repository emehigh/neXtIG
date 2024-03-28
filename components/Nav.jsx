"use client";
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut, getProviders } from 'next-auth/react';

const Nav = () => {
    
    const {data:session} = useSession();

    const [providers, setProviders] = useState(null);
    const [toggleDropdown, setToggleDropdown] = useState(false);
    const [friendRequestsCount, setFriendRequestsCount] = useState(0);


    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }
        setUpProviders();
    }, []);


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
        <nav className='flex-between w-full mb-16 pt-3'>
            <Link href='/' className='flex gap-2 flex-center'>
            <Image 
            src="/assets/images/logo.svg"
            alt="Logo"
            width={30}
            height={30}
            className='object-contain'/>
            
            <p className='logo_text'>NIG</p>
            </Link>
            <div className='sm:flex hidden'>
                {session?.user ? (
                    
                    <div className='flex gap-3 md:gap-5'>
                        <Link href={`/profile/friend-requests/${session?.user.id}`} className="mt-2" onClick={() => {/* Handle friend requests click */}}>
                        <FontAwesomeIcon icon={faUserFriends} /> {friendRequestsCount}
                        </Link>
                        <Link href="/create-prompt" 
                        className='black_btn'>
                            Create Post
                        </Link>
                        <button
                        type="button"
                        onClick={signOut}
                        className='outline_btn'>
                            Sign Out
                        </button>
                        <Link href="/profile">
                            <Image
                            src={session?.user.image}
                            width={37}
                            height={37}
                            className='rounded-full'
                            alt="profile"
                            />
                        </Link>
                     
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
            
                    
            <div className='sm:hidden flex relative'>
                {session?.user ? (
                    <div className='flex'>
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