import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URI;  // Correct environment variable

export const dbConnection = async () => {
    try {
        if (!url) {
            throw new Error("MongoDB connection URI (MONGO_URI) is not defined in environment variables");
        }
        await mongoose.connect(url);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit if DB fails to connect
    }
};
