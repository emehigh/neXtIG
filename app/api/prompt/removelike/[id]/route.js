import Prompt from "@models/Prompt";
import { connectToDatabase } from "@utils/database";

export const DELETE = async (req, { params }) => {
    const { userId } = await req.json();
    const { id } = params;

    try {
        await connectToDatabase();
        const prompt = await Prompt.findById(id);

        if (!prompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Check if the user has already liked the prompt
        const userLiked = prompt.likes.some(user => user._id.toString() === userId);

        if (userLiked) {
            // Remove the user's ID from the likes array
            prompt.likes = prompt.likes.filter(user => user._id.toString() !== userId);

            await prompt.save();
            return new Response(JSON.stringify(prompt), { status: 200 });
        } else {
            return new Response("User not in likes list!", { status: 400 });
        }
    } catch (error) {
        return new Response("Error removing like", { status: 500 });
    }
};
