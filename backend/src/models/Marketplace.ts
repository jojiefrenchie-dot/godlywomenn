import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketplaceListing extends Document {
  owner: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price?: string;
  currency: string;
  type: 'Product' | 'Service' | 'Event';
  contact?: string;
  countryCode?: string;
  image?: string;
  date?: Date;
  created_at: Date;
  updated_at: Date;
}

const marketplaceListingSchema = new Schema<IMarketplaceListing>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 255
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    enum: ['KSH', 'USD', 'EUR', 'GBP', 'ZAR', 'UGX', 'TZS', 'RWF', 'ETB', 'NGN', 'GHS'],
    default: 'KSH'
  },
  type: {
    type: String,
    enum: ['Product', 'Service', 'Event'],
    default: 'Product'
  },
  contact: {
    type: String,
    default: ''
  },
  countryCode: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  date: {
    type: Date,
    default: null
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

export default mongoose.model<IMarketplaceListing>('MarketplaceListing', marketplaceListingSchema);
