'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useLike } from '@/app/providers/LikeContext';
import { generateArticle } from '@/app/api/ai';

interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

interface CommentType {
  id: string;
  author: Author;
  content: string;
  created_at: string;
  likes_count: number;
  user_liked: boolean;
  replies: CommentType[];
}

interface ArticleCommentsProps {
  articleId: string;
  articleTitle?: string;
  articleExcerpt?: string;
  initialLikesCount?: number;
  initialUserLiked?: boolean;
  initialComments?: CommentType[];
}

function CommentItem({ comment, onLike, onReply, onDelete, user, currentUserId }: {
  comment: CommentType;
  onLike: (id: string, liked: boolean) => Promise<void>;
  onReply: (id: string, text: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  user: any;
  currentUserId?: string;
}) {
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const isAuthor = currentUserId === comment.author.id;

  const handleGenerateReply = async () => {
    setIsGeneratingReply(true);
    try {
      const generated = await generateArticle(`reply to: ${comment.content}`, 50);
      setReplyText(generated);
    } catch (err: any) {
      alert('Failed to generate reply. Please try again.');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  return (
    <div className="border rounded p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {comment.author.image ? (
            <Image
              src={comment.author.image}
              alt={comment.author.name || 'User'}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
          )}
          <div>
            <Link href={`/profiles/${comment.author.id}`} className="font-medium text-gray-700 text-sm hover:text-[#dc143c] transition">
              {comment.author.name || 'Anonymous'}
            </Link>
            <span className="text-xs text-gray-400 ml-2">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={() => onLike(comment.id, comment.user_liked)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                comment.user_liked
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title={comment.likes_count === 0 ? 'Be the first to like' : `${comment.likes_count} like${comment.likes_count !== 1 ? 's' : ''}`}
            >
              ❤️ {comment.likes_count}
            </button>
          )}
          {isAuthor && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              title="Delete comment"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
      {user && (
        <button
          onClick={() => setReplying(!replying)}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          {replying ? 'Cancel' : 'Reply'}
        </button>
      )}
      {replying && (
        <div className="mt-2 space-y-2">
          <div className="flex gap-1">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-grow border rounded px-2 py-1 text-xs"
              placeholder="Reply..."
              disabled={isGeneratingReply}
            />
            <button
              onClick={() => {
                onReply(comment.id, replyText);
                setReplyText('');
                setReplying(false);
              }}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
              disabled={!replyText.trim() || isGeneratingReply}
            >
              Reply
            </button>
          </div>
          <button
            type="button"
            onClick={handleGenerateReply}
            disabled={isGeneratingReply}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
          >
            {isGeneratingReply ? (
              <>
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate Reply
              </>
            )}
          </button>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 pl-2">
          {comment.replies.map((reply: CommentType) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              onDelete={onDelete}
              user={user}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArticleComments({
  articleId,
  articleTitle = '',
  articleExcerpt = '',
  initialLikesCount = 0,
  initialUserLiked = false,
  initialComments = [],
}: ArticleCommentsProps) {
  const { user } = useAuth();
  const { likes, setLike } = useLike();
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [isGeneratingComment, setIsGeneratingComment] = useState(false);

  // Get article like state from context or use initial values
  const likeState = likes[articleId] || { liked: initialUserLiked, count: initialLikesCount };
  const userLiked = likeState.liked;
  const likesCount = likeState.count;

  useEffect(() => {
    // Initialize from context on first load
    if (!likes[articleId]) {
      setLike(articleId, initialUserLiked, initialLikesCount);
    }
    
    console.log('ArticleComments initialized with:', {
      articleId,
      initialCommentsCount: initialComments.length,
      likesCount: initialLikesCount,
      userLiked: initialUserLiked,
    });
  }, [articleId, initialComments, initialLikesCount, initialUserLiked, setLike, likes]);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like articles');
      return;
    }
    try {
      // Optimistically update UI
      const newLiked = !userLiked;
      const newCount = newLiked ? likesCount + 1 : likesCount - 1;
      setLike(articleId, newLiked, newCount);

      // Make API call
      const res = await fetch(`/api/articles/${articleId}/like`, {
        method: userLiked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) {
        // Revert on error
        setLike(articleId, userLiked, likesCount);
        alert('Failed to update like');
      }
    } catch (error) {
      // Revert on error
      setLike(articleId, userLiked, likesCount);
      console.error('Error liking article:', error);
      alert('Error updating like');
    }
  };

  const handleAddComment = async () => {
    if (!user || !commentText.trim()) return;
    setCommentLoading(true);
    try {
      console.log('Posting comment for article:', articleId, 'content:', commentText);
      const res = await fetch(`/api/articles/${articleId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: commentText }),
      });
      console.log('Comment response status:', res.status, 'ok:', res.ok);
      if (res.ok) {
        const newComment = await res.json();
        console.log('New comment response:', newComment);
        // Ensure the comment has the right structure
        const formattedComment: CommentType = {
          id: newComment.id,
          author: newComment.author,
          content: newComment.content,
          created_at: newComment.created_at,
          likes_count: newComment.likes_count || 0,
          user_liked: newComment.user_liked || false,
          replies: newComment.replies || [],
        };
        setComments([formattedComment, ...comments]);
        setCommentText('');
      } else {
        const error = await res.json();
        console.error('Failed to create comment. Status:', res.status, 'Error:', JSON.stringify(error, null, 2));
        alert(`Failed to post comment: ${JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error posting comment: ' + String(error));
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLikeComment = async (commentId: string, liked: boolean) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/articles/comment/${commentId}/like/`, {
        method: liked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (res.ok) {
        const updatedComment = await res.json();
        console.log('Updated comment from server:', updatedComment);
        
        // Update like count recursively with server data
        const updateLikesRecursively = (comments: CommentType[]): CommentType[] => {
          return comments.map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                user_liked: updatedComment.user_liked,
                likes_count: updatedComment.likes_count,
              };
            }
            return {
              ...c,
              replies: c.replies ? updateLikesRecursively(c.replies) : [],
            };
          });
        };
        setComments(updateLikesRecursively(comments));
      } else {
        console.error('Like failed with status:', res.status);
        const errorData = await res.json();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReplyComment = async (parentId: string, replyText: string) => {
    if (!user || !replyText.trim()) return;
    try {
      const res = await fetch(`/api/articles/comment/${parentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: replyText }),
      });
      if (res.ok) {
        const reply = await res.json();
        setComments(
          comments.map((c) =>
            c.id === parentId
              ? { ...c, replies: [reply, ...(c.replies || [])] }
              : c
          )
        );
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      console.log('Delete request for comment:', commentId);
      const res = await fetch(`/api/articles/comment/${commentId}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      console.log('Delete response status:', res.status);
      
      if (res.ok || res.status === 204) {
        console.log('Delete successful, removing from UI');
        // Remove comment from the list recursively
        const deleteRecursively = (comments: CommentType[]): CommentType[] => {
          return comments
            .filter((c) => c.id !== commentId)
            .map((c) => ({
              ...c,
              replies: deleteRecursively(c.replies || []),
            }));
        };
        setComments(deleteRecursively(comments));
      } else {
        let errorMsg = 'Unknown error';
        try {
          const error = await res.json();
          console.log('Delete error response:', error);
          errorMsg = error.detail || error.error || JSON.stringify(error);
        } catch (e) {
          console.log('Could not parse error response');
        }
        alert(`Failed to delete comment: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Delete exception:', error);
      alert('Error deleting comment: ' + String(error));
    }
  };

  const handleGenerateComment = async () => {
    setIsGeneratingComment(true);
    try {
      const context = `${articleTitle} ${articleExcerpt}`.trim();
      const prompt = context 
        ? `generate comment article: ${context}` 
        : 'generate comment article';
      const generatedComment = await generateArticle(prompt, 50);
      setCommentText(generatedComment);
    } catch (err: any) {
      alert('Failed to generate comment. Please try again.');
    } finally {
      setIsGeneratingComment(false);
    }
  };

  return (
    <div className="mt-12 pt-12 border-t border-gray-100">
      <h2 className="text-2xl font-serif text-gray-900 mb-6">Interactions</h2>

      {/* Like Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <button
          onClick={handleLike}
          disabled={!user}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            userLiked
              ? 'bg-pink-100 text-pink-600'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-pink-300 hover:text-pink-600'
          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={user ? 'Like this article' : 'Sign in to like'}
        >
          <svg className="h-5 w-5" fill={userLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
        </button>
      </div>

      {/* Comments Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>

        {user ? (
          <div className="mb-6">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#dc143c]"
                placeholder="Add a comment..."
                disabled={commentLoading || isGeneratingComment}
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-[#dc143c] text-white rounded-lg hover:bg-[#b01031] disabled:opacity-50"
                disabled={commentLoading || isGeneratingComment || !commentText.trim()}
              >
                {commentLoading ? '...' : 'Post'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleGenerateComment}
              disabled={isGeneratingComment}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {isGeneratingComment ? (
                <>
                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Comment
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-gray-600 text-sm">
            <a href="/login" className="text-[#dc143c] hover:underline">
              Sign in
            </a>{' '}
            to comment
          </div>
        )}

        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No comments yet. Be the first to comment!</div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={handleLikeComment}
                onReply={handleReplyComment}
                onDelete={handleDeleteComment}
                user={user}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
