import { Request, Response, NextFunction } from 'express';
export interface JWTPayload {
    id: string;
    email: string;
    iat?: number;
    exp?: number;
}
export interface AuthRequest extends Request {
    user?: JWTPayload;
}
declare const JWT_SECRET: string;
export declare const generateTokens: (userId: string, email: string) => {
    accessToken: string;
    refreshToken: string;
};
export declare const verifyToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => JWTPayload;
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
export default JWT_SECRET;
//# sourceMappingURL=auth.d.ts.map