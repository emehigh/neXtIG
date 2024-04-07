"use client";
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PromptCard from './PromptCard';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";

import { faReddit, faDiscord, faGit, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBook, faBookmark, faChartColumn, faGamepad, faPlus, faShare, faUser } from '@fortawesome/free-solid-svg-icons';
import { set } from 'mongoose';


const PromptCardList = ({ data, handleTagClick }) => {


 
  return (
    <div className='mt-16'>
      {data.map((post) => (
        <PromptCard 
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          likes={post.likes.length}
          isShared={false}
        />
      ))}
    </div>
  );
}

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({prompt: "", tag: ""});
  const {data: session} = useSession();
  const router = useRouter();
  const [people, setPeople] = useState([]);





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
                    tag: post.tag,
                    userId: session?.user.id
                }
            )
        });
        if(res.ok){
            window.location.reload();
        }
    }
    catch (error) {
        console.error(error);
    } finally{
        setSubmitting(false);
    }
  };


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/prompt`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        const friendPosts = data.filter(post => post.creator.friends.includes(session?.user.id) || post.creator._id === session?.user.id);
        setPosts(friendPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Handle the error gracefully, e.g., display a message to the user
      } finally {
        setLoading(false);
      }
    }

    const fetchPeople = async () =>{
      try {
        const res = await fetch(`/api/users/${session?.user.id}/friends`);
        if(!res.ok){
          throw new Error('Network response was not ok');
        }
        const people_data = await res.json();
        setPeople(people_data);

      } catch(error){
        console.log('Error fetching peopple',error);
      }
    }
    if(session?.user.id){
      fetchPosts();
      fetchPeople();
    }
  }, [session]);

  useEffect(() => {
    if (loading) {
      toast.info('Loading...');
    } else {
      toast.dismiss();
    }
  }, [loading]);

  if(!session?.user.id){
    return(
      <div className='w-full flex-center max-sm:ml-3 max-sm:mr-3 mt-40'>
        welcome to new igggg
      </div>
    ) 
  }


  else
      return (
        
        <div className='w-full flex flex-between max-sm:ml-3 max-sm:mr-3'>
          <div className='leftSideBar max-sm:hidden flex justify-center flex-wrap basis-3/12  '>
              <div className='fixed top-0 mt-40 w-80 shadow-2xl rounded-lg hover:bg-slate-200 bg-white '>
                <Link href="/profile" className='flex p-5'>
                  <Image
                  src={session?.user.image}
                  width={50}
                  height={50}
                  className='rounded-full'
                  alt="profile"
                  />
                <div className='ml-5'>
                  <p>
                    {session?.user.username}
                  </p>
                  <p>
                    regular user
                  </p>
                </div>
                </Link>

                
                
              </div>

              <div className='fixed flex flex-wrap top-0 w-80 shadow-2xl rounded-lg bg-white ' style={{marginTop: 18 + 'em'}}>
                  <div className=' w-full hover:bg-slate-200 flex  p-5'>
                    <FontAwesomeIcon icon={faReddit} style={{fontSize:24 +'px'}}/>
                      <p className='ml-5'>
                        Reddit
                      </p>
                  </div>
                  <div className=' w-full hover:bg-slate-200 flex  p-5'>
                    <FontAwesomeIcon icon={faDiscord} style={{fontSize:24 +'px'}}/>
                      <p className='ml-5'>
                        Discord
                      </p>
                  </div>
                  <div className=' w-full hover:bg-slate-200 flex  p-5'>
                    <FontAwesomeIcon icon={faGithub} style={{fontSize:24 +'px'}}/>
                      <p className='ml-5'>
                        Github
                      </p>
                  </div>

                  <div className=' w-full hover:bg-slate-200 flex  p-5'>
                    <FontAwesomeIcon icon={faPlus} style={{fontSize:24 +'px'}}/>
                      <p className='ml-5'>
                        Add new page
                      </p>
                  </div>

              </div>

              <div className='fixed flex flex-wrap top-0 w-80 shadow-2xl rounded-lg bg-white ' style={{marginTop: 35 + 'em'}}>
              <div className=' w-full hover:bg-slate-200 flex  p-5'>
                    <FontAwesomeIcon icon={faBook} style={{fontSize:24 +'px'}}/>
                      <p className='ml-5'>
                        Learning
                      </p>
                  </div>
                  <div className=' w-full hover:bg-slate-200 flex  p-5'>
                    <FontAwesomeIcon icon={faChartColumn} style={{fontSize:24 +'px'}}/>
                      <p className='ml-5'>
                        Statistics
                      </p>
                  </div>
                  <div className=' w-full hover:bg-slate-200 flex  p-5'>
                    <FontAwesomeIcon icon={faBookmark} style={{fontSize:24 +'px'}}/>
                      <p className='ml-5'>
                        Bookmarks
                      </p>
                  </div>

                  <div className=' w-full hover:bg-slate-200 flex  p-5'>
                    <FontAwesomeIcon icon={faGamepad} style={{fontSize:24 +'px'}}/>
                      <p className='ml-5'>
                        Gaming
                      </p>
                  </div>
                  <div className=' w-full hover:bg-slate-200 flex  p-5'>
                    <FontAwesomeIcon icon={faShare} style={{fontSize:24 +'px'}}/>
                      <p className='ml-5'>
                        Share
                      </p>
                  </div>
                  
                  
              </div>

              
          </div>

          
          
          <section className='feed '>
            <ToastContainer containerId={"feedLoading"}/>
          {session?.user.id &&
            <section className='w-full max-w-full flex-start flex-col'>
              <h1 className='head_text text-left'>
                </h1>
                <form onSubmit={createPrompt}
                className='mt-10 w-full max-w-2x1 flex
                  flex-col gap-7 galssmorphism'>
                    <label>

                      <textarea
                        value={post.prompt}
                        onChange={(e) => setPost({...post, 
                        prompt: e.target.value})}
                        placeholder={`What's on your mind, ${session?.user.username} ?`}
                        required
                        className='form_textarea'
                        >

                      </textarea>
                    </label>
                    
                    <div className='flex w-full  mb-5 gap-4'>

                      <button type="submit"
                      disabled={submitting} 
                      className='black_btn w-full '
                      >
                        {submitting ? `Posting...` : `Post`}

                      </button>
                    </div>
                </form>
            </section>
            }
            {loading ? (
              <div className='mt-20 text-center' style={{fontSize:48 + 'px'}}>Loading feed...</div>
            ) : (
              <PromptCardList 
                data={posts}
                handleTagClick={() => {}}
              />
            )}
          </section>

          <div className='leftSideBar max-sm:hidden flex justify-center flex-wrap basis-3/12'>
          <div className='fixed flex flex-wrap top-0 w-80 shadow-2xl rounded-lg bg-white mt-40'>
            <div className='w-full flex p-5'>
              <p className='ml-5'>
                People you may know...
              </p>
            </div>
            {people.map((person) => (
              <Link href={`/profile?id=${person._id}` } key={person._id} className='w-full hover:bg-slate-200 flex p-5'>
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: '24px' }} />
                  <p className='ml-5'>{person.username}</p> {/* Assuming 'name' is the property that holds the user's name */}
              </Link>
            ))}
          </div>
        </div>
        </div>
      );
    }

export default Feed;
