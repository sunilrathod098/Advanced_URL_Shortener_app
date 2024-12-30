import dotenv from "dotenv";
import { app } from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { logger } from "./utiles/logger.js";


dotenv.config({
    path: './.env'
})

const startServer = async () => {
    try {
        await connectDB();
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
        process.exit(1);
    }
};

startServer()