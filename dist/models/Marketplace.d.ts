import mongoose, { Document } from 'mongoose';
export interface IMarketplaceListing extends Document {
    owner: mongoose.Types.ObjectId;
    title: string;
    description: string;
    price?: string;
    currency: string;
    type: 'Product' | 'Service' | 'Event';
    contact?: string;
    countryCode?: string;
    image?: string;
    date?: Date;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<IMarketplaceListing, {}, {}, {}, mongoose.Document<unknown, {}, IMarketplaceListing> & IMarketplaceListing & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Marketplace.d.ts.map