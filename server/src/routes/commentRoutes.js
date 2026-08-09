import express from 'express';
import {
  getCommentsByVideo,
  addComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
  addCommentReply
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/video/:videoId', getCommentsByVideo);
router.post('/', protect, addComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleLikeComment);
router.post('/:id/reply', protect, addCommentReply);

export default router;
