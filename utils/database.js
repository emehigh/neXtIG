import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
    
    mongoose.set('strictQuery', true);

    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share_prompt",
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        isConnected = true;
        console.log("mongodb connected");
    } catch (error) {
        console.log("Error connecting to database", error);
        return;
    }
    
    console.log("New connection created");
}
