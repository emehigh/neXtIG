import Prompt from "@models/Prompt";
import { connectToDatabase } from "@utils/database";

export const PUT = async (req, {params}) => {
    const { userId } = await req.json();
    const { id } = params;
    
    try {
        await connectToDatabase();
        const prompt = await Prompt.findById(id);

        if (!prompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Check if the user has already liked the prompt
        if (prompt.likes.includes(userId)) {
            return new Response("User already liked this prompt", { status: 400 });
        }

        // Add the user ID to the likes array
        prompt.likes.push(userId);
        await prompt.save();

        return new Response(JSON.stringify(prompt), { status: 200 });
    } catch (error) {
        return new Response("Error updating likes", { status: 500 });
    }

}