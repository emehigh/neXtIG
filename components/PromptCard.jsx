'use client';

import React, { use, useRef } from 'react'
import {useState, useEffect} from 'react'
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";

import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { set } from 'mongoose';
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleMouseEnter = () => {
      setIsVisible(true);
  };

  const handleMouseLeave = () => {
      setIsVisible(false);
  };

  return (
      <div className='w-10' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
          {children}
          {isVisible && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid black', padding: '5px', zIndex: 999 }}>
                  {content}
              </div>
          )}
      </div>
  );
};

const PromptCard = ({post,handleTagClick, handleEdit, handleDelete, isShared}) => {

    const {data:session} = useSession();
    const pathName = usePathname();
    const [likes, setLikes] = useState(post.likes.length);

    const likedBy = useRef(post.likes);
    const [comments, setComments] = useState([{}]);
    const [loading, setLoading] = useState(false);
    const [loadingComms, setLoadingComms] = useState(false);
    const [sharedPost, setSharedPost] = useState(null);

    const [newComment, setNewComment] = useState('');
    const [cooldown, setCooldown] = useState(false);

    const [isLiked, setIsLiked] = useState(post.likes.some(user => user._id === session?.user?.id));

    const [copied, setCopied] = useState("")
    const handleCopy = () => {
        navigator.clipboard.writeText(post.prompt)
        setCopied(post.prompt)
        setTimeout(() => {
            setCopied(""),3000
        })
    }
    useEffect(() => {
        const fetchComments = async () => {
          setLoadingComms(true);
            try {
                // fetch user for each comment
                const comments = await Promise.all(post.comments.map(async comment => {

                    const res = await fetch(`/api/profile/${comment.userId}/requests`);
                    if (!res.ok) {
                        throw new Error('Failed to fetch user');
                    }
                    const user = await res.json();
                    return { user: user, comment: comment.comment, _id: comment._id };
                }));
                setLoadingComms(false);
                setComments(comments);
              } catch (error) { 
                console.error('Failed to fetch comments:', error);
            } 
        };
        fetchComments();
        setSharedPost(post.referenceTo);
        if (post.referenceTo) {
            const fetchSharedUser = async () => {
            
            try{
              fetch(`/api/profile/${post.referenceTo.creator}/requests`)
                    .then(res => res.json())
                    .then(data => {
                        post.referenceTo.creator = data.user;
                    })
                    .catch(error => {
                        console.error('Failed to fetch user:', error);
                    });
            } catch (error) {
              console.error('Failed to fetch user:', error);
            }   
          }
          fetchSharedUser();
        }
          
        
    }, []);


  
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
      setLoading(true);
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

    const handleNewCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleAddComment = async () => {
        const userId = session?.user.id;

        console.log(newComment);
        if (!newComment) {
          toast.error('Comment cannot be empty');
          return;
        }
        
        setCooldown(true);

        if (!userId) {
            console.error('User ID not found in session');
            return;
        }
        try {
            const tempComment = newComment;
            const response = await fetch(`/api/prompt/${post._id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    comment: newComment,
                }),
            });
            
            if (response.ok) {

                const res = await fetch(`/api/profile/${userId}/requests`);
                if (!res.ok) {
                    throw new Error('Failed to fetch user');
                }
                const user = await res.json();
                setComments(() => [...comments, {user:user, comment: tempComment, _id:uuidv4()}]); // Update state with the new comment
                setLoading(false);
                setTimeout(() => {
                  setCooldown(false);
                }, 3000);
                setNewComment('');
                
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setLoading(false);
        }

    };


    return (
    
        <div className='prompt_card shadow-2xl'>
        <div className='flex justify-between items-start gap-5'>
          <div className='flex-1 flex items-center gap-3 cursor-pointer'>
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
            <div className='flex items-center gap-2 ml-auto'>
              {(pathName === '/profile' || pathName === '/prompt-details' || pathName === '/') 
              && (session?.user.id) && 
              (!post.referenceTo) &&
              (post.creator && post.creator.friends && post.creator.friends.includes(session?.user.id))&&

              (<div>
                <Link href={`/prompt-share?id=${post._id}`}>
                <FontAwesomeIcon className='' icon={faShare} />
                </Link>
              </div>)
              }
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
        
        
        </div>
        <div className='mt-5'>
          <Link href={`/prompt-details?id=${post._id}`} className='my-4font-satoshi text-sm text-gray-700'>
            {post.prompt}
            <ToastContainer/>
          </Link>
          <p 
            className='font-inter text-sm blue_gradient cursor-point'
            onClick={() => handleTagClick && handleTagClick(post.tag)}
          >
            {post.tag}
          
          </p>
          <div>
            {sharedPost && 
            <PromptCard post={sharedPost} 
            handleTagClick = {() => {}}
             handleEdit={() => {}} 
             handleDelete = {() => {}}
             isShared={true}/>
            }
          </div>
        </div>

            {session?.user.id === post.creator._id && (pathName === '/profile' || pathName === '/prompt-details')&& 
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
            (post.creator && post.creator.friends && (post.creator.friends.includes(session?.user.id)) || post.creator._id === session?.user.id) &&
            (<div className='mt-5 flex-between gap-4 border-t border-gray-100 pt-3'>
                {isLiked ? (
                    <Tooltip className="w-full border" content={likedBy.current.map(user => (
                        <div  key={user._id}>{user.username}</div>
                    ))}>
                        <p className='font-inter text-sm cursor-pointer' style={{color:'black'}} onClick={handleRemoveLike}>
                            <FontAwesomeIcon icon={faHeart} /> {likes}
                        </p>
                    </Tooltip>
                ) : (
                    <Tooltip className="w-full border" content={likedBy.current.map(user => (
                        <div key={user._id}>{user.username}</div>
                    ))}>
                        <p className='font-inter text-sm green_gradient cursor-pointer' style={{color:'black'}} onClick={handleLike}>
                            <FontAwesomeIcon icon={faHeartEmpty} /> {likes}
                        </p>
                    </Tooltip>
                )}
                {pathName !== '/prompt-details' &&
                  (post.creator.friends.includes(session?.user.id)) &&
                    <Link href={`prompt-details?id=${post._id}`} className='font-inter text-sm cursor-pointer text-black' >
                        Comment
                    </Link>
                }
                {pathName === '/prompt-details' && session?.user.id && !isShared &&
                <div className='w-full flex justify-around'>
                 <textarea
                 type="text"
                  className="w-full"
                 placeholder={post.comments.length > 0 ? "Add a comment..." : "Be the first to say something about this..."}
                 value={newComment}
                 onChange={handleNewCommentChange}/>
                  {cooldown 
                  ?  
                  <button className='cooldownBtn ml-2' onClick={handleAddComment} disabled={cooldown}>
                      Adding...
                  </button> 
                  :
                  <button className='okBtn ml-2' onClick={handleAddComment} disabled={cooldown}>
                      Add Comment
                  </button> 
                   }
                  
               </div>
               }
            </div> )}
            {pathName === '/prompt-details' && !isShared && (
              <div className='mt-5'>
                {post.comments.length > 0 &&
                <p>
                  Comentarii:
                </p>
                }
                {loadingComms 
                ? 
                <p>Loading...</p>
                :
                  (comments.map(comment => (

                      <div className='m-2 border-2 rounded border-green-400 flex' key={comment._id}>
                        <Image  
                          src={comment.user?.user.image}
                          alt="Logo"
                          width={30}
                          height={30}
                          className='object-contain mr-2 mb-2 ml-2'
                        />
                        <div className='w-full flex flex-wrap'>
                            <h2 className='w-full mt-2 mb-2 font-inter text-sm'>
                              {comment.user?.user.username}
                            </h2>
                            <p className='w-full border border-green-300 rounded p-2 mb-2 mr-2'>
                              {comment.comment}
                            </p>
                        </div>
                         
                        
                      </div>
                  )))}
                  
              </div>
            )}
        </div>
    )
}

export default PromptCard