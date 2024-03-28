"use client";
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PromptCard from './PromptCard';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const PromptCardList = ({ data, handleTagClick }) => {


 
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard 
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          likes={post.likes.length}
        />
      ))}
    </div>
  );
}

const Feed = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const filterProfiles = (query) => {
    const filtered = profiles.filter(profile => {
      // Customize this filter condition based on your profile data structure
      return profile.name.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredProfiles(filtered);
  }
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  }



  function extractFields(array, ...fields) {
    return array.map(item => {
      const extractedItem = {};
      fields.forEach(field => {
        if (item[field]) {
          extractedItem[field] = item[field];
        }
      });
      return extractedItem;
    });
  }

  useEffect(() => {
    setProfiles([]);
    const fetchProfiles = async () => {
        try {
            const res = await fetch(`/api/profile/names/${searchText}`);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            setProfiles(extractFields(data, '_id', 'username', "image"));
          } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    }

    if (searchText.length > 3) {
        fetchProfiles();
    }
}, [searchText]); // Add searchText as a dependency


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/prompt`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Handle the error gracefully, e.g., display a message to the user
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, []);

  useEffect(() => {
    if (loading) {
      toast.info('Loading...');
    } else {
      toast.dismiss();
    }
  }, [loading]);

  return (
    <section className='feed'>
      <ToastContainer />
       <form className='w-full'>
              <input
                type='text'
                placeholder='Search profiles...'
                value={searchText}
                onChange={handleSearchChange}
                required
                className='search_input peer' 
              />
             
        </form>
      <div className='w-full'>
           
            {profiles.length > 0 && (
              <div className='w-full absolute max-w-xl overflow-hidden rounded-md bg-white'>
               {profiles.map(profile => (
                  profile._id !== session?.user.id && (
                    <div className="cursor-pointer flex py-2 px-3 hover:bg-slate-100" key={profile._id}>
                      <Image 
                        src={profile.image} 
                        className="w-8 mr-5 h-8 rounded-full inline-block mr-2" 
                        alt=""
                        width={20}
                        height={20}
                      />
                      <Link 
                        href={`/profile/?id=${profile._id}`} 
                        className="text-sm font-medium text-gray-600 block"
                      >
                        {profile.username}
                      </Link>
                    </div>
                  )
                ))}
            </div>
            )}
        </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <PromptCardList 
          data={posts}
          handleTagClick={() => {}}
        />
      )}
    </section>
  );
}

export default Feed;
