import { connectToDatabase } from "@utils/database";
import Prompt from "@models/Prompt";


export const POST = async (req, res) => {
    const { prompt, userId, referenceTo } = await req.json();
    try{
        await connectToDatabase();
        const newPrompt = new Prompt({
            prompt,
            creator: userId,
            likes: [],
            comments: [],
            referenceTo: referenceTo
        });
        console.log(newPrompt);
        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), {status:201})
    } catch (error){
        return new Response("Error creating prompt", {status: 500});
    }
}

