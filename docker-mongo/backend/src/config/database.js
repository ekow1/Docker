import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DB,
  MONGO_PORT = 27017
} = process.env;

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

let client = null;
let db = null;

export async function connectToDatabase() {
  try {
    if (!client) {
      client = new MongoClient(mongoUrl);
      await client.connect();
      console.log('✅ Connected to MongoDB');
      
      db = client.db(MONGO_DB);
    }
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getDatabase() {
  if (!db) {
    db = await connectToDatabase();
  }
  return db;
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔌 Disconnected from MongoDB');
  }
}
