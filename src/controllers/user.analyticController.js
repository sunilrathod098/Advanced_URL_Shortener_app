import { error } from "console";
import { Url } from "../models/url.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { logger } from "../utils/logger.js";


//Analytics function for a specific short URL
export const getUrlAnalytics = asyncHandler(async (req, res) => {
    const { shortUrl } = req.params;

    logger.error("Request params :",req.params)
    logger.info("Received Short URL:", shortUrl);

    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl  });
        if (!url) {
            logger.error(`Error While fetching the ShortURL: ${error.message}`)
            throw new ApiError(401,error?.message, "Short URL not found");
        }

        logger.error("Received URL: ", url);

        const analytics = await url.getAnalytics();
        logger.info("Analytics for URL:", analytics);

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
        logger.error(`Failed to get URL analytics: ${error.message}`);
        throw new ApiError(500, `Failed to get URL analytics: ${error.message}`);
    }
});


//Analytics function topic base
export const getTopicBasedAnalytics = asyncHandler(async (req, res) => {
    const { topic } = req.params;

    try {
        const url = await User.find({ topic });
        if (!url) {
            throw new ApiError(404, "Topic not found");
        }

        //here aggregate analysis for those URLs
        let totalClicks = 0;
        let uniqueUsers = new Set();
        const clicksByDate = [];
        const osType = [];
        const deviceType = [];
        const browserType = [];

        for (const url of urls) {
            totalClicks += url.clickCount;
            uniqueUsers.add(url.userId);
            clicksByDate.push({
                date: url.createdAt,
                clicks: url.clickCount,
            });
            osType.push({
                os: url.os,
                clicks: url.clickCount,
            });
            deviceType.push({
                device: url.device,
                clicks: url.clickCount,
            });
            browserType.push({
                browser: url.browser,
                clicks: url.clickCount,
            });
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                "Topic based analytics retrieved successfully", {
                totalClicks,
                uniqueUsers: uniqueUsers.size,
                clicksByDate,
                osType,
                deviceType,
                browserType,
                urls
            }
            ))
    } catch (error) {
        throw new ApiError(500, `Error retrieving topic-based analytics: ${error.message}`);
    }
})


export const getOverallAnalytics = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        //find all urls and created by userId
        const urls = await Url.find({ userId });
        if (!urls) {
            throw new ApiError(404, 'User not found')
        }

        //here aggregate overall analytics
        let totalClicks = 0;
        let uniqueUsers = new Set();
        const clicksByDate = [];
        const osType = [];
        const deviceType = [];

        for (const url of urls) {
            totalClicks += url.clickCount;
            uniqueUsers.add(url.userId);
            clicksByDate.push({
                date: url.createdAt,
                clicks: url.clickCount,
            });
            osType.push({
                os: url.osType,
                clicks: url.clickCount,
            });
            deviceType.push({
                device: url.deviceType,
                clicks: url.clickCount,
            });
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                'Overall analytics retrieved successfully',
                {
                    totalClicks,
                    uniqueUsers: uniqueUsers.size,
                    clicksByDate,
                    osType,
                    deviceType,
                }
            ));
    } catch (error) {
        throw new ApiError(500, `Error retrieving overall analytics: ${error.message}`)
    }
});
