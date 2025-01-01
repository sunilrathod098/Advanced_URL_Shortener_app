import { Router } from 'express';
import { googleSignIn } from '../controllers/user.authController.js';

const router = Router();


router.route('/google').get(googleSignIn);


export default router;