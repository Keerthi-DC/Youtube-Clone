import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required']
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required']
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'Coding',
      enum: ['Coding', 'React', 'Music', 'Gaming', 'News', 'Podcasts', 'Tech', 'All']
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Video = mongoose.model('Video', videoSchema);
export default Video;
