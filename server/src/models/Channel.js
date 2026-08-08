import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, 'Channel name is required'],
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    channelBanner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    },
    subscribers: {
      type: Number,
      default: 0
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
      }
    ]
  },
  {
    timestamps: true
  }
);

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;
