import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    bio?: string;
    image?: string;
    location?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    is_active: boolean;
    is_superuser: boolean;
    created_at: Date;
    updated_at: Date;
    comparePassword(password: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map