import { connectToDatabase } from "@utils/database";
import User from "@models/User";

export const GET = async (req, { params }) => {
    const { name } = params;
    try {
        await connectToDatabase();
        console.log("Fetching users with name:", name)
        // Construct a regular expression to match usernames starting with the provided name
        const regex = new RegExp(`^${name}`, 'i'); // 'i' flag for case-insensitive matching
        // Find users whose username matches the regex
        const users = await User.find({ username: regex });
        // Return the found users
        return new Response( JSON.stringify(users), {status: 200});
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response("Error fetching users", { status: 500 });
    }
};
