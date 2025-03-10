import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redisClient.js';


export const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args)
    }),
        windowMs: 15 * 60 * 1000, //15 minutes
        max: 100, //limit each IP to 100 requests per windowMs
        message: {
            status: 429,
            error: 'Too many requests, please try again later.'
        }
    })
