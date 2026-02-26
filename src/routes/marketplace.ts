import express from 'express';
import { authMiddleware } from '../config/auth';
import { upload } from '../config/storage';
import * as marketplaceController from '../controllers/marketplaceController';

const router = express.Router();

router.get('/', marketplaceController.listListings);
router.post('/', authMiddleware, upload.single('image'), marketplaceController.createListing);

router.get('/:id', marketplaceController.getListing);
router.patch('/:id', authMiddleware, upload.single('image'), marketplaceController.updateListing);
router.delete('/:id', authMiddleware, marketplaceController.deleteListing);

export default router;
