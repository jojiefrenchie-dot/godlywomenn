import { Response } from 'express';
import { AuthRequest } from '../config/auth';
export declare const listListings: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createListing: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getListing: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateListing: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteListing: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=marketplaceController.d.ts.map