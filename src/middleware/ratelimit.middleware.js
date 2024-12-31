import rateLimit from 'express-rate-limit';
import asyncHandler from '../utils/asyncHandler.js';


export const limiter = asyncHandler(async (req, res) => {
    return rateLimit({
        windowMs: 15 * 60 * 1000, //15 minutes
        max: 100,
        message: 'Too many requests, please try again later...'
    })
})