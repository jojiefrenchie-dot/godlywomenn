import mongoose, { Document } from 'mongoose';
export interface IPrayer extends Document {
    title: string;
    content: string;
    prayer_type: 'request' | 'testimony' | 'praise';
    is_anonymous: boolean;
    is_public: boolean;
    author: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}
export interface IPrayerResponse extends Document {
    prayer: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    created_at: Date;
    updated_at: Date;
}
export interface IPrayerSupport extends Document {
    prayer: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    created_at: Date;
}
export interface IPrayerResponseLike extends Document {
    response: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    created_at: Date;
}
export declare const Prayer: mongoose.Model<IPrayer, {}, {}, {}, mongoose.Document<unknown, {}, IPrayer> & IPrayer & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const PrayerResponse: mongoose.Model<IPrayerResponse, {}, {}, {}, mongoose.Document<unknown, {}, IPrayerResponse> & IPrayerResponse & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const PrayerSupport: mongoose.Model<IPrayerSupport, {}, {}, {}, mongoose.Document<unknown, {}, IPrayerSupport> & IPrayerSupport & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const PrayerResponseLike: mongoose.Model<IPrayerResponseLike, {}, {}, {}, mongoose.Document<unknown, {}, IPrayerResponseLike> & IPrayerResponseLike & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Prayer.d.ts.map