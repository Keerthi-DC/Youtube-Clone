import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

// @desc    Get comments for a video
// @route   GET /api/comments/video/:videoId
// @access  Public
export const getCommentsByVideo = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate('userId', 'username avatar')
      .populate('replies.userId', 'username avatar')
      .sort({ timestamp: -1 });

    res.json(comments);
  } catch (error) {
    console.error('[Get Comments Error]:', error);
    res.status(500).json({ message: 'Server error fetching comments', error: error.message });
  }
};

// @desc    Add comment to a video
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;

    if (!videoId || !text) {
      return res.status(400).json({ message: 'Video ID and comment text are required' });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = await Comment.create({
      videoId,
      userId: req.user._id,
      text: text.trim(),
      likes: [],
      replies: []
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username avatar')
      .populate('replies.userId', 'username avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('[Add Comment Error]:', error);
    res.status(500).json({ message: 'Server error adding comment', error: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.text = text.trim();
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username avatar')
      .populate('replies.userId', 'username avatar');
    res.json(updatedComment);
  } catch (error) {
    console.error('[Update Comment Error]:', error);
    res.status(500).json({ message: 'Server error updating comment', error: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully', commentId: req.params.id });
  } catch (error) {
    console.error('[Delete Comment Error]:', error);
    res.status(500).json({ message: 'Server error deleting comment', error: error.message });
  }
};

// @desc    Toggle like on a comment
// @route   POST /api/comments/:id/like
// @access  Private
export const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (!Array.isArray(comment.likes)) {
      comment.likes = [];
    }

    const userId = req.user._id;
    const isLiked = comment.likes.some((id) => id.toString() === userId.toString());

    if (isLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.json({
      likesCount: comment.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error('[Like Comment Error]:', error);
    res.status(500).json({ message: 'Server error liking comment', error: error.message });
  }
};

// @desc    Add a reply to a comment thread
// @route   POST /api/comments/:id/reply
// @access  Private
export const addCommentReply = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (!Array.isArray(comment.replies)) {
      comment.replies = [];
    }

    comment.replies.push({
      userId: req.user._id,
      text: text.trim(),
      createdAt: new Date()
    });

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username avatar')
      .populate('replies.userId', 'username avatar');

    res.status(201).json(updatedComment);
  } catch (error) {
    console.error('[Add Reply Error]:', error);
    res.status(500).json({ message: 'Server error adding reply', error: error.message });
  }
};
