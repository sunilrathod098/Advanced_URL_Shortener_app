import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";


// Manually calculate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

//Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//setup morgan and redirect logs to winston
app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim())
        },
    })
);


//import routes here
import urlRouter from "./routes/urlRoutes.js";
import authRouter from "./routes/userRoutes.js";
import analyticsRouter from "./routes/analyticsRoutes.js";

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/url", urlRouter);
app.use("/api/v1/user", analyticsRouter);

