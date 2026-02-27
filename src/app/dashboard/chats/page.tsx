'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
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
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export default function ChatsPage() {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);

  // Update page title and notification count on mobile
  useEffect(() => {
    if (totalUnread > 0) {
      document.title = `My Chats (${totalUnread})`;
    } else {
      document.title = 'My Chats';
    }
  }, [totalUnread]);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        console.log('[CHATS] Fetching with token:', !!accessToken);
        
        const res = await fetch('/api/messaging/conversations', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });

        console.log('[CHATS] Response status:', res.status);
        
        if (!res.ok) {
          const errData = await res.json();
          console.error('[CHATS] Fetch error:', errData);
          throw new Error(errData.error || 'Failed to fetch conversations');
        }
        
        const data = await res.json();
        setConversations(data.results || data);
      } catch (err: any) {
        console.error('Error fetching conversations:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, [user, accessToken]);

  const handleMarkAsRead = async (conversationId: string) => {
    try {
      await fetch(`/api/messaging/conversations/${conversationId}/mark_as_read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      
      // Refresh conversations
      const res = await fetch('/api/messaging/conversations', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      const data = await res.json();
      setConversations(data.results || data);
    } catch (err: any) {
      console.error('Error marking as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/dashboard" className="text-[#dc143c] hover:text-red-700 text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-serif text-gray-900">My Chats</h1>
        {totalUnread > 0 && (
          <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-[#dc143c] text-white">
            {totalUnread} unread
          </span>
        )}
      </div>

      <div className="space-y-2">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No conversations yet</p>
            <Link
              href="/profiles"
              className="text-[#dc143c] hover:text-red-700"
            >
              Start a new conversation →
            </Link>
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherUser = conversation.participants.find(p => p.id !== user?.id);
            const lastMsg = conversation.last_message;

            return (
              <div
                key={conversation.id}
                onClick={() => {
                  handleMarkAsRead(conversation.id);
                  router.push(`/messages/${otherUser?.id}`);
                }}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  conversation.unread_count > 0
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {otherUser?.image ? (
                    <Image
                      src={buildAbsoluteUrl(DJANGO_API, otherUser.image)}
                      alt={otherUser.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {otherUser?.name || otherUser?.email}
                      </h3>
                      {conversation.unread_count > 0 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-[#dc143c] text-white">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p className="text-sm text-gray-600 truncate">
                        {lastMsg.sender.id === user?.id ? 'You: ' : ''}
                        {lastMsg.content}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(conversation.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
