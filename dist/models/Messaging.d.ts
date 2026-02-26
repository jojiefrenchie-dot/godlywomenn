import mongoose, { Document } from 'mongoose';
export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
}
export interface IMessage extends Document {
    conversation: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content?: string;
    attachment?: string;
    attachment_type?: 'image' | 'document' | 'other';
    is_read: boolean;
    created_at: Date;
}
export declare const Conversation: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation> & IConversation & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage> & IMessage & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Messaging.d.ts.map