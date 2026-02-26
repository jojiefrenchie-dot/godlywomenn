import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_URI_PROD
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/godlywomen';

    if (!mongoUri) {
      throw new Error('MongoDB connection URI not configured');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected:', mongoUri.split('@')[1] || mongoUri);
  } catch (error) {
    console.warn('⚠️ MongoDB connection warning:', error instanceof Error ? error.message : error);
    // Don't exit - allow server to run without database for testing
  }
};

export default connectDB;
