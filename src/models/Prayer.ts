// MongoDB/Mongoose models removed - use HTTP API or custom database implementation instead

export interface IPrayer {
  _id?: string;
  title: string;
  content: string;
  prayer_type: 'request' | 'testimony' | 'praise';
  is_anonymous: boolean;
  is_public: boolean;
  author: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPrayerResponse {
  _id?: string;
  prayer: string;
  author: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPrayerSupport {
  _id?: string;
  prayer: string;
  user: string;
  created_at: Date;
}

export interface IPrayerResponseLike {
  _id?: string;
  response: string;
  user: string;
  created_at: Date;
}

// Schemas removed
export const Prayer = null;
export const PrayerResponse = null;
export const PrayerSupport = null;
export const PrayerResponseLike = null;
