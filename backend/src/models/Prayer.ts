import mongoose, { Schema, Document } from 'mongoose';

export interface IPrayer extends Document {
  title: string;
  content: string;
  prayer_type: 'request' | 'testimony' | 'praise';
  is_anonymous: boolean;
  is_public: boolean;
  author: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const prayerSchema = new Schema<IPrayer>({
  title: {
    type: String,
    required: true,
    maxlength: 255
  },
  content: {
    type: String,
    required: true
  },
  prayer_type: {
    type: String,
    enum: ['request', 'testimony', 'praise'],
    default: 'request'
  },
  is_anonymous: {
    type: Boolean,
    default: false
  },
  is_public: {
    type: Boolean,
    default: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

export interface IPrayerResponse extends Document {
  prayer: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  created_at: Date;
  updated_at: Date;
}

const prayerResponseSchema = new Schema<IPrayerResponse>({
  prayer: {
    type: Schema.Types.ObjectId,
    ref: 'Prayer',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
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

export interface IPrayerSupport extends Document {
  prayer: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  created_at: Date;
}

const prayerSupportSchema = new Schema<IPrayerSupport>({
  prayer: {
    type: Schema.Types.ObjectId,
    ref: 'Prayer',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

prayerSupportSchema.index({ prayer: 1, user: 1 }, { unique: true });

export interface IPrayerResponseLike extends Document {
  response: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  created_at: Date;
}

const prayerResponseLikeSchema = new Schema<IPrayerResponseLike>({
  response: {
    type: Schema.Types.ObjectId,
    ref: 'PrayerResponse',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

prayerResponseLikeSchema.index({ response: 1, user: 1 }, { unique: true });

export const Prayer = mongoose.model<IPrayer>('Prayer', prayerSchema);
export const PrayerResponse = mongoose.model<IPrayerResponse>('PrayerResponse', prayerResponseSchema);
export const PrayerSupport = mongoose.model<IPrayerSupport>('PrayerSupport', prayerSupportSchema);
export const PrayerResponseLike = mongoose.model<IPrayerResponseLike>('PrayerResponseLike', prayerResponseLikeSchema);
