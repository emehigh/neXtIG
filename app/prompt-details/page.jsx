"use client";
// Example of exporting a React component as default
import React from 'react';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams} from 'next/navigation';
import { useEffect, useState } from 'react';
import PromptCard from '@components/PromptCard';


const PromptDetailsPage = () => {
    // Component logic here
    //get the id from the path
    const router = useRouter();
    const searchParams = useSearchParams(); 
    const promptID = searchParams.get('id');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

  

    useEffect(() => {
    const fetchPrompt = async () => {
      setLoading(true);
  
      if (!promptID) return alert("Missing PromptId!");
  
      try {
        const response = await fetch(`/api/prompt/${promptID}`, {
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch prompt");
        }
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

    };
    // Fetch the prompt details
    fetchPrompt();
    }, []);

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

    if (loading) {
      return <p>Loading...</p>;
    
    } else 
    return (
        <PromptCard
        key={data._id}
        post={data}
        handleEdit={() => handleEdit && handleEdit(data)}
        handleDelete={() => handleDelete && handleDelete(data)}
      />
      )
};

export default PromptDetailsPage;
