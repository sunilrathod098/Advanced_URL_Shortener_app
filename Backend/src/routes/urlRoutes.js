import { Router } from 'express';
import {
    createShortUrl,
    deleteUrl,
    getUrl,
    getUserUrls,
    redirectToOriginalUrl,
    updateUrl
} from '../controllers/userUrlController.js';
import { verifyGoogleToken } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/url/short-url:
 *   post:
 *     summary: Create a shortened URL
 *     description: Accepts a URL and returns a shortened version.
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL to shorten.
 *     responses:
 *       200:
 *         description: The shortened URL.
 *       400:
 *         description: Invalid URL format.
 */
router.route("/short-url").post(verifyGoogleToken, createShortUrl);

/**
 * @swagger
 * /api/url/short-url/{alias}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: Redirects to the original URL from the shortened URL alias.
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The alias of the shortened URL.
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to the original URL.
 */
router.route("/short-url/:alias").get(verifyGoogleToken, redirectToOriginalUrl);

/**
 * @swagger
 * /api/url/urls:
 *   get:
 *     summary: Get all URLs of the user
 *     description: Retrieves a list of all URLs created by the authenticated user.
 *     tags: [URL]
 *     responses:
 *       200:
 *         description: List of URLs.
 */
router.route("/urls").get(verifyGoogleToken, getUserUrls);

/**
 * @swagger
 * /api/url/urls/{urlId}:
 *   get:
 *     summary: Get details of a specific URL
 *     description: Retrieves details of a URL based on the provided ID.
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: urlId
 *         required: true
 *         description: The ID of the URL.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL details.
 */
router.route("/urls/:urlId").get(getUrl);

/**
 * @swagger
 * /api/url/urls/{urlId}:
 *   put:
 *     summary: Update a specific URL
 *     description: Updates the URL details with the provided ID.
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: urlId
 *         required: true
 *         description: The ID of the URL.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The new URL to update.
 *     responses:
 *       200:
 *         description: URL updated successfully.
 *       400:
 *         description: Invalid URL format.
 */
router.route("/urls/:urlId").put(updateUrl);

/**
 * @swagger
 * /api/url/urls/{urlId}:
 *   delete:
 *     summary: Delete a specific URL
 *     description: Deletes the URL with the given ID.
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: urlId
 *         required: true
 *         description: The ID of the URL.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL deleted successfully.
 */
router.route("/urls/:urlId").delete(deleteUrl);

export default router;
