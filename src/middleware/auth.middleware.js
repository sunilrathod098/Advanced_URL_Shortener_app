import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, 'Google token is missing');
    }

    try {
        // here verify the Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, sub: googleId, name } = payload;
        // Find the user or create a new one
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                googleId,
                name,
            });
        }

        // Attach user to the request object
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid Google token');
    }
});


export const protect = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return next(new ApiError(401, 'Access token is missing'));
    }

    try {
        // here verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.user = await User.findById(decoded._id);
        if (!req.user) {
            return next(new ApiError(401, 'User not found'));
        }
        next();
    } catch (error) {
        return next(new ApiError(401, error?.message || 'Invalid access token'));
    }
});
