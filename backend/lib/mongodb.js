import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected Connection Host:${conn.connection.host}`);
    }
    catch (err) {
        console.log(`MongoDB Connection error ${err}`);
    }
}