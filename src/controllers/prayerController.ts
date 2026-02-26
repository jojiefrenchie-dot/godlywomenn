import { Response } from 'express';
import { Prayer, PrayerResponse, PrayerSupport, PrayerResponseLike } from '../models/Prayer';
import { AuthRequest } from '../config/auth';
import { parseQuery } from '../utils/validation';

export const listPrayers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = parseQuery(req.query);
    const { prayer_type, search } = req.query;

    let query: any = { is_public: true };
    if (prayer_type) query.prayer_type = prayer_type;
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];

    const total = await Prayer.countDocuments(query);
    const prayers = await Prayer.find(query)
      .populate('author', 'email name image')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ results: prayers, count: total, page, limit });
  } catch (error) {
    console.error('List prayers error:', error);
    res.status(500).json({ error: 'Failed to list prayers' });
  }
};

export const createPrayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { title, content, prayer_type, is_anonymous, is_public } = req.body;
    if (!title || !content) {
      res.status(400).json({ error: 'Title and content required' });
      return;
    }

    const prayer = new Prayer({
      title,
      content,
      prayer_type: prayer_type || 'request',
      is_anonymous: is_anonymous || false,
      is_public: is_public !== false,
      author: req.user.id
    });

    await prayer.save();
    await prayer.populate('author', 'email name image');

    res.status(201).json({ message: 'Prayer created', ...prayer.toObject() });
  } catch (error) {
    console.error('Create prayer error:', error);
    res.status(500).json({ error: 'Failed to create prayer' });
  }
};

export const getPrayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const prayer = await Prayer.findById(req.params.id).populate('author', 'email name image');
    if (!prayer) {
      res.status(404).json({ error: 'Prayer not found' });
      return;
    }

    const supporters = await PrayerSupport.countDocuments({ prayer: req.params.id });
    const responses = await PrayerResponse.countDocuments({ prayer: req.params.id });

    res.json({ ...prayer.toObject(), supporters_count: supporters, responses_count: responses });
  } catch (error) {
    console.error('Get prayer error:', error);
    res.status(500).json({ error: 'Failed to get prayer' });
  }
};

export const updatePrayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const prayer = await Prayer.findById(req.params.id);
    if (!prayer || prayer.author.toString() !== req.user.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    Object.assign(prayer, req.body);
    await prayer.save();

    res.json({ message: 'Prayer updated', ...prayer.toObject() });
  } catch (error) {
    console.error('Update prayer error:', error);
    res.status(500).json({ error: 'Failed to update prayer' });
  }
};

export const deletePrayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const prayer = await Prayer.findById(req.params.id);
    if (!prayer || prayer.author.toString() !== req.user.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await Prayer.deleteOne({ _id: req.params.id });
    await PrayerResponse.deleteMany({ prayer: req.params.id });
    await PrayerSupport.deleteMany({ prayer: req.params.id });

    res.json({ message: 'Prayer deleted' });
  } catch (error) {
    console.error('Delete prayer error:', error);
    res.status(500).json({ error: 'Failed to delete prayer' });
  }
};

export const supportPrayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const existing = await PrayerSupport.findOne({ prayer: req.params.id, user: req.user.id });
    if (existing) {
      await PrayerSupport.deleteOne({ _id: existing._id });
      res.json({ message: 'Support removed', supported: false });
    } else {
      await PrayerSupport.create({ prayer: req.params.id, user: req.user.id });
      res.json({ message: 'Support added', supported: true });
    }
  } catch (error) {
    console.error('Support prayer error:', error);
    res.status(500).json({ error: 'Failed to support prayer' });
  }
};

export const getPrayerResponses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = parseQuery(req.query);
    const responses = await PrayerResponse.find({ prayer: req.params.id })
      .populate('author', 'email name image')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ results: responses, page, limit });
  } catch (error) {
    console.error('Get prayer responses error:', error);
    res.status(500).json({ error: 'Failed to get responses' });
  }
};

export const createPrayerResponse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content required' });
      return;
    }

    const response = new PrayerResponse({
      prayer: req.params.id,
      author: req.user.id,
      content
    });

    await response.save();
    await response.populate('author', 'email name image');

    res.status(201).json({ message: 'Response created', ...response.toObject() });
  } catch (error) {
    console.error('Create prayer response error:', error);
    res.status(500).json({ error: 'Failed to create response' });
  }
};

export const likePrayerResponse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const existing = await PrayerResponseLike.findOne({ response: req.params.responseId, user: req.user.id });
    if (existing) {
      await PrayerResponseLike.deleteOne({ _id: existing._id });
      res.json({ message: 'Like removed', liked: false });
    } else {
      await PrayerResponseLike.create({ response: req.params.responseId, user: req.user.id });
      res.json({ message: 'Like added', liked: true });
    }
  } catch (error) {
    console.error('Like prayer response error:', error);
    res.status(500).json({ error: 'Failed to like response' });
  }
};

export const deletePrayerResponse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const response = await PrayerResponse.findById(req.params.responseId);
    if (!response || response.author.toString() !== req.user.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await PrayerResponse.deleteOne({ _id: req.params.responseId });
    await PrayerResponseLike.deleteMany({ response: req.params.responseId });

    res.json({ message: 'Response deleted' });
  } catch (error) {
    console.error('Delete prayer response error:', error);
    res.status(500).json({ error: 'Failed to delete response' });
  }
};
