import express from 'express';
import { createChannel, getChannelById, getMyChannels } from '../controllers/channelController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createChannel);
router.get('/user/me', protect, getMyChannels);
router.get('/:id', getChannelById);

export default router;
