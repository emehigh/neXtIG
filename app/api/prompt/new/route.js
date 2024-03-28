import { connectToDatabase } from "@utils/database";
import Prompt from "@models/Prompt";


export const POST = async (req, res) => {
    const { prompt, tag, userId } = await req.json();
    try{
        await connectToDatabase();
        const newPrompt = new Prompt({
            prompt,
            tag,
            creator: userId,
        });
        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), {status:201})
    } catch (error){
        return new Response("Error creating prompt", {status: 500});
    }
}

