import User from "@models/User";
import { connectToDatabase } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDatabase();

        // Find the user by ID
        const user = await User.findById(params.id);

        // Get 5 users that are not friends with the user
        const users = await User.find({
            _id: { $ne: params.id }, // Exclude the user itself
            friends: { $nin: [user._id] } // Exclude users who are already friends
        }).limit(5);

        console.log(users);
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch users", { status: 500 });
    }
};
