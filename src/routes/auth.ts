import express from 'express';
import { authMiddleware } from '../config/auth';
import { upload } from '../config/storage';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authMiddleware, authController.logout);

router.get('/me', authMiddleware, authController.getCurrentUser);
router.patch('/me', authMiddleware, upload.single('image'), authController.updateUser);

router.get('/:id', authController.getUser);

export default router;
