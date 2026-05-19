import express from 'express';
import { googleLogin, devLogin, getProfile } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/google', googleLogin);
router.post('/dev-login', devLogin);
router.get('/profile', authMiddleware, getProfile);

export default router;
