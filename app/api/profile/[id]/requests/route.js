// pages/api/sendFriendRequest/[id].js

import { connectToDatabase } from "@utils/database";
import User from "@models/User";

export const POST = async (req, { params }) => {
    const {userId} = await req.json();
    const { id } = params;
    try {
        // Connect to the database
        await connectToDatabase();

        // Find the sender and recipient users by their IDs
        const sender = await User.findById(userId);
        const recipient = await User.findById(id);


        // Check if sender and recipient exist
        if (!sender || !recipient) {
            return new Response("User not found", { status: 404 });
        }

        // Check if the sender is already a friend of the recipient
        // if (recipient.friends.includes(userId)) {
        //     return new Response("User is already a friend", { status: 400 });
        // }

        // Check if a friend request has already been sent
        if (recipient.friend_requests.includes(userId)) {
            return new Response("Friend request already sent", { status: 400 });
        }

        // Add the sender's ID to the recipient's friend requests
        recipient.friend_requests.push(userId);
        await recipient.save();

        return new Response("Friend request sent successfully", { status: 200 });
    } catch (error) {
        console.error("Error sending friend request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};



export const GET = async (req, { params }) => {
    const { id } = params;
    
    try {
        await connectToDatabase();
        const user = await User.findById(id);
        if (!user) {
            return new Response("User not found", { status: 404 });
        }
        return new Response(JSON.stringify({ user }), { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response("Error fetching user", { status: 500 });
    }
};


export const PUT = async (req, { params }) => {

    const { id: receiverId } = params;
    const {senderId} = await req.json();

    try {
        await connectToDatabase();
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) {
            return new Response("User not found", { status: 404 });
        }
        if(!receiver.friends.includes(senderId) && !sender.friends.includes(receiverId)){
            receiver.friends.push(senderId);
            sender.friends.push(receiverId);
        } else {
            return new Response("User is already a friend", { status: 400 });
        }
        
        receiver.friend_requests = receiver.friend_requests.filter((id) => id.toString() !== senderId.toString());
        await receiver.save();
        await sender.save();
        return new Response("Friend request accepted", { status: 200 });
    }
      
     catch (error) {
        console.error("Error in friedning people", error);
        return new Response("Error firending people", { status: 500 });
    }
};

export const DELETE = async (req, { params }) => {
    const { id: receiverId } = params;
    const {senderId} = await req.json();
    try {
        await connectToDatabase();
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return new Response("User not found", { status: 404 });
        }
        console.log(senderId);
        console.log(receiverId);
        receiver.friend_requests = receiver.friend_requests.filter((id) => id.toString() !== senderId.toString());
        await receiver.save();
        return new Response("Friend request removed", { status: 200 });
    } catch (error) {
        console.error("Error removing friend request:", error);
        return new Response("Error removing friend request", { status: 500 });
    }
};