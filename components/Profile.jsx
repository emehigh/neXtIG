"use client";
import React, { useState, useEffect } from 'react';
import PromptCard from './PromptCard';
import { useSession } from 'next-auth/react';

const Profile = ({
  name,
  data,
  handleEdit,
  handleDelete,
  profileId,
  handleAddFriend,
  handleRemoveFriend,
  areFriends,
  friendRequestSent,
  friendRemoved,
}) => {
  const { data: session } = useSession();
  const [friendRequestChange, setFriendRequestChange] = useState(friendRequestSent);
  const [areFriendsVal, setAreFriendsVal] = useState(areFriends);
  const [friendRemovedVal, setFriendRemovedVal] = useState(friendRemoved);

  // Update the state when the prop value changes
  useEffect(() => {
    setFriendRequestChange(friendRequestSent);
    setAreFriendsVal(areFriends);
    setFriendRemovedVal(friendRemoved);
  }, [friendRequestSent, areFriends, friendRemoved]);

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name}</span>
      </h1>
      {areFriendsVal ? (
          (friendRemovedVal 
            ? 
          <div>'Friend Removed' </div>
          : 
          <button className="red_btn" onClick={handleRemoveFriend}>
          'Remove Friend'
          </button>
        )
      ) : friendRequestChange ? (
        <button className="black_btn" disabled>
          Friend Request Sent
        </button>
      ) : (
        session?.user.id &&
        session?.user.id.toString() !== profileId.current && (
          <button
            className="green_btn"
            onClick={handleAddFriend}
            disabled={friendRequestChange}
          >
            Add Friend
          </button>
        )
      )}

      <div className="mt-10 prompt_layout">
        {data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;