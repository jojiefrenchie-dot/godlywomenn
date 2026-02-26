// MongoDB/Mongoose models removed - use HTTP API or custom database implementation instead

export interface IMarketplaceListing {
  _id?: string;
  owner: string;
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

// Schema removed
export default null;
