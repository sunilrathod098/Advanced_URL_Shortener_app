import { OAuth2Client } from "google-auth-library";
import { Url } from "../models/url.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateRandomString } from "../utils/RandomString.js";



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


//here we create a short URL function
export const createShortUrl = asyncHandler(async (req, res) => {
    const { longUrl, customAlias, topic } = req.body;
    const userId = req.user._id;
    if (!longUrl || !topic) {
        throw new ApiError(400, "Long URL and topic are required");
    }

    if (customAlias && await Url.findOne({ customAlias })) {
        throw new ApiError(400, "Custom alias already exists");
    }

    const shortUrl = customAlias || generateRandomString();

    try {
        //create a URL document
        const url = await Url.create({
            longUrl,
            shortUrl,
            customAlias,
            topic,
            userId
        });
        if (!url) {
            throw new ApiError(500, "Something went wrong while creating short URL");
        }

        //this redis use for cache the short URL in Redis
        const redis = redisClient.setex(shortUrl, 3600, longUrl)// 1 hour expiry time
        if (!redis) {
            throw new ApiError(500, `Something went wrong while caching the short URL in Redis: ${err.message}`);
        };

        return res.status(200)
            .json(new ApiResponse(
                200,
                "Short URL created successfully",
                {
                    shortUrl
                }
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while creating short URL: ${error.message}`);

    }
});


//redirect to the original URL
export const redirectToOriginalUrl = asyncHandler(async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });
        if (!url) {
            throw new ApiError(404, "Short URL not found");
        }

        //here we increment the click count and save the counts
        url.clickCount += 1;
        await url.save({ validateBeforeSave: false });

        return res
            .redirect(url.longUrl)
            .status(200)
            .json(new ApiResponse(
                200,
                "Redirecting to the original URL",
                {
                    longUrl: url.longUrl //optional
                }
            ));
    } catch (error) {
        throw new ApiError(500, `Failed to redirecting to the original URL: ${error.message}`);
    }
});


//Analytics function for a specific short URL
export const getUrlAnalytics = asyncHandler(async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });
        if (!url) {
            throw new ApiError(404, "Short URL not found");
        }

        return res.status(200)
            .json(new ApiResponse(
                200,
                "URL analytics retrieved successfully",
                {
                    originalUrl: url.longUrl,
                    shortUrl: url.shortUrl,
                    clickCount: url.clickCount,
                    topic: url.topic,
                    createdAt: url.createdAt
                }
            ));
    } catch (error) {
        throw new ApiError(500, `Failed to get URL analytics: ${error.message}`);
    }
});


//CURD operations for short URLs

//get all short URLs created by the user
export const getUserUrls = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const urls = await Url.find({ userId });
    if (!urls) {
        throw new ApiError(404, "No short URLs found");
    }

    return res.status(200)
        .json(new ApiResponse(
            200,
            "User URLs retrieved successfully",
            { allUserUrls: urls }
        ));
})


//get a specific short URL
export const getUrl = asyncHandler(async (req, res) => {
    const { urlId } = req.params;

    const url = await Url.findById(urlId);
    if (!url) {
        throw new ApiError(404, "Short URL not found");
    }

    return res.status(200)
        .json(new ApiResponse(
            200,
            "Short URL retrieved successfully",
            { url: url }
        ));
});


//update a specific short URL
export const updateUrl = asyncHandler(async (req, res) => {
    const { urlId } = req.params;

    const url = await Url.findByIdAndUpdate(urlId, req.body, {
        new: true,
        runValidators: true
    });
    if (!url) {
        throw new ApiError(404, "Short URL not found");
    }

    return res.status(200)
        .json(new ApiResponse(
            200,
            "Short URL updated successfully",
            { url }
        ));
})


//delete a specific short URL
export const deleteUrl = asyncHandler(async (req, res) => {
    const { urlId } = req.params;

    const url = await Url.findByIdAndDelete(urlId);
    if (!url) {
        throw new ApiError(404, "Short URL not found");
    }

    return res.status(200)
        .json(new ApiResponse(
            200,
            "Short URL deleted successfully",
            { url }
        ));
})