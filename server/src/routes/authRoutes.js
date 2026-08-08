import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { validatePassword } from '../middleware/validatePassword.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validatePassword, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;
