import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Function to generate Access and Refresh Tokens
export const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found.");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating access and refresh tokens.");
    }
};



// Google Sign-In Function with Email/Password Fallback
export const googleSignIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user is signed in with Google
    const user = req.user;

    try {
        if (user) {
            const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
            return res.status(200).json(new ApiResponse(
                200,
                "User has successfully signed in with their Google account.",
                {
                    user,
                    accessToken,
                    refreshToken
                }
            ));
        } else if (email && password) {
            const user = await User.findOne({ email }).select("+password");

            if (!user) {
                throw new ApiError(404, "User not found. Please register first.");
            }

            const isPasswordValid = await user.isPasswordCorrect(password);
            if (!isPasswordValid) {
                throw new ApiError(401, "Invalid credentials.");
            }

            const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

            return res.status(200).json(new ApiResponse(
                200,
                "User has successfully signed in with their email and password.",
                {
                    user,
                    accessToken,
                    refreshToken
                }
            ));
        } else {
            throw new ApiError(400, "Please provide Google token or email/password.");
        }
    } catch (error) {
        throw new ApiError(500, error.message || "Error during sign-in process.");
    }
});
