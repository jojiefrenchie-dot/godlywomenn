import express from 'express';
import { authMiddleware } from '../config/auth';
import * as prayerController from '../controllers/prayerController';

const router = express.Router();

router.get('/', prayerController.listPrayers);
router.post('/', authMiddleware, prayerController.createPrayer);

router.get('/:id', prayerController.getPrayer);
router.patch('/:id', authMiddleware, prayerController.updatePrayer);
router.delete('/:id', authMiddleware, prayerController.deletePrayer);

router.post('/:id/support', authMiddleware, prayerController.supportPrayer);

router.get('/:id/responses', prayerController.getPrayerResponses);
router.post('/:id/responses', authMiddleware, prayerController.createPrayerResponse);

router.post('/:id/responses/:responseId/like', authMiddleware, prayerController.likePrayerResponse);
router.delete('/:id/responses/:responseId', authMiddleware, prayerController.deletePrayerResponse);

export default router;
