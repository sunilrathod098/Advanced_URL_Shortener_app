import { Router } from 'express';
import {
    getOverallAnalytics,
    getTopicBasedAnalytics,
    getUrlAnalytics
} from '../controllers/user.analyticController.js';

const router = Router();

router.route("/analytics/:alias").get(getUrlAnalytics);
router.route("/analytics/topic/:topic").get(getTopicBasedAnalytics);
router.route("/analytics/overall").get(getOverallAnalytics);

export default router;