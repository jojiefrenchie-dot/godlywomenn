"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.NODE_ENV === 'production'
            ? process.env.MONGODB_URI_PROD
            : process.env.MONGODB_URI || 'mongodb://localhost:27017/godlywomen';
        if (!mongoUri) {
            throw new Error('MongoDB connection URI not configured');
        }
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ MongoDB connected:', mongoUri.split('@')[1] || mongoUri);
    }
    catch (error) {
        console.warn('⚠️ MongoDB connection warning:', error instanceof Error ? error.message : error);
        // Don't exit - allow server to run without database for testing
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map