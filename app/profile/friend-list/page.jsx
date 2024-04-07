'use client';

import React from 'react'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Friend from '@components/Friend'
import { useSearchParams } from 'next/navigation';


const FriendList = () => {

    const { data: session } = useSession();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    console.log(id)
    useEffect(() => {
        const getFriends = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/profile/${id}/friends`, {
                    method: 'GET',
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch friends');
                }
                const data = await res.json();
                setFriends(data.friends);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching friends:', error);
                setLoading(false);
            }
        }
        if (session?.user) {
            getFriends();
        }
    },[session]);
    
    return (
        <div className='mt-36 w-full'>
            
            {friends.map((friend) => (
                <Friend
                    key={friend._id}
                    picture={friend.image}
                    username={friend.username}
                    email={friend.email}
                    id={friend._id}
                />
            ))}

        </div>
        
    )
}

export default FriendList; // Export FriendList as the default export
