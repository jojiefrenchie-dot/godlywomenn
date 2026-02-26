"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteListing = exports.updateListing = exports.getListing = exports.createListing = exports.listListings = void 0;
const Marketplace_1 = __importDefault(require("../models/Marketplace"));
const validation_1 = require("../utils/validation");
const listListings = async (req, res) => {
    try {
        const { page, limit, skip } = (0, validation_1.parseQuery)(req.query);
        const { type, search } = req.query;
        let query = {};
        if (type)
            query.type = type;
        if (search)
            query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
        const total = await Marketplace_1.default.countDocuments(query);
        const listings = await Marketplace_1.default.find(query)
            .populate('owner', 'email name')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);
        res.json({ results: listings, count: total, page, limit });
    }
    catch (error) {
        console.error('List listings error:', error);
        res.status(500).json({ error: 'Failed to list listings' });
    }
};
exports.listListings = listListings;
const createListing = async (req, res) => {
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
        const listing = new Marketplace_1.default({
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
    }
    catch (error) {
        console.error('Create listing error:', error);
        res.status(500).json({ error: 'Failed to create listing' });
    }
};
exports.createListing = createListing;
const getListing = async (req, res) => {
    try {
        const listing = await Marketplace_1.default.findById(req.params.id).populate('owner', 'email name');
        if (!listing) {
            res.status(404).json({ error: 'Listing not found' });
            return;
        }
        res.json(listing);
    }
    catch (error) {
        console.error('Get listing error:', error);
        res.status(500).json({ error: 'Failed to get listing' });
    }
};
exports.getListing = getListing;
const updateListing = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const listing = await Marketplace_1.default.findById(req.params.id);
        if (!listing || listing.owner.toString() !== req.user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        Object.assign(listing, req.body);
        if (req.file)
            listing.image = `/media/marketplace/${req.file.filename}`;
        if (req.body.date)
            listing.date = new Date(req.body.date);
        await listing.save();
        res.json({ message: 'Listing updated', ...listing.toObject() });
    }
    catch (error) {
        console.error('Update listing error:', error);
        res.status(500).json({ error: 'Failed to update listing' });
    }
};
exports.updateListing = updateListing;
const deleteListing = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const listing = await Marketplace_1.default.findById(req.params.id);
        if (!listing || listing.owner.toString() !== req.user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        await Marketplace_1.default.deleteOne({ _id: req.params.id });
        res.json({ message: 'Listing deleted' });
    }
    catch (error) {
        console.error('Delete listing error:', error);
        res.status(500).json({ error: 'Failed to delete listing' });
    }
};
exports.deleteListing = deleteListing;
//# sourceMappingURL=marketplaceController.js.map