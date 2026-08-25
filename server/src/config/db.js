import mongoose from 'mongoose';
import dns from 'node:dns';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDatabaseIfEmpty } from './seedHelper.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback if custom DNS cannot be set
}

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/youtube_clone';
  
  try {
    // Attempt local or environment MongoDB connection with a 15s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000
    });
    console.log(`[MongoDB Connected]: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Local Connection Failed]: ${error.message}`);
    console.log('[MongoDB Fallback]: Initializing MongoMemoryServer for instant execution...');
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[MongoDB Memory Server Connected]: ${memoryUri}`);
    } catch (memErr) {
      console.error('[MongoDB Error]: Could not start MongoMemoryServer', memErr);
      process.exit(1);
    }
  }

  // Ensure sample data is seeded if collection is empty
  await seedDatabaseIfEmpty();
};
