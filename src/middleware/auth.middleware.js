import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { error } from "console";


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const findOrCreateUser = async (email, googleId, name) => {
    let user = await User.findOne({ email }).select("-password -refreshToken");
    if (!user) {
        user = await User.create({ email, googleId, name });
    }
    return user;
};


// Function to verify Google Access Token
export const verifyGoogleToken = asyncHandler(async (req, _, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(404,error?.message, "Authorization header missing or improperly formatted");
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new ApiError(401, error?.message, "Google token is missing");
    }

    // Check if the token has 3 segments, it's likely an ID token; otherwise, it's an Access token
    const tokenSegments = token.split('.');
    if (tokenSegments.length === 3) {
        // ID Token verification using Google's OAuth2 client (for authentication)
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { email, sub: googleId, name } = payload;

            if (!email || !googleId || !name) {
                throw new ApiError(404,error?.message, "Incomplete Google token payload. Missing required fields.");
            }

            let user = await User.findOne({ email }).select("-password -refreshToken");
            if (!user) {
                user = await User.create({
                    email,
                    googleId,
                    name,
                });
            }

            req.user = user;
            next();
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid Google ID token");
        }
    } else if (tokenSegments.length === 2) {
        // Access Token verification using Google's OAuth2 client (for authorization)
        try {
            const ticket = await googleClient.getTokenInfo(token);
            const { email, sub: googleId, name } = ticket;

            if (!email || !googleId || !name) {
                throw new ApiError(404,error?.message, "Incomplete Google access token payload. Missing required fields.");
            }

            let user = await User.findOne({ email }).select("-password -refreshToken");
            if (!user) {
                user = await User.create({
                    email,
                    googleId,
                    name,
                });
            }

            req.user = user;
            next();
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid Google access token");
        }
    } else {
        throw new ApiError(401, error?.message, "Invalid token format. Expected ID or Access token.");
    }
});
