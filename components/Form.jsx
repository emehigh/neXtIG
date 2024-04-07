import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const Form = ({type, post, setPost, submitting, handleSubmit}) => {
  const pathname = usePathname();
  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{type} Post </span>
        </h1>
        {pathname !== '/prompt-share' 
        ?
        <p className='desc text-left max-w-md'>
        {type} and share 
        </p>
        :
        <p className='desc text-left max-w-md'>
          Your thoughts on this post..
        </p>}
        <form onSubmit={handleSubmit}
         className='mt-10 w-full max-w-2x1 flex
          flex-col gap-7 galssmorphism'>
            <label>
              <span className='font-satoshi font semi-bold text-base text-gray-700'>
                Your post
              </span>
              <textarea
                value={post.prompt}
                onChange={(e) => setPost({...post, 
                prompt: e.target.value})}
                placeholder='What do you want to share?'
                required
                className='form_textarea'
                >

              </textarea>
            </label>
            
            <div className='flex-end mx-3 mb-5 gap-4'>
              <Link href="/" className=' text-grey-500 text-sm'>
                Cancel
              </Link>
              <button type="submit"
               disabled={submitting} 
               className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
              >
                {submitting ? `${type}...` : type}

              </button>
            </div>
        </form>
    </section>
  )
}

export default Form