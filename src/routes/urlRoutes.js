import { Router } from 'express';
import {
    createShortUrl,
    deleteUrl,
    getUrl,
    getUserUrls,
    redirectToOriginalUrl,
    updateUrl
} from '../controllers/user.urlController.js';

const router = Router();
router.route("/short-url").post(createShortUrl);
router.route("/short-url/:alias").get(redirectToOriginalUrl);

//CRUD operations for URL (Optional)
router.route("/urls").get(getUserUrls);
router.route("/urls/:urlId").get(getUrl);
router.route("/urls/urlId").put(updateUrl);
router.route("/urls/urlId").delete(deleteUrl);

export default router;