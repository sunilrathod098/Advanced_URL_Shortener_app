import { Router } from "express";
import { googleSignIn } from '../controllers/user.authController.js';
import { verifyGoogleToken } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/google-signin').post(verifyGoogleToken, googleSignIn);

export default router;