import { Response } from 'express';
import { AuthRequest } from '../config/auth';
export declare const listArticles: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createArticle: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getArticle: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateArticle: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteArticle: (req: AuthRequest, res: Response) => Promise<void>;
export declare const likeArticle: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getComments: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createComment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateComment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteComment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const likeComment: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=articleController.d.ts.map