import mongoose from "mongoose";
import { logger } from "../utiles/logger.js";


const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/`)
        logger.info("Database connection successfully")
    } catch (error) {
        logger.error("Database connection failed:", error)
        process.exit(1)
    }
}

export default connectDB;