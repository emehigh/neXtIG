'use client';

import React, { use, useRef } from 'react'
import {useState, useEffect} from 'react'
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";


import Link from 'next/link';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
      setIsVisible(true);
  };

  const handleMouseLeave = () => {
      setIsVisible(false);
  };

  return (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
          {children}
          {isVisible && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid black', padding: '5px', zIndex: 999 }}>
                  {content}
              </div>
          )}
      </div>
  );
};

const PromptCard = ({post,handleTagClick, handleEdit, handleDelete}) => {

    const {data:session} = useSession();
    const pathName = usePathname();
    const [likes, setLikes] = useState(post.likes.length);

    //const [likedBy, setLikedBy] = useState(post.likes);
    const likedBy = useRef(post.likes);
  //   useEffect(() => {
  //     console.log("likedby")
  //     setLikedBy(likedBy);
  // }, [user]);


    const [isLiked, setIsLiked] = useState(post.likes.some(user => user._id === session?.user?.id));

    const router = useRouter();
    const [copied, setCopied] = useState("")
    const handleCopy = () => {
        navigator.clipboard.writeText(post.prompt)
        setCopied(post.prompt)
        setTimeout(() => {
            setCopied(""),3000
        })
    }

  
    const handleRemoveLike = async () => {
      const userId = session?.user?.id; // Assuming session contains user information
      if (!userId) {
        console.error('User ID not found in session');
        return;
        }
        try {
            
            console.log(userId);
            
            const response = await fetch(`/api/prompt/removelike/${post._id.toString()}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId: userId
              })
            });
            
            
            
            // Check if the response indicates success
            if (response.status === 200) {
                setLikes(likes - 1);
                setIsLiked(false);
                likedBy.current = likedBy.current.filter(user => user._id !== userId);


                console.log('Prompt unliked successfully');
            } else {
                // Handle other status codes (e.g., 404, 500)
                console.error('Error:', response.data);
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Handle network errors or other exceptions
        }
    }



    const handleLike = async () => {
      const userId = session?.user?.id; // Assuming session contains user information
      if (!userId) {
        console.error('User ID not found in session');
        return;
        }
        try {
            
            console.log(userId);
            
            const response = await fetch(`/api/prompt/addlike/${post._id.toString()}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId: userId
              })
            });
            
            
            
            // Check if the response indicates success
            if (response.status === 200) {
                setLikes(likes + 1);
                setIsLiked(true);
                likedBy.current = [...likedBy.current, { _id: userId, username: session?.user.username }];

                // Handle success, e.g., update UI to reflect the liked status
                console.log('Prompt liked successfully');
            } else {
                // Handle other status codes (e.g., 404, 500)
                console.error('Error:', response.data);
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Handle network errors or other exceptions
        }
    }
    if(!post.creator){
        return <div>post not found bro :\</div>
    }
    


    return (
    
        <div className='prompt_card'>
        <div className='flex justify-between items-start gap-5'>
          <div className='flex-1 flex justify-start items-center gap-3 cursor-pointer'>
            <Image  
              src={post.creator.image}
              alt="user_image"
              width={40}
              height={40}
              className='rounded-full object-contain'
            />
            <div className='flex flex-col'>
              <h3 className='font-satoshi font-semibold text-gray-900'>
                <Link href={`/profile?id=${post.creator._id}`}>
                  {post.creator.username}
                </Link>
              </h3>
              <p className='font-inter text-sm text-gray-500'>
                {post.creator.email}
              </p>
            </div>
            <div className='copy_btn' onClick={handleCopy}>
              <Image
              alt='/assets/icons/copy.svg' 
                src={copied === post.prompt
                  ? '/assets/icons/tick.svg'
                  : '/assets/icons/copy.svg'}
                width={12}
                height={12}
              />
            </div>
          </div>
        
        
        </div>
        <p className='my-4 font-satoshi text-sm text-gray-700'>
          {post.prompt}
        </p>
        <p 
          className='font-inter text-sm blue_gradient cursor-point'
          onClick={() => handleTagClick && handleTagClick(post.tag)}
        >
          {post.tag}
        </p>

            {session?.user.id === post.creator._id && pathName === '/profile' && 
                <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
                    <p className='font-inter text-sm green_gradient cursor-pointer' onClick={handleEdit}>
                        Edit
                    </p>
                    <p className='font-inter text-sm orange_gradient cursor-pointer' onClick={handleDelete}>
                        Delete
                    </p>
                </div>
                }
            {session?.user.id &&
            <div className='mt-5 flex-between gap-4 border-t border-gray-100 pt-3'>
                    {isLiked ? (
                      <Tooltip content={likedBy.current.map(user => (
                          <div key={user._id}>{user.username}</div>
                      ))}>
                          <p className='font-inter text-sm green_gradient cursor-pointer' onClick={handleRemoveLike}>
                              <FontAwesomeIcon icon={faHeart} /> {likes}
                          </p>
                        </Tooltip>
                    ) : (
                        <Tooltip content={likedBy.current.map(user => (
                          <div key={user._id}>{user.username}</div>
                      ))}>
                        <p className='font-inter text-sm green_gradient cursor-pointer' onClick={handleLike}>
                            <FontAwesomeIcon icon={faHeartEmpty} /> {likes}
                        </p>
                        </Tooltip>

                    )}
                    
                    <p className='font-inter text-sm orange_gradient cursor-pointer'>
                        Comment
                    </p>
            </div>
            }
        </div>
    )
}

export default PromptCard