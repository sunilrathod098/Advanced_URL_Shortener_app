import { Analytics } from "../models/analytics.model.js";
import { Url } from "../models/url.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { logger } from "../utils/logger.js";


//Analytics function for a specific short URL
const getUrlAnalytics = asyncHandler(async (req, res) => {
    const { alias: shortUrl } = req.params;

    logger.error("Request params :",req.params)
    logger.info("Received Short URL:", shortUrl);

    try {
        const url = await Url.findOne({ shortUrl });
        if (!url) {
            logger.error(`Error While fetching the alias: ${shortUrl}`)
            throw new ApiError(401, "Short URL not found");
        }

        logger.info("Found URL: ", url);

        let analytics = await Analytics.findOne({ shortUrl: url._id });
        if (!analytics) {
            logger.info(`Analytics not found for the short URL: ${shortUrl}. Creating new analytics record.`);

            analytics = new Analytics({
                shortUrl: url._id,
                totalClicks: 0,
                uniqueUsers: [],
                clicksByDate: [],
                osType: [],
                deviceType: []
            });

            await analytics.save(); // Save the newly created analytics record
        }
            logger.error("Received Analytics: ", analytics.message);
            logger.info("Analytics for URL:", analytics.message);

            return res.status(200)
                .json(new ApiResponse(
                    200,
                    "URL analytics retrieved successfully",
                    {
                        totalClicks: analytics.totalClicks,
                        uniqueUsers: analytics.uniqueUsers.length,
                        clicksByDate: analytics.clicksByDate.slice(-7), // Last 7 days
                        osType: analytics.osType,
                        deviceType: analytics.deviceType
                    }
                ));
        } catch (error) {
            logger.error(`Failed to get URL analytics: ${error.message}`);
            throw new ApiError(500, `Failed to get URL analytics: ${error.message}`);
        }
});


// Controller to fetch topic-based analytics for a user
const getTopicBasedAnalytics = asyncHandler(async (req, res) => {
    const { topic } = req.params;

    let urls = await Url.find({ topic });
    if (!urls.length) {
        throw new ApiError(404, `No URLs found for the topic: ${topic}`);
    }

    // Get the analytics data for all URLs associated with the topic
    const analyticsList = await Promise.all(
        urls.map(url => Analytics.findOne({ shortUrl: url._id }))
    );

    let totalClicks = 0;
    let uniqueUsers = [];
    let clicksByDate = [];
    let osType = [];
    let deviceType = [];

    analyticsList.forEach(analytics => {
        if (analytics) {
            totalClicks += analytics.totalClicks;
            uniqueUsers = [...new Set([...uniqueUsers, ...analytics.uniqueUsers])];

            analytics.clicksByDate.forEach(dateData => {
                const existingDate = clicksByDate.find(d => d.date.toString() === dateData.date.toString());
                if (existingDate) {
                    existingDate.clickCount += dateData.clickCount;
                } else {
                    clicksByDate.push(dateData);
                }
            });

            analytics.osType.forEach(osData => {
                const existingOS = osType.find(os => os.osName === osData.osName);
                if (existingOS) {
                    existingOS.uniqueClicks += osData.uniqueClicks;
                    existingOS.uniqueUsers += osData.uniqueUsers;
                } else {
                    osType.push(osData);
                }
            });

            analytics.deviceType.forEach(deviceData => {
                const existingDevice = deviceType.find(device => device.deviceName === deviceData.deviceName);
                if (existingDevice) {
                    existingDevice.uniqueClicks += deviceData.uniqueClicks;
                    existingDevice.uniqueUsers += deviceData.uniqueUsers;
                } else {
                    deviceType.push(deviceData);
                }
            });
        }
    });

    res.status(200).json(new ApiResponse(
        200,
        "Topic based analytics retrieved successfully",
        {
        totalClicks,
        uniqueUsers: uniqueUsers.length,
        clicksByDate,
        osType,
        deviceType
    }));
});


const getOverallAnalytics = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        logger.error('Unauthorized access - User is not authenticated');
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const userId = req.user._id;
    logger.info(`Fetching overall analytics for user: ${userId}`);
    try {
        //find all urls and created by userId
        const urls = await Url.find({ userId });
        if (!urls || urls.length === 0) {
            throw new ApiError(404, 'User not found');
        }

        //here aggregate overall analytics
        let totalClicks = 0;
        let uniqueUsers = new Set();
        const clicksByDate = [];
        const osType = [];
        const deviceType = [];

        for (const url of urls) {
            logger.info(`Processing URL: ${url._id}`);
            const analytics = await Analytics.findOne({ shortUrl: url._id });
            logger.info(`Analytics for ${url._id}:`, analytics);

            if (!analytics) {
                logger.error(`No analytics found for url ${url._id}`);
                continue;
            }

            totalClicks += analytics.totalClicks;
            analytics.uniqueUsers.forEach(user => uniqueUsers.add(user));

            analytics.clicksByDate.forEach(clickData => {
                const existing = clicksByDate.find(data => data.date.toISOString() === clickData.date.toISOString());
                if (existing) {
                    existing.clickCount += clickData.clickCount;
                } else {
                    clicksByDate.push(clickData);
                }
            });

            analytics.osType.forEach(osData => {
                const existing = osType.find(data => data.osName === osData.osName);
                if (existing) {
                    existing.uniqueClicks += osData.uniqueClicks;
                    existing.uniqueUsers += osData.uniqueUsers;
                } else {
                    osType.push(osData);
                }
            });

            analytics.deviceType.forEach(deviceData => {
                const existing = deviceType.find(data => data.deviceName === deviceData.deviceName);
                if (existing) {
                    existing.uniqueClicks += deviceData.uniqueClicks;
                    existing.uniqueUsers += deviceData.uniqueUsers;
                } else {
                    deviceType.push(deviceData);
                }
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
        logger.error(`Error retrieving overall analytics: ${error.message}`);
        throw new ApiError(500, `Error retrieving overall analytics: ${error.message}`)
    }
});

export {
    getOverallAnalytics, getTopicBasedAnalytics, getUrlAnalytics
};
