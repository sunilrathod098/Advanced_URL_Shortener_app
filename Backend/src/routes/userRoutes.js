import { Router } from "express";
import { googleSignIn } from '../controllers/userAuthController.js';
import { verifyGoogleToken } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/auth/google-signin:
 *   post:
 *     summary: Sign in with Google
 *     description: Allows users to sign in using their Google account.
 *     tags: [Auth]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Bearer token for Google sign-in (Google ID token).
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer your-google-id-token-here"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email for fallback email/password login (optional).
 *               password:
 *                 type: string
 *                 description: User's password for fallback email/password login (optional).
 *     responses:
 *       200:
 *         description: Successfully signed in.
 *       400:
 *         description: Invalid token or request.
 */
router.route('/google-signin').post(verifyGoogleToken, googleSignIn);

export default router;
