import express from 'express';
import { authMiddleware } from '../config/auth';
import { upload } from '../config/storage';
import * as articleController from '../controllers/articleController';

const router = express.Router();

router.get('/', articleController.listArticles);
router.post('/', authMiddleware, upload.single('featured_image'), articleController.createArticle);

router.get('/:id', articleController.getArticle);
router.patch('/:id', authMiddleware, upload.single('featured_image'), articleController.updateArticle);
router.delete('/:id', authMiddleware, articleController.deleteArticle);

router.post('/:id/like', authMiddleware, articleController.likeArticle);

router.get('/:id/comments', articleController.getComments);
router.post('/:id/comments', authMiddleware, articleController.createComment);

router.patch('/:id/comments/:commentId', authMiddleware, articleController.updateComment);
router.delete('/:id/comments/:commentId', authMiddleware, articleController.deleteComment);
router.post('/:id/comments/:commentId/like', authMiddleware, articleController.likeComment);

export default router;
