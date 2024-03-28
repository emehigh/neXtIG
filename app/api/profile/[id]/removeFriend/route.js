import { connectToDatabase } from "@utils/database";
import User from "@models/User";



export const DELETE = async (req, { params }) => {
    const { id: receiverId } = params;
    const {senderId} = await req.json();
    console.log(senderId);
    console.log(receiverId);
    try {
        await connectToDatabase();
        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);
        if (!receiver || ! senderId) {
            return new Response("User not found", { status: 404 });
        }
        receiver.friends = receiver.friends.filter((id) => id.toString() !== senderId.toString());
        sender.friends = sender.friends.filter((id) => id.toString() !== receiverId.toString());
        await receiver.save();
        await sender.save();
        return new Response("Friend request removed", { status: 200 });
    } catch (error) {
        console.error("Error removing friend request:", error);
        return new Response("Error removing friend request", { status: 500 });
    }
};