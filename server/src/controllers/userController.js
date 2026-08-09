import User from '../models/User.js';

// @desc    Get user's watch history
// @route   GET /api/users/history
// @access  Private
export const getWatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'watchHistory.video',
      populate: {
        path: 'uploader',
        select: 'channelName owner description'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sort watch history by latest watchedAt
    const history = user.watchHistory
      .filter((item) => item.video != null)
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));

    res.json(history);
  } catch (error) {
    console.error('[Error fetching watch history]:', error);
    res.status(500).json({ message: 'Failed to fetch watch history', error: error.message });
  }
};

// @desc    Log a video view to watch history
// @route   POST /api/users/history/:videoId
// @access  Private
export const logWatchHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove existing entry for video if present
    user.watchHistory = user.watchHistory.filter(
      (item) => item.video && item.video.toString() !== videoId
    );

    // Unshift new entry
    user.watchHistory.unshift({
      video: videoId,
      watchedAt: new Date()
    });

    // Limit history length to 100 entries
    if (user.watchHistory.length > 100) {
      user.watchHistory = user.watchHistory.slice(0, 100);
    }

    await user.save();
    res.json({ message: 'Watch history updated', historyCount: user.watchHistory.length });
  } catch (error) {
    console.error('[Error logging watch history]:', error);
    res.status(500).json({ message: 'Failed to log watch history', error: error.message });
  }
};

// @desc    Clear user's watch history
// @route   DELETE /api/users/history
// @access  Private
export const clearWatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.watchHistory = [];
    await user.save();

    res.json({ message: 'Watch history cleared successfully' });
  } catch (error) {
    console.error('[Error clearing watch history]:', error);
    res.status(500).json({ message: 'Failed to clear watch history', error: error.message });
  }
};
