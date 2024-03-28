'use client';

import { useState, useEffect, useRef} from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams} from 'next/navigation';


import Profile from '@components/Profile';

const MyProfile = () => {

    const searchParams = useSearchParams();


    
    const router = useRouter(); 
    const {data:session} = useSession();
    const [posts,setPosts] = useState([]);
    const [areFriends, setAreFriends] = useState(false);
    const [friendRequestSent, setFriendRequestSent] = useState(false);
    const id = useRef(searchParams.get('id'));
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [friendRemoved, setFriendRemoved] = useState(false);




    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const res = await fetch(`/api/users/${id.current}/posts`);
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await res.json();
            setPosts(data);
          } catch (error) {
            console.error('Error fetching posts:', error);
            // Handle the error gracefully, e.g., display a message to the user
          }
        }
        if(!id.current){
          id.current = session?.user.id.toString();
        } 
        const fetchUser = async () => {
          setIsLoading(true);
          try {
              const res = await fetch(`/api/profile/${id.current}/requests`, {
                  method: 'GET',
              });
              if (!res.ok) {
                  throw new Error('Network response was not ok');
              }
              const data = await res.json();
              setAreFriends(data.user.friends.includes(session?.user.id.toString()));
              setName(data.user.username);
              setFriendRequestSent(data.user.friend_requests.includes(session?.user.id.toString()));
          } catch (error) {
              console.error('Error fetching user:', error);
          } finally {
              setIsLoading(false);
          }
        };

        if (!id.current) {
            id.current = session?.user.id.toString();
        }
        fetchPosts();
        fetchUser();
      },[]);

    const handleEdit = (post) => {
      router.push(`/update-prompt?id=${post._id}`);
    }
    const handleDelete = async (post) => {
      const hasConfirmed = confirm('Are you sure you want to delete this post?');
      if(hasConfirmed){
        try {
          const res = await fetch(`/api/prompt/${post._id.toString()}`, {
            method: 'DELETE'
          });
          if(res.ok){
            setPosts((prevPosts) => posts.filter((prevPost) => prevPost._id !== post._id));
          }
        } catch (error) {
          console.error('Error deleting post:', error);
          // Handle the error gracefully, e.g., display a message to the user
        }
      }

    }

    const handleAddFriend = async () => {
      const userId = session?.user.id; // Assuming session contains user information
      if (!userId) {
        console.error('User ID not found in session');
        return;
        }
        try {
            
            const response = await fetch(`/api/profile/${id.current}/requests`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId: userId
              })
            });
            
            
            
            // Check if the response indicates success
            if (response.status === 200) {
                // Handle success, e.g., update UI to reflect the liked status
                setFriendRequestSent(true);
                console.log('Friend request sent');
            } else {
                // Handle other status codes (e.g., 404, 500)
                console.error('Error:', response.data);
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Handle network errors or other exceptions
        }
    }

    const handleRemoveFriend = async () => {
      const userId = session?.user.id; // Assuming session contains user information
      if (!userId) {
        console.error('User ID not found in session');
        return;
        }
        try {
          console.log(userId);
          console.log(id.current);
            const response = await fetch(`/api/profile/${id.current}/removeFriend`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                senderId: userId
              })
            });
            // Check if the response indicates success
            if (response.status === 200) {
                setFriendRemoved(true);
                console.log("friend " + friendRemoved);
                // Handle success, e.g., update UI to reflect the liked status
                console.log('Friend removed');
            } else {
                // Handle other status codes (e.g., 404, 500)
                console.error('Error:', response.data);
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Handle network errors or other exceptions
        }
    }



  return (
    <Profile
      name={name}
      desc=""
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      profileId={id || session?.user.id}
      handleAddFriend={handleAddFriend}
      handleRemoveFriend={handleRemoveFriend}
      areFriends={areFriends}
      friendRequestSent={friendRequestSent}
      friendRemoved = {friendRemoved}
    />
  )
}

export default MyProfile