import express from 'express';
import { createChannel, getChannelById, getMyChannels, toggleSubscribeChannel, updateChannel } from '../controllers/channelController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createChannel);
router.get('/user/me', protect, getMyChannels);
router.get('/:id', getChannelById);
router.put('/:id', protect, updateChannel);
router.post('/:id/subscribe', protect, toggleSubscribeChannel);

export default router;
