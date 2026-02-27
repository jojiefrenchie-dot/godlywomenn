'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

function buildAbsoluteUrl(base: string, path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/media/')) {
    const b = String(base || '').replace(/\/$/, '');
    return b + path;
  }
  const b = String(base || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return b + p;
}

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface Message {
  id: string;
  sender: User;
  content: string;
  attachment?: string;
  attachment_type?: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface ProductData {
  id: number;
  title: string;
  price: string;
  image: string | null;
}

export default function MessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversationId, setConversationId] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUserId, setOtherUserId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);

  const emojiList = [
    '😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '🙌',
    '💯', '🔥', '⭐', '❤️', '💔', '💪', '🎉', '🎊', '🎁', '🚀',
    '💡', '✅', '❌', '⚠️', '🎯', '🏆', '😎', '🤗', '😋', '🌟'
  ];

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setOtherUserId(resolvedParams.id);
      
      // Parse product data from query params
      const productParam = searchParams.get('product');
      if (productParam) {
        try {
          const decoded = JSON.parse(decodeURIComponent(productParam));
          setProductData(decoded);
        } catch (err) {
          console.error('Failed to parse product data:', err);
        }
      }
    }
    loadParams();
  }, [params, searchParams]);

  const markConversationAsRead = useCallback(async (convId: string) => {
    try {
      await fetch(`/api/messaging/conversations/${convId}/mark_as_read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  }, [accessToken]);
  
  const fetchMessagesForConversation = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`/api/messaging/conversations/${convId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        const conv = await res.json();
        setMessages(conv.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!user || !otherUserId) return;

    const fetchOrCreateConversation = async () => {
      try {
        // Prefer product owner id (UUID) when product data is present, otherwise use route param
        const targetUserId = (productData && (productData as any).owner && (productData as any).owner.id) ? String((productData as any).owner.id).trim() : String(otherUserId).trim();
        console.log('Attempting to create conversation with user ID:', targetUserId, 'Type:', typeof targetUserId);

        const res = await fetch(`/api/messaging/conversations/start_conversation/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user_id: targetUserId }),
        });

        // Read the response body exactly once and then parse safely.
        const rawBody = await res.text();
        let parsedBody: any = {};
        try {
          parsedBody = rawBody ? JSON.parse(rawBody) : {};
        } catch (e) {
          parsedBody = { raw: rawBody };
        }

        if (!res.ok) {
          console.error('Conversation error details:', {
            status: res.status,
            error: parsedBody,
            otherUserId,
            requestBody: { user_id: String(otherUserId).trim() },
          });
          throw new Error(`Failed to start conversation: ${res.status} - ${JSON.stringify(parsedBody)}`);
        }
        const conv = parsedBody;
        setConversationId(conv.id);
        setConversation(conv);
        setMessages(conv.messages || []);
        
        // Mark messages as read when conversation is opened
        await markConversationAsRead(conv.id);
      } catch (err: any) {
        console.error('Error loading conversation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateConversation();
  }, [user, accessToken, otherUserId, productData, markConversationAsRead]);

  useEffect(() => {
    if (!conversationId) return;
    
    // Poll for new messages every 2 seconds
    const pollInterval = setInterval(() => {
      fetchMessagesForConversation(conversationId);
      markConversationAsRead(conversationId);
    }, 2000);
    
    return () => clearInterval(pollInterval);
  }, [conversationId, fetchMessagesForConversation, markConversationAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (((!newMessage.trim() && !selectedFile) || !conversationId || sending)) return;

    setSending(true);
    try {
      // Prepare FormData to handle both text and file
      const formData = new FormData();
      formData.append('conversation_id', conversationId);
      
      if (newMessage.trim()) {
        formData.append('content', newMessage);
      }
      
      if (selectedFile) {
        formData.append('attachment', selectedFile);
      }
      
      // Include product data if messaging from marketplace
      if (productData) {
        formData.append('product_data', JSON.stringify(productData));
      }

      const res = await fetch(`/api/messaging/messages/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to send message');
      const message = await res.json();
      setMessages([...messages, message]);
      setNewMessage('');
      setSelectedFile(null);
    } catch (err: any) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading conversation...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Failed to load conversation</div>
      </div>
    );
  }

  const otherUser = conversation.participants.find(p => p.id !== user?.id);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-[#dc143c] hover:text-red-700">
              ← Back
            </Link>
            {otherUser && (
              <>
                {otherUser.image && (
                  <Image
                    src={buildAbsoluteUrl(DJANGO_API, otherUser.image)}
                    alt={otherUser.name || 'User avatar'}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                )}
                <div>
                  <h2 className="font-semibold text-gray-900">{otherUser.name || otherUser.email}</h2>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender.id === user?.id
                    ? 'bg-[#dc143c] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.content && <p>{msg.content}</p>}
                
                {msg.attachment && msg.attachment_type === 'image' && (
                  <div className="mt-2 max-w-sm relative">
                    <Image 
                      src={buildAbsoluteUrl(DJANGO_API, msg.attachment)} 
                      alt="Shared image"
                      className="rounded max-h-96 object-contain"
                      width={400}
                      height={400}
                    />
                  </div>
                )}
                
                {msg.attachment && msg.attachment_type !== 'image' && (
                  <div className="mt-2">
                    <a
                      href={buildAbsoluteUrl(DJANGO_API, msg.attachment)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 underline hover:opacity-80 text-sm"
                    >
                      📎 {msg.attachment.split('/').pop() || 'Download'}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-1 gap-2">
                  <p className="text-xs opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                  {msg.sender.id === user?.id && (
                    <p className="text-xs opacity-70">
                      {msg.is_read ? '✓✓' : '✓'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Product Card Preview */}
          {productData && (
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {productData.image && (
                  <div className="relative w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                    <Image
                      src={buildAbsoluteUrl(DJANGO_API, productData.image)}
                      alt={productData.title}
                      fill
                      className="object-cover rounded"
                      sizes="48px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{productData.title}</p>
                  <p className="text-xs text-gray-600">Price: {productData.price}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProductData(null)}
                className="text-gray-400 hover:text-red-600 flex-shrink-0 text-lg font-bold"
                title="Remove product"
              >
                ✕
              </button>
            </div>
          )}
          
          {selectedFile && (
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span className="text-sm text-gray-700">📎 {selectedFile.name}</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-red-600 hover:text-red-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#dc143c] min-w-xs"
              disabled={sending}
            />
            
            {/* Emoji Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                title="Add emoji"
              >
                😊
              </button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 grid grid-cols-5 gap-2 w-48 z-50">
                  {emojiList.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setNewMessage(newMessage + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl hover:bg-gray-100 rounded p-1 transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* File Upload */}
            <label className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer">
              📎
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                disabled={sending}
              />
            </label>
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={(!newMessage.trim() && !selectedFile) || sending}
              className="px-4 py-2 bg-[#dc143c] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
