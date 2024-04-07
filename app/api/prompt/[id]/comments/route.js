import Prompt from "@models/Prompt";
import { connectToDatabase } from "@utils/database";
import User from "@models/User";

export const POST = async (request, { params }) => {
    const { userId, comment } = await request.json();
    try {
        await connectToDatabase();

        const prompt = await Prompt.findById(params.id);
        if (!prompt) return new Response("Prompt not found", { status: 500 });
        prompt.comments.push( {userId:userId, comment:comment} );
        await prompt.save();
        console.log(prompt);
        return new Response(JSON.stringify({userId,prompt}), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Failed to add comment", { status: 500 });
    }
}