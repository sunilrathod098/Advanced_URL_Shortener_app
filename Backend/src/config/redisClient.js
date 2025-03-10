import dotenv from "dotenv";
import redis from "redis";
import { logger } from "../utils/logger.js";

dotenv.config();

export const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`,
});

redisClient.on("connect", () => {
    logger.info("Connected to Redis successfully");
});

redisClient.on("ready", async () => {
    logger.info("Redis client is ready to use");
});

redisClient.on("error", (error) => {
    logger.error("Error connecting to Redis: ", error);
});

redisClient.on("end", () => {
    logger.info("Redis connection has been closed");
});


