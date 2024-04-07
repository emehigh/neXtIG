"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const FriendRequest = ({userId,picture, handleAccept, handleReject, answered}) => {
  const [answeredVal, setAnsweredVal] = useState(0); // moved answered state to top-level
  useEffect(() => {
    setAnsweredVal(answered);
  }, [answered]);


  if (answeredVal == 1) {
    return (
      <div className="friend-request">
        <p>You are now friend with {userId}</p>
      </div>
    )
    
  } if (answeredVal == 2) {
    return (
      <div className="friend-request">
        <p>You rejected the friend request from {userId}</p>
      </div>
    )
  } else {

    return (
      <div className="friend-request shadow-2xl p-5 rounded-xl">
        <div className="flex mb-5 justify-center">
            <Image
            src={picture}
            width={50}
            height={50}
            className='rounded-full'
            alt="profile"
            />
            <p className="ml-5" style={{fontSize: 30 + 'px'}}>{userId} wants to add you as a friend.</p>
        </div>
        
          <div className="flex justify-center gap-5">
            <button className="black_btn" onClick={handleAccept}>Accept</button>
            <button className="black_btn" onClick={handleReject}>Reject</button>
          </div>
      </div>
    );
  }
  
};

export default FriendRequest;
