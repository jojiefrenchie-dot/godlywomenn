import { Response } from 'express';
import MarketplaceListing from '../models/Marketplace';
import { AuthRequest } from '../config/auth';
import { parseQuery } from '../utils/validation';

export const listListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = parseQuery(req.query);
    const { type, search } = req.query;

    let query: any = {};
    if (type) query.type = type;
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];

    const total = await MarketplaceListing.countDocuments(query);
    const listings = await MarketplaceListing.find(query)
      .populate('owner', 'email name')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ results: listings, count: total, page, limit });
  } catch (error) {
    console.error('List listings error:', error);
    res.status(500).json({ error: 'Failed to list listings' });
  }
};

export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { title, description, price, currency, type, contact, countryCode, date } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title required' });
      return;
    }

    const listing = new MarketplaceListing({
      owner: req.user.id,
      title,
      description: description || '',
      price: price || '',
      currency: currency || 'KSH',
      type: type || 'Product',
      contact: contact || '',
      countryCode: countryCode || '',
      date: date ? new Date(date) : null
    });

    if (req.file) {
      listing.image = `/media/marketplace/${req.file.filename}`;
    }

    await listing.save();
    await listing.populate('owner', 'email name');

    res.status(201).json({ message: 'Listing created', ...listing.toObject() });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
};

export const getListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id).populate('owner', 'email name');
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    res.json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
};

export const updateListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const listing = await MarketplaceListing.findById(req.params.id);
    if (!listing || listing.owner.toString() !== req.user.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    Object.assign(listing, req.body);
    if (req.file) listing.image = `/media/marketplace/${req.file.filename}`;
    if (req.body.date) listing.date = new Date(req.body.date);

    await listing.save();

    res.json({ message: 'Listing updated', ...listing.toObject() });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const listing = await MarketplaceListing.findById(req.params.id);
    if (!listing || listing.owner.toString() !== req.user.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await MarketplaceListing.deleteOne({ _id: req.params.id });

    res.json({ message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};
