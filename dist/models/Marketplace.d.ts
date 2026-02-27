export interface IMarketplaceListing {
    _id?: string;
    owner: string;
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
declare const _default: any;
export default _default;
//# sourceMappingURL=Marketplace.d.ts.map