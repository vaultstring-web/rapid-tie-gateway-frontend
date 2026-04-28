'use client';

import { useState } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';
import { Comment } from '@/types/employee/dsaDetails';
import { formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface CommentsThreadProps {
  comments: Comment[];
  requestId: string;
  onAddComment: (content: string) => Promise<void>;
  loading?: boolean;
}

export const CommentsThread = ({ comments, requestId, onAddComment, loading }: CommentsThreadProps) => {
  const { theme } = useTheme();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    setSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-50 text-[var(--text-secondary)]" />
            <p className="text-sm text-[var(--text-secondary)]">No comments yet</p>
            <p className="text-xs text-[var(--text-secondary)]">Be the first to add a comment</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="flex-shrink-0">
                {comment.authorAvatar ? (
                  <img src={comment.authorAvatar} alt={comment.authorName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
                    <User size={18} className="text-[#84cc16]" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {comment.authorName}
                  </span>
                  {comment.isApprover && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      Approver
                    </span>
                  )}
                  <span className="text-xs text-[var(--text-secondary)]">
                    {formatDateTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">
          Add a comment
        </label>
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            rows={2}
            className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] resize-y"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110 transition-colors disabled:opacity-50 self-end"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};