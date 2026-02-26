import { Response } from 'express';
import { AuthRequest } from '../config/auth';
export declare const getConversations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createConversation: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMessages: (req: AuthRequest, res: Response) => Promise<void>;
export declare const sendMessage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteMessage: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=messagingController.d.ts.map