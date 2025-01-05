import { Router } from 'express';
import {
    getOverallAnalytics,
    getTopicBasedAnalytics,
    getUrlAnalytics
} from '../controllers/user.analyticController.js';
import { verifyGoogleToken } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/analytics/:alias").get(verifyGoogleToken, getUrlAnalytics);
router.route("/analytics/topic/:topic").get(verifyGoogleToken, getTopicBasedAnalytics);
router.route("/analytics/overall").get(verifyGoogleToken, getOverallAnalytics);

export default router;