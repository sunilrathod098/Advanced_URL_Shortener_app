import { Router } from 'express';
import {
    createShortUrl,
    deleteUrl,
    getUrl,
    getUserUrls,
    redirectToOriginalUrl,
    updateUrl
} from '../controllers/user.urlController.js';
import { verifyGoogleToken } from '../middleware/auth.middleware.js';

const router = Router();
router.route("/short-url").post(verifyGoogleToken, createShortUrl);
router.route("/short-url/:alias").get(verifyGoogleToken, redirectToOriginalUrl);

//CRUD operations for URL (Optional)
router.route("/urls").get(verifyGoogleToken, getUserUrls);
router.route("/urls/:urlId").get(getUrl);
router.route("/urls/:urlId").put(updateUrl);
router.route("/urls/:urlId").delete(deleteUrl);

export default router;