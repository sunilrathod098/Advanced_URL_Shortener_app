import dotenv from "dotenv";
import { app } from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { redisClient } from "./config/redisClient.js";
import { logger } from "./utils/logger.js";

dotenv.config({
    path: "./.env"
})

const startServer = async () => {
    try {
        await connectDB();

         // Connect to Redis
        await redisClient.connect((err) => {
            if (err) {
                logger.error("Error connecting to Redis:", err);
            } else {
                logger.info("Connected to Redis");
            }
        });
    
        //start server with express
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            logger.info(`Server running on http://localhost:${port}`);
        });

        app.on("error", (err) => {
            logger.error("Server error: ", err);
            throw err;
        });

    } catch (err) {
        logger.error("Database connection is failed !! ", err);
        logger.error("Server is not running !!");
        logger.error("Redis connection is failed !!");
        process.exit(1);
    }
};

startServer()