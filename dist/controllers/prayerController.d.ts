import { Response } from 'express';
import { AuthRequest } from '../config/auth';
export declare const listPrayers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createPrayer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPrayer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updatePrayer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePrayer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const supportPrayer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPrayerResponses: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createPrayerResponse: (req: AuthRequest, res: Response) => Promise<void>;
export declare const likePrayerResponse: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePrayerResponse: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=prayerController.d.ts.map