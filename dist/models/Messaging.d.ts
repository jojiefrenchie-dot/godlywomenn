export interface IConversation {
    _id?: string;
    participants: string[];
    created_at: Date;
    updated_at: Date;
}
export interface IMessage {
    _id?: string;
    conversation: string;
    sender: string;
    content?: string;
    attachment?: string;
    attachment_type?: 'image' | 'document' | 'other';
    is_read: boolean;
    created_at: Date;
}
export declare const Conversation: any;
export declare const Message: any;
//# sourceMappingURL=Messaging.d.ts.map