import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

//google client OAuth2 setup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generatedAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        await user.save({ validateBeforeSave: false });
        return accessToken;
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access token");
    }
};



//Google sign-In Function
export const googleSignIn = asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        throw new ApiError(400, "Google token is required");

    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        const payload = ticket.getPayload();
        const user = await User.findOne({ googleId: payload.sub });
        if (!user) {
            user = await User.create({
                googleId: payload.sub,
                email: payload.email,
                name: payload.name
            });
            await user.save({ validateBeforeSave: false });
        }

        //logger to check user is fetched or not correctly
        logger.info(`User ${user._id} signed in with Google`);

        const accessToken = await generatedAccessToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken,
                {
                    httpOnly: true, //secure the cookies in production level
                    secure: process.env.NODE_ENV === "production", // use https in production level
                    sameSite: "none", // allow the cookies to be sent in cross-site requests
                })
            .json(new ApiResponse(
                200,
                "Successfully signed in with Google",
                {
                    accessToken
                }
            ));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Google token");
    }
});
