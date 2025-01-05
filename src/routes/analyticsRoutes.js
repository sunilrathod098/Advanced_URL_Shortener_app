import { Router } from 'express';
import {
    getOverallAnalytics,
    getTopicBasedAnalytics,
    getUrlAnalytics
} from '../controllers/user.analyticController.js';
import { verifyGoogleToken } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/analytics/:shortUrl").get(verifyGoogleToken, getUrlAnalytics);
router.route("/analytics/topic/:topic").get(getTopicBasedAnalytics);
router.route("/analytics/overall").get( getOverallAnalytics);

export default router;