import Channel from '../models/Channel.js';
import User from '../models/User.js';

// @desc    Create a new channel
// @route   POST /api/channels
// @access  Private
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    const channel = await Channel.create({
      channelName,
      description: description || '',
      channelBanner: channelBanner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      owner: req.user._id,
      subscribers: [],
      videos: []
    });

    // Add channel to user's channels array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id }
    });

    res.status(201).json(channel);
  } catch (error) {
    console.error('[Create Channel Error]:', error);
    res.status(500).json({ message: 'Server error creating channel', error: error.message });
  }
};

// @desc    Get channel by ID with videos populated
// @route   GET /api/channels/:id
// @access  Public
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username email avatar')
      .populate({
        path: 'videos',
        populate: { path: 'uploader', select: 'username avatar' },
        options: { sort: { uploadDate: -1 } }
      });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    console.error('[Get Channel Error]:', error);
    res.status(500).json({ message: 'Server error fetching channel', error: error.message });
  }
};

// @desc    Get channels of authenticated user
// @route   GET /api/channels/user/me
// @access  Private
export const getMyChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user._id }).populate('videos');
    res.json(channels);
  } catch (error) {
    console.error('[Get My Channels Error]:', error);
    res.status(500).json({ message: 'Server error fetching user channels', error: error.message });
  }
};

// @desc    Toggle channel subscription state
// @route   POST /api/channels/:id/subscribe
// @access  Private
export const toggleSubscribeChannel = async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure subscribers array exists
    if (!Array.isArray(channel.subscribers)) {
      channel.subscribers = [];
    }

    // Ensure user's subscribedChannels array exists
    if (!Array.isArray(user.subscribedChannels)) {
      user.subscribedChannels = [];
    }

    const isSubscribed = channel.subscribers.some(
      (subId) => subId.toString() === userId.toString()
    );

    if (isSubscribed) {
      // Unsubscribe
      channel.subscribers = channel.subscribers.filter(
        (subId) => subId.toString() !== userId.toString()
      );
      user.subscribedChannels = user.subscribedChannels.filter(
        (chId) => chId.toString() !== channelId.toString()
      );
    } else {
      // Subscribe
      channel.subscribers.push(userId);
      user.subscribedChannels.push(channelId);
    }

    await channel.save();
    await user.save();

    res.json({
      isSubscribed: !isSubscribed,
      subscribersCount: channel.subscribers.length,
      message: isSubscribed ? 'Unsubscribed successfully' : 'Subscribed successfully'
    });
  } catch (error) {
    console.error('[Toggle Subscribe Error]:', error);
    res.status(500).json({ message: 'Server error toggling subscription', error: error.message });
  }
};

// @desc    Update channel information
// @route   PUT /api/channels/:id
// @access  Private (Owner only)
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this channel' });
    }

    const { channelName, description, channelBanner } = req.body;

    if (channelName) channel.channelName = channelName.trim();
    if (description !== undefined) channel.description = description.trim();
    if (channelBanner) channel.channelBanner = channelBanner.trim();

    await channel.save();

    const updatedChannel = await Channel.findById(channel._id)
      .populate('owner', 'username email avatar')
      .populate({
        path: 'videos',
        populate: { path: 'uploader', select: 'username avatar' }
      });

    res.json(updatedChannel);
  } catch (error) {
    console.error('[Update Channel Error]:', error);
    res.status(500).json({ message: 'Server error updating channel', error: error.message });
  }
};

