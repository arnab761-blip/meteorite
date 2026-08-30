import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI inside .env.local');
}

export const connectMongoDB = async () => {
  try {
    // যদি আগে থেকেই কানেক্ট থাকে, তাহলে নতুন করে করবে না
    if (mongoose.connection.readyState === 1) {
      return true;
    }
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully! 🚀');
    return true;
  } catch (error) {
    console.log('MongoDB connection error:', error);
  }
};