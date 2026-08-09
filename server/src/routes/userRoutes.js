import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getWatchHistory,
  logWatchHistory,
  clearWatchHistory
} from '../controllers/userController.js';

const router = express.Router();

router.get('/history', protect, getWatchHistory);
router.post('/history/:videoId', protect, logWatchHistory);
router.delete('/history', protect, clearWatchHistory);

export default router;
