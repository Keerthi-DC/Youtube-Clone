import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

// @desc    Get all videos (Supports ?search= and ?category=)
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate('channelId', 'channelName channelBanner subscribers')
      .populate('uploader', 'username avatar')
      .sort({ uploadDate: -1 });

    res.json(videos);
  } catch (error) {
    console.error('[Get Videos Error]:', error);
    res.status(500).json({ message: 'Server error fetching videos', error: error.message });
  }
};

// @desc    Get single video by ID (increments views count)
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('channelId', 'channelName channelBanner subscribers description')
      .populate('uploader', 'username avatar');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    console.error('[Get Video By ID Error]:', error);
    res.status(500).json({ message: 'Server error fetching video', error: error.message });
  }
};

// @desc    Create / Upload new video
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res) => {
  try {
    const { title, thumbnailUrl, videoUrl, description, category, channelId } = req.body;

    if (!title || !thumbnailUrl || !videoUrl || !channelId) {
      return res.status(400).json({ message: 'Please provide title, thumbnailUrl, videoUrl, and channelId' });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to upload to this channel' });
    }

    const video = await Video.create({
      title,
      thumbnailUrl,
      videoUrl,
      description: description || '',
      category: category || 'Coding',
      channelId,
      uploader: req.user._id,
      likes: [],
      dislikes: []
    });

    // Add video to channel's videos array
    channel.videos.push(video._id);
    await channel.save();

    const populatedVideo = await Video.findById(video._id)
      .populate('channelId', 'channelName channelBanner subscribers')
      .populate('uploader', 'username avatar');

    res.status(201).json(populatedVideo);
  } catch (error) {
    console.error('[Create Video Error]:', error);
    res.status(500).json({ message: 'Server error creating video', error: error.message });
  }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this video' });
    }

    const { title, thumbnailUrl, videoUrl, description, category } = req.body;

    video.title = title || video.title;
    video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;
    video.videoUrl = videoUrl || video.videoUrl;
    video.description = description !== undefined ? description : video.description;
    video.category = category || video.category;

    await video.save();

    const updatedVideo = await Video.findById(video._id)
      .populate('channelId', 'channelName channelBanner subscribers')
      .populate('uploader', 'username avatar');

    res.json(updatedVideo);
  } catch (error) {
    console.error('[Update Video Error]:', error);
    res.status(500).json({ message: 'Server error updating video', error: error.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }

    // Remove from channel.videos array
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: video._id }
    });

    await video.deleteOne();

    res.json({ message: 'Video deleted successfully', videoId: req.params.id });
  } catch (error) {
    console.error('[Delete Video Error]:', error);
    res.status(500).json({ message: 'Server error deleting video', error: error.message });
  }
};

// @desc    Toggle Like on video
// @route   POST /api/videos/:id/like
// @access  Private
export const toggleLikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user._id;
    const isLiked = video.likes.some((id) => id.toString() === userId.toString());
    const isDisliked = video.dislikes.some((id) => id.toString() === userId.toString());

    if (isLiked) {
      // Remove like
      video.likes = video.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Add like and remove dislike if present
      video.likes.push(userId);
      if (isDisliked) {
        video.dislikes = video.dislikes.filter((id) => id.toString() !== userId.toString());
      }
    }

    await video.save();
    res.json({
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length,
      isLiked: !isLiked,
      isDisliked: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error toggling like', error: error.message });
  }
};

// @desc    Toggle Dislike on video
// @route   POST /api/videos/:id/dislike
// @access  Private
export const toggleDislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user._id;
    const isLiked = video.likes.some((id) => id.toString() === userId.toString());
    const isDisliked = video.dislikes.some((id) => id.toString() === userId.toString());

    if (isDisliked) {
      // Remove dislike
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Add dislike and remove like if present
      video.dislikes.push(userId);
      if (isLiked) {
        video.likes = video.likes.filter((id) => id.toString() !== userId.toString());
      }
    }

    await video.save();
    res.json({
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length,
      isLiked: false,
      isDisliked: !isDisliked
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error toggling dislike', error: error.message });
  }
};

// @desc    Get videos from channels the logged-in user is subscribed to
// @route   GET /api/videos/subscriptions
// @access  Private
export const getSubscriptionsFeed = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user._id);

    if (!user || !user.subscribedChannels || user.subscribedChannels.length === 0) {
      return res.json([]);
    }

    const videos = await Video.find({ channelId: { $in: user.subscribedChannels } })
      .populate('channelId', 'channelName channelBanner subscribers')
      .populate('uploader', 'username avatar')
      .sort({ uploadDate: -1 });

    res.json(videos);
  } catch (error) {
    console.error('[Get Subscriptions Feed Error]:', error);
    res.status(500).json({ message: 'Server error fetching subscriptions feed', error: error.message });
  }
};

// @desc    Get all videos liked by logged-in user
// @route   GET /api/videos/liked
// @access  Private
export const getLikedVideos = async (req, res) => {
  try {
    const videos = await Video.find({ likes: req.user._id })
      .populate('channelId', 'channelName channelBanner subscribers')
      .populate('uploader', 'username avatar')
      .sort({ uploadDate: -1 });

    res.json(videos);
  } catch (error) {
    console.error('[Get Liked Videos Error]:', error);
    res.status(500).json({ message: 'Server error fetching liked videos', error: error.message });
  }
};
