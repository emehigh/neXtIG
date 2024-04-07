import User from "@models/User";
import { connectToDatabase } from "@utils/database";


export const GET = async (request, { params }) => {
    try {
        await connectToDatabase();

        const user = await User.findById(params.id);
        console.log(user);

        if (!user) {
            return new Response("User not found", { status: 404 });
        }
        const friends = await User.find({ _id: { $in: user.friends } });

        return new Response(JSON.stringify({ friends }), { status: 200 });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return new Response("Error fetching user", { status: 500 });
    }
}
