"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrayerResponse = exports.likePrayerResponse = exports.createPrayerResponse = exports.getPrayerResponses = exports.supportPrayer = exports.deletePrayer = exports.updatePrayer = exports.getPrayer = exports.createPrayer = exports.listPrayers = void 0;
const Prayer_1 = require("../models/Prayer");
const validation_1 = require("../utils/validation");
const listPrayers = async (req, res) => {
    try {
        const { page, limit, skip } = (0, validation_1.parseQuery)(req.query);
        const { prayer_type, search } = req.query;
        let query = { is_public: true };
        if (prayer_type)
            query.prayer_type = prayer_type;
        if (search)
            query.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
        const total = await Prayer_1.Prayer.countDocuments(query);
        const prayers = await Prayer_1.Prayer.find(query)
            .populate('author', 'email name image')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);
        res.json({ results: prayers, count: total, page, limit });
    }
    catch (error) {
        console.error('List prayers error:', error);
        res.status(500).json({ error: 'Failed to list prayers' });
    }
};
exports.listPrayers = listPrayers;
const createPrayer = async (req, res) => {
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
        const prayer = new Prayer_1.Prayer({
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
    }
    catch (error) {
        console.error('Create prayer error:', error);
        res.status(500).json({ error: 'Failed to create prayer' });
    }
};
exports.createPrayer = createPrayer;
const getPrayer = async (req, res) => {
    try {
        const prayer = await Prayer_1.Prayer.findById(req.params.id).populate('author', 'email name image');
        if (!prayer) {
            res.status(404).json({ error: 'Prayer not found' });
            return;
        }
        const supporters = await Prayer_1.PrayerSupport.countDocuments({ prayer: req.params.id });
        const responses = await Prayer_1.PrayerResponse.countDocuments({ prayer: req.params.id });
        res.json({ ...prayer.toObject(), supporters_count: supporters, responses_count: responses });
    }
    catch (error) {
        console.error('Get prayer error:', error);
        res.status(500).json({ error: 'Failed to get prayer' });
    }
};
exports.getPrayer = getPrayer;
const updatePrayer = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const prayer = await Prayer_1.Prayer.findById(req.params.id);
        if (!prayer || prayer.author.toString() !== req.user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        Object.assign(prayer, req.body);
        await prayer.save();
        res.json({ message: 'Prayer updated', ...prayer.toObject() });
    }
    catch (error) {
        console.error('Update prayer error:', error);
        res.status(500).json({ error: 'Failed to update prayer' });
    }
};
exports.updatePrayer = updatePrayer;
const deletePrayer = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const prayer = await Prayer_1.Prayer.findById(req.params.id);
        if (!prayer || prayer.author.toString() !== req.user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        await Prayer_1.Prayer.deleteOne({ _id: req.params.id });
        await Prayer_1.PrayerResponse.deleteMany({ prayer: req.params.id });
        await Prayer_1.PrayerSupport.deleteMany({ prayer: req.params.id });
        res.json({ message: 'Prayer deleted' });
    }
    catch (error) {
        console.error('Delete prayer error:', error);
        res.status(500).json({ error: 'Failed to delete prayer' });
    }
};
exports.deletePrayer = deletePrayer;
const supportPrayer = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const existing = await Prayer_1.PrayerSupport.findOne({ prayer: req.params.id, user: req.user.id });
        if (existing) {
            await Prayer_1.PrayerSupport.deleteOne({ _id: existing._id });
            res.json({ message: 'Support removed', supported: false });
        }
        else {
            await Prayer_1.PrayerSupport.create({ prayer: req.params.id, user: req.user.id });
            res.json({ message: 'Support added', supported: true });
        }
    }
    catch (error) {
        console.error('Support prayer error:', error);
        res.status(500).json({ error: 'Failed to support prayer' });
    }
};
exports.supportPrayer = supportPrayer;
const getPrayerResponses = async (req, res) => {
    try {
        const { page, limit, skip } = (0, validation_1.parseQuery)(req.query);
        const responses = await Prayer_1.PrayerResponse.find({ prayer: req.params.id })
            .populate('author', 'email name image')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);
        res.json({ results: responses, page, limit });
    }
    catch (error) {
        console.error('Get prayer responses error:', error);
        res.status(500).json({ error: 'Failed to get responses' });
    }
};
exports.getPrayerResponses = getPrayerResponses;
const createPrayerResponse = async (req, res) => {
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
        const response = new Prayer_1.PrayerResponse({
            prayer: req.params.id,
            author: req.user.id,
            content
        });
        await response.save();
        await response.populate('author', 'email name image');
        res.status(201).json({ message: 'Response created', ...response.toObject() });
    }
    catch (error) {
        console.error('Create prayer response error:', error);
        res.status(500).json({ error: 'Failed to create response' });
    }
};
exports.createPrayerResponse = createPrayerResponse;
const likePrayerResponse = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const existing = await Prayer_1.PrayerResponseLike.findOne({ response: req.params.responseId, user: req.user.id });
        if (existing) {
            await Prayer_1.PrayerResponseLike.deleteOne({ _id: existing._id });
            res.json({ message: 'Like removed', liked: false });
        }
        else {
            await Prayer_1.PrayerResponseLike.create({ response: req.params.responseId, user: req.user.id });
            res.json({ message: 'Like added', liked: true });
        }
    }
    catch (error) {
        console.error('Like prayer response error:', error);
        res.status(500).json({ error: 'Failed to like response' });
    }
};
exports.likePrayerResponse = likePrayerResponse;
const deletePrayerResponse = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const response = await Prayer_1.PrayerResponse.findById(req.params.responseId);
        if (!response || response.author.toString() !== req.user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        await Prayer_1.PrayerResponse.deleteOne({ _id: req.params.responseId });
        await Prayer_1.PrayerResponseLike.deleteMany({ response: req.params.responseId });
        res.json({ message: 'Response deleted' });
    }
    catch (error) {
        console.error('Delete prayer response error:', error);
        res.status(500).json({ error: 'Failed to delete response' });
    }
};
exports.deletePrayerResponse = deletePrayerResponse;
//# sourceMappingURL=prayerController.js.map