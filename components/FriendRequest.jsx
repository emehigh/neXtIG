"use client";

import { useEffect, useState } from "react";

const FriendRequest = ({userId, handleAccept, handleReject, answered}) => {
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
      <div className="friend-request">
        <p>{userId} wants to add you as a friend.</p>
          <div className="flex">
            <button className="red_btn" onClick={handleAccept}>Accept</button>
            <button className="green_btn" onClick={handleReject}>Reject</button>
          </div>
      </div>
    );
  }
  
};

export default FriendRequest;
