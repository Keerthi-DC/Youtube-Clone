import express from 'express';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  toggleLikeVideo,
  toggleDislikeVideo,
  getSubscriptionsFeed,
  getLikedVideos
} from '../controllers/videoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getVideos);
router.get('/subscriptions', protect, getSubscriptionsFeed);
router.get('/liked', protect, getLikedVideos);
router.get('/:id', getVideoById);
router.post('/', protect, createVideo);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);
router.post('/:id/like', protect, toggleLikeVideo);
router.post('/:id/dislike', protect, toggleDislikeVideo);

export default router;
