import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  bio?: string;
  image?: string;
  location?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: Date;
  updated_at: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: null
  },
  facebook: {
    type: String,
    default: null
  },
  twitter: {
    type: String,
    default: null
  },
  instagram: {
    type: String,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_superuser: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.updated_at = new Date();
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Return safe user object
userSchema.methods.toJSON = function() {
  const { password, ...rest } = this.toObject();
  return rest;
};

export default mongoose.model<IUser>('User', userSchema);
