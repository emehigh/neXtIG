"use client";

import { useState, useEffect} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import Link from 'next/link'
import PromptCard from '@components/PromptCard';
import { useSearchParams } from "next/navigation";
import Form from "@components/Form";


const SharePrompt = () => {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({prompt: "", tag: ""});
    const [sharedPost, setSharedPost] = useState();
    const {data: session} = useSession();
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [haveSharedPost, setHaveSharedPost] = useState(false);
    const [areFriends, setAreFriends] = useState(true);
    useEffect(() => {
        const fetchPost = async () => {
          try {
            setLoading(true);
            const res = await fetch(`/api/prompt/${id}/`);
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }

            const data = await res.json();
            if(data.referenceTo){
                setHaveSharedPost(true);
            }
            if(!data.creator.friends.includes(session.user.id)){
                setAreFriends(false);
            }
            
            setSharedPost(data);
          } catch (error) {
            console.error('Error fetching posts:', error);
            // Handle the error gracefully, e.g., display a message to the user
          } finally {
            setLoading(false);
          }
        }
        
        fetchPost();
      }, []);
      
      const createPrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/prompt/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        prompt: post.prompt,
                        userId: session?.user.id,
                        referenceTo:id
                    }
                )
            });
            if(res.ok){
                router.push("/");
            }
        }
        catch (error) {
            console.error(error);
        } finally{
            setSubmitting(false);
        }
    };

    if(haveSharedPost){
        return (
            <div className="w-full flex justify-center">
                <span className='text-sm text-gray-500'>
                    You can't share a shared post:\
                </span>
            </div>
        )
    }
    if(!areFriends){
        return (
            <div className="w-full flex justify-center">
                <span className='text-sm text-gray-500'>
                    You can't share a post from someone who is not your friend:\
                </span>
            </div>
        )
    }

    return (
        
        <div className="w-1/2">
            <Form
            type="Share"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={createPrompt}
            />
            <div className="w-full flex justify-center">
                {loading ? (
                <span className='text-sm text-gray-500'>
                    Loading...
                </span>
                ) : (
            
                <PromptCard 
                key={sharedPost?._id}
                post={sharedPost}
                handleTagClick={() => {}}
                likes={sharedPost?.likes.length}
                />
            )}
            </div>
                
       
        </div>

    )}

export default SharePrompt