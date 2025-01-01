import { Router } from 'express';
import { googleSignIn } from '../controllers/user.authController.js';

const router = Router();


router.route('/google').post(googleSignIn);


export default router;