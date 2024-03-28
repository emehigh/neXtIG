import { connectToDatabase } from "@utils/database";
import Prompt from "@models/Prompt";
import { NextApiRequest, NextApiResponse } from 'next'


export const GET = async (req, res) => {
    try{
        await connectToDatabase();
        const prompts = await Prompt.find({}).populate("creator");
        return new Response(JSON.stringify(prompts), {status: 200});
    } catch (error){
        return new Response("Error fetching prompts", {status: 500});
    }

}

