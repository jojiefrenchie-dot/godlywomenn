import { Response } from 'express';
import { Conversation, Message } from '../models/Messaging';
import { AuthRequest } from '../config/auth';
import { parseQuery } from '../utils/validation';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { page, limit, skip } = parseQuery(req.query);

    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'email name image')
      .sort({ updated_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ results: conversations, page, limit });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};

export const createConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { participant_id } = req.body;
    if (!participant_id) {
      res.status(400).json({ error: 'Participant ID required' });
      return;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, participant_id] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user.id, participant_id]
      });
      await conversation.save();
    }

    await conversation.populate('participants', 'email name image');

    res.status(201).json({ message: 'Conversation created', ...conversation.toObject() });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { page, limit, skip } = parseQuery(req.query);
    const { conversation_id } = req.query;

    if (!conversation_id) {
      res.status(400).json({ error: 'Conversation ID required' });
      return;
    }

    const conversation = await Conversation.findById(conversation_id);
    if (!conversation || !conversation.participants.includes(req.user.id as any)) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const messages = await Message.find({ conversation: conversation_id })
      .populate('sender', 'email name image')
      .sort({ created_at: 1 })
      .skip(skip)
      .limit(limit);

    res.json({ results: messages, page, limit });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { conversation_id, content } = req.body;

    if (!conversation_id || !content) {
      res.status(400).json({ error: 'Conversation ID and content required' });
      return;
    }

    const conversation = await Conversation.findById(conversation_id);
    if (!conversation || !conversation.participants.includes(req.user.id as any)) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const message = new Message({
      conversation: conversation_id,
      sender: req.user.id,
      content,
      is_read: false
    });

    if (req.file) {
      message.attachment = `/media/${req.file.filename}`;
      message.attachment_type = req.file.mimetype.startsWith('image') ? 'image' : 'document';
    }

    await message.save();
    await message.populate('sender', 'email name image');

    // Update conversation updated_at
    conversation.updated_at = new Date();
    await conversation.save();

    res.status(201).json({ message: 'Message sent', ...message.toObject() });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const message = await Message.findById(req.params.id);
    if (!message || message.sender.toString() !== req.user.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await Message.deleteOne({ _id: req.params.id });

    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
