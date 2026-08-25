import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import { connectDB } from './src/config/db.js';
import User from './src/models/User.js';
import Channel from './src/models/Channel.js';
import Video from './src/models/Video.js';
import Comment from './src/models/Comment.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback if custom DNS cannot be set
}

dotenv.config();

const sampleUsers = [
  {
    username: 'JohnDoe',
    email: 'john@example.com',
    password: 'Pass@1234',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  {
    username: 'CodeWithSara',
    email: 'sara@example.com',
    password: 'Pass@1234',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    username: 'TechGeek',
    email: 'alex@example.com',
    password: 'Pass@1234',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
  }
];

const sampleVideos = [
  {
    title: 'Learn React in 30 Minutes - Complete Beginner Tutorial',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
    description: 'A comprehensive quick tutorial to get started with React 19, hooks, component state, props, and modern frontend development.',
    category: 'React',
    views: 15200,
    likes: [],
    dislikes: []
  },
  {
    title: 'Build a Full-Stack MERN Application from Scratch',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
    description: 'Learn how to connect MongoDB, Express.js, React, and Node.js with JWT authentication and RESTful APIs.',
    category: 'Coding',
    views: 48900,
    likes: [],
    dislikes: []
  },
  {
    title: 'Top 10 JavaScript Best Practices for 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    description: 'Clean code guidelines, async/await patterns, ES modules, performance optimizations, and debugging tips.',
    category: 'Coding',
    views: 23100,
    likes: [],
    dislikes: []
  },
  {
    title: 'Relaxing Lo-Fi Beats for Coding and Studying',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    description: 'Chill aesthetic lo-fi music stream for deep work sessions and late night programming.',
    category: 'Music',
    views: 94200,
    likes: [],
    dislikes: []
  },
  {
    title: 'Next-Gen Game Engine Showcase & Real-Time Graphics',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
    description: 'Exploring photorealistic rendering, ray tracing, physics engines, and AAA game mechanics.',
    category: 'Gaming',
    views: 61500,
    likes: [],
    dislikes: []
  },
  {
    title: 'Tech News Daily: AI Advances and Cloud Computing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'The latest updates in software engineering, artificial intelligence, microservices, and web dev.',
    category: 'Tech',
    views: 31800,
    likes: [],
    dislikes: []
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeding]: Clearing existing database collections...');
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});

    console.log('[Seeding]: Creating sample users...');
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const john = createdUsers[0];
    const sara = createdUsers[1];
    const alex = createdUsers[2];

    console.log('[Seeding]: Creating sample channels...');
    const channel1 = await Channel.create({
      channelName: 'Code with John',
      owner: john._id,
      description: 'Coding tutorials and tech reviews by John Doe.',
      channelBanner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      subscribers: [alex._id, sara._id],
      videos: []
    });

    const channel2 = await Channel.create({
      channelName: 'Sara React Mastery',
      owner: sara._id,
      description: 'Master React, Tailwind, and Modern Web Design.',
      channelBanner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      subscribers: [alex._id, john._id],
      videos: []
    });

    // Link channels to users
    john.channels.push(channel1._id);
    john.subscribedChannels.push(channel2._id);
    await john.save();

    sara.channels.push(channel2._id);
    sara.subscribedChannels.push(channel1._id);
    await sara.save();

    alex.subscribedChannels.push(channel1._id, channel2._id);
    await alex.save();

    console.log('[Seeding]: Creating sample videos...');
    const createdVideos = [];
    for (let i = 0; i < sampleVideos.length; i++) {
      const v = sampleVideos[i];
      const targetChannel = i % 2 === 0 ? channel1 : channel2;
      const targetUploader = i % 2 === 0 ? john : sara;

      const video = await Video.create({
        ...v,
        channelId: targetChannel._id,
        uploader: targetUploader._id,
        likes: [sara._id, alex._id],
        dislikes: []
      });

      targetChannel.videos.push(video._id);
      await targetChannel.save();
      createdVideos.push(video);
    }

    console.log('[Seeding]: Creating sample comments...');
    await Comment.create({
      videoId: createdVideos[0]._id,
      userId: sara._id,
      text: 'Great video! Extremely clear explanation of React fundamentals.',
      timestamp: new Date('2026-08-01T10:15:00Z')
    });

    await Comment.create({
      videoId: createdVideos[0]._id,
      userId: alex._id,
      text: 'This saved me hours of frustration. Thanks John!',
      timestamp: new Date('2026-08-02T14:30:00Z')
    });

    await Comment.create({
      videoId: createdVideos[1]._id,
      userId: john._id,
      text: 'Awesome breakdown on MERN stack architecture.',
      timestamp: new Date('2026-08-03T09:00:00Z')
    });

    console.log('✅ [Seeding Complete]: Database successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seeding Error]:', error);
    process.exit(1);
  }
};

seedData();
