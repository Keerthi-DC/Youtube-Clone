import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        text: {
          type: String,
          required: true,
          trim: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
