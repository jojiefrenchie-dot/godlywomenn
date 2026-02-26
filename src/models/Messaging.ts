// MongoDB/Mongoose models removed - use HTTP API or custom database implementation instead

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

// Schemas removed
export const Conversation = null;
export const Message = null;
