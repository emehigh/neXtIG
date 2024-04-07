"use client";
import React, { useState, useEffect } from 'react';
import PromptCard from './PromptCard';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const Profile = ({
  name,
  data,
  picture,
  handleEdit,
  handleDelete,
  profileId,
  handleAddFriend,
  handleRemoveFriend,
  areFriends,
  friendRequestSent,
  friendRemoved,
  id,
  friendRequestReceived
}) => {
  const { data: session } = useSession();
  const [friendRequestChange, setFriendRequestChange] = useState(friendRequestSent);
  const [areFriendsVal, setAreFriendsVal] = useState(areFriends);
  const [friendRemovedVal, setFriendRemovedVal] = useState(friendRemoved);

  // Update the state when the prop value changes
  useEffect(() => {
    setFriendRequestChange(friendRequestSent);
    setAreFriendsVal(areFriends);
    setFriendRemovedVal(friendRemoved);

    
    
  }, [friendRequestSent, areFriends, friendRemoved]);

  const handleAccept = async () => {
    const receiverId = session?.user?.id; // Assuming session contains user information

    if (!receiverId) {
        console.error('User ID not found in session');
        return;
    }
    try {
        const response = await fetch(`/api/profile/${receiverId}/requests`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                senderId: profileId.current
            })
        });
        // Check if the response indicates success
        if (response.status === 200) {
            // Handle success, e.g., update UI to reflect the liked status
            window.location.reload();
            console.log('Friend accepted');
            // REDIRECT TO SAME PAGE

        } else {
            // Handle other status codes (e.g., 404, 500)
            console.error('Error:', response.data);
        }
    } catch (error) {
        console.error('Error:', error.message);
        // Handle network errors or other exceptions
    }
};

  return (
    <section className="w-full mt-36 flex flex-wrap justify-center ">
           
           <div className="flex justify-center items-end text-center sm:block w-full ">
            <div className="bg-gray-300 transition-opacity bg-opacity-75"></div>
            <div className="inline-block text-left bg-black rounded-lg overflow-hidden align-bottom transition-all transform shadow-2xl ">
              <div className="items-center w-full mr-auto ml-auto relative max-w-7xl md:px-12">
                <div className="grid grid-cols-1">
                  <div className="mt-4 mr-auto mb-4 ml-auto bg-black max-w-lg">
                    <div className="flex flex-col items-center pt-6 pr-6 pb-6 pl-6">
                    <Image 
                                src={picture} 
                                className="flex-shrink-0 object-cover object-center btn- flex w-16 h-16 mr-auto -mb-8 ml-auto rounded-full shadow-xl" 
                                alt=""
                                width={20}
                                height={20}
                            />
                      <p className="mt-8 text-2xl font-semibold leading-none text-white tracking-tighter lg:text-3xl">{name}</p>
                      <p className="mt-3 text-base leading-relaxed text-center text-gray-200">I am a fullstack software developer with ReactJS for frontend and NodeJS for backend</p>
                      <div className="w-full mt-6">
                
                           {areFriendsVal ? (
                            (friendRemovedVal 
                              ? 
                              <button className="flex text-center items-center justify-center w-full pt-4 pr-10 pb-4 pl-10 text-base font-medium text-white bg-red-600 rounded-xl transition duration-500 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled>

                              Friend Removed
                            </button>
                              : 
                            <button className="flex text-center items-center justify-center w-full pt-4 pr-10 pb-4 pl-10 text-base font-medium text-white bg-black rounded-xl transition duration-500 ease-in-out transform hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleRemoveFriend}>
                            Remove Friend
                            </button>
                          )
                        ) : friendRequestChange ? (
                          <button className="flex text-center items-center justify-center w-full pt-4 pr-10 pb-4 pl-10 text-base font-medium text-white bg-green-300 rounded-xl transition duration-500 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled>
                            Friend Request Sent
                          </button>
                        ) : 
                          friendRequestReceived
                          ?
                          (session?.user.id &&
                          session?.user.id.toString() !== profileId.current && (
                            <button
                              className="flex text-center items-center justify-center w-full pt-4 pr-10 pb-4 pl-10 text-base font-medium text-white bg-indigo-600 rounded-xl transition duration-500 ease-in-out transform hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={handleAccept}
                              disabled={friendRequestChange}
                            >
                              Accept Friend Request
                            </button>
                          ))
                          : 
                          (
                         session?.user.id &&
                          session?.user.id.toString() !== profileId.current && (
                            <button
                              className="flex text-center items-center justify-center w-full pt-4 pr-10 pb-4 pl-10 text-base font-medium text-white bg-indigo-600 rounded-xl transition duration-500 ease-in-out transform hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={handleAddFriend}
                              disabled={friendRequestChange}
                            >
                              Add Friend
                            </button>
                          ))}

                      
                      <Link href={`/profile/friend-list?id=${id.current}`} className="flex text-center items-center justify-center mt-5 pt-4 pr-10 pb-4 pl-10 text-base font-medium bg-white rounded-xl transition duration-500 ease-in-out transform hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            See friend list
                      </Link>
                      
                      

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>  

      <div className="mt-10 w-1/2 flex-col justify-center">
        {data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
            isShared={false}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;