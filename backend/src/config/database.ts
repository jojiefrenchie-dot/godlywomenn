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
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
