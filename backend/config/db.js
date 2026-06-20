import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let dbType = 'mock';
const dbPath = path.resolve('data/db.json');

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.log('MONGO_URI not specified. Using Mock JSON Database fallback.');
    dbType = 'mock';
    initMockDB();
    return;
  }

  try {
    // Set connection timeout to 3 seconds to fail fast and fall back if local Mongo isn't running
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('MongoDB connected successfully.');
    dbType = 'mongodb';
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Falling back to Mock JSON Database.');
    dbType = 'mock';
    initMockDB();
  }
};

const initMockDB = () => {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify({ users: [], jobs: [], applications: [] }, null, 2)
    );
  }
};

export const getDbType = () => dbType;
