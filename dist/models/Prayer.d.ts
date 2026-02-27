export interface IPrayer {
    _id?: string;
    title: string;
    content: string;
    prayer_type: 'request' | 'testimony' | 'praise';
    is_anonymous: boolean;
    is_public: boolean;
    author: string;
    created_at: Date;
    updated_at: Date;
}
export interface IPrayerResponse {
    _id?: string;
    prayer: string;
    author: string;
    content: string;
    created_at: Date;
    updated_at: Date;
}
export interface IPrayerSupport {
    _id?: string;
    prayer: string;
    user: string;
    created_at: Date;
}
export interface IPrayerResponseLike {
    _id?: string;
    response: string;
    user: string;
    created_at: Date;
}
export declare const Prayer: any;
export declare const PrayerResponse: any;
export declare const PrayerSupport: any;
export declare const PrayerResponseLike: any;
//# sourceMappingURL=Prayer.d.ts.map