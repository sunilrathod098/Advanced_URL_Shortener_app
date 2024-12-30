import mongoose from "mongoose";
import { logger } from "../utils/logger.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/urlshortner`)
        logger.info("Database connection successfully")
    } catch (error) {
        logger.error("Database connection failed:", error)
        process.exit(1)
    }
}