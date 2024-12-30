import dotenv from "dotenv";
import { app } from "../src/app.js";
import connectDB from "../src/config/db.js";


dotenv.config({
    path: './.env'
})

const startServer = async () => {
    try {
        await connectDB();
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });

        app.on("error", (err) => {
            console.log("Server error: ", err);
            throw err;
        });

    } catch (err) {
        console.log("Database connection is failed !! ", err);
        process.exit(1);
    }
};

startServer()