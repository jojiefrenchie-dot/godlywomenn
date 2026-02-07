import express from 'express';
import { authMiddleware } from '../config/auth';
import { upload } from '../config/storage';
import * as messagingController from '../controllers/messagingController';

const router = express.Router();

router.get('/conversations', authMiddleware, messagingController.getConversations);
router.post('/conversations', authMiddleware, messagingController.createConversation);

router.get('/messages', authMiddleware, messagingController.getMessages);
router.post('/messages', authMiddleware, upload.single('attachment'), messagingController.sendMessage);

router.delete('/messages/:id', authMiddleware, messagingController.deleteMessage);

export default router;
