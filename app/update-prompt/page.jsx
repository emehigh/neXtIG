"use client";

import { useEffect, useState } from "react";
import {useRouter, useSearchParams } from "next/navigation";

import Form from "@components/Form";


const EditPrompt = () => {
    const router = useRouter();
    const [post, setPost] = useState({prompt: "", tag: ""});
    const searchParams = useSearchParams();
    const [submitting, setIsSubmitting] = useState(false);


    const promptID = searchParams.get('id');


    const updatePrompt = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        if (!promptID) return alert("Missing PromptId!");
    
        try {
          const response = await fetch(`/api/prompt/${promptID}`, {
            method: "PATCH",
            body: JSON.stringify({
              prompt: post.prompt,
              tag: post.tag,
            }),
          });
    
          if (response.ok) {
            router.push("/");
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsSubmitting(false);
        }
      };
    


    useEffect(() => {
        const getPromptDetails = async () => {
            const res = await fetch(`/api/prompt/${promptID}`);
            const data = await res.json();

            setPost({prompt: data.prompt, tag: data.tag});
        }    
        if(promptID){
            getPromptDetails()
        }
    }, [promptID]);



  
    return (
        <Form
        type="Edit"
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={updatePrompt}
        />
    )}

export default EditPrompt