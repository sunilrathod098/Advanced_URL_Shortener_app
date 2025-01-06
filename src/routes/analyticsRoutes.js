import { Router } from 'express';
import {
    getOverallAnalytics,
    getTopicBasedAnalytics,
    getUrlAnalytics
} from '../controllers/user.analyticController.js';
import { verifyGoogleToken } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/user/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific URL
 *     description: Retrieves the analytics for a specific URL based on its alias.
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The alias of the URL.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL analytics data.
 */
router.route("/analytics/:alias").get(verifyGoogleToken, getUrlAnalytics);

/**
 * @swagger
 * /api/user/analytics/topic/{topic}:
 *   get:
 *     summary: Get topic-based analytics
 *     description: Retrieves analytics for a specific topic.
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         description: The topic to get analytics for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topic-based analytics data.
 */
router.route("/analytics/topic/:topic").get(verifyGoogleToken, getTopicBasedAnalytics);

/**
 * @swagger
 * /api/user/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     description: Retrieves overall analytics.
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Overall analytics data.
 */
router.route("/analytics/overall").get(verifyGoogleToken, getOverallAnalytics);

export default router;
