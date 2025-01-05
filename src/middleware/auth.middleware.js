import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to find or create a user
const findOrCreateUser = async (email, googleId, name) => {
    let user = await User.findOne({ email }).select("-password -refreshToken");
    if (!user) {
        user = await User.create({ email, googleId, name });
    }
    return user;
};

// Middleware to verify Google Token
export const verifyGoogleToken = asyncHandler(async (req, _, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(404, "Authorization header missing or improperly formatted");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new ApiError(401, "Google token is missing");
    }

    const tokenSegments = token.split(".");
    console.log("Token format:", tokenSegments.length === 3 ? "ID Token" : "Access Token");

    try {
        if (tokenSegments.length === 3) {
            // ID Token verification
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { email, sub: googleId, name } = payload;

            if (!email || !googleId || !name) {
                throw new ApiError(404, "Incomplete Google ID token payload. Missing required fields.");
            }

            req.user = await findOrCreateUser(email, googleId, name);
        } else if (tokenSegments.length === 2) {
            // Access Token verification
            const tokenInfo = await googleClient.getTokenInfo(token);
            const { email, sub: googleId } = tokenInfo;

            if (!email || !googleId) {
                throw new ApiError(404, "Incomplete Google access token payload. Missing required fields.");
            }

            req.user = await findOrCreateUser(email, googleId, "Unknown User");
        } else {
            throw new ApiError(401, "Invalid token format. Expected ID or Access token.");
        }

        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Token verification failed");
    }
});
