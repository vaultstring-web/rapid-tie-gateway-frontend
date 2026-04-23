'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface RecommendationFeedbackProps {
  eventId: string;
  eventName: string;
  onFeedback: (eventId: string, isHelpful: boolean) => void;
  onClose: () => void;
}

export const RecommendationFeedback = ({
  eventId,
  eventName,
  onFeedback,
  onClose,
}: RecommendationFeedbackProps) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<'helpful' | 'not_helpful' | null>(null);

  const handleFeedback = (isHelpful: boolean) => {
    setSelected(isHelpful ? 'helpful' : 'not_helpful');
    setTimeout(() => {
      onFeedback(eventId, isHelpful);
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rounded-xl max-w-md w-full p-6 shadow-xl animate-slide-up"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Was this recommendation helpful?
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Your feedback helps us improve recommendations for "{eventName}"
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => handleFeedback(true)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              selected === 'helpful'
                ? 'bg-green-500 text-white'
                : 'border hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
            style={{
              borderColor: 'var(--border-color)',
              color: selected === 'helpful' ? undefined : 'var(--text-primary)',
            }}
          >
            <ThumbsUp size={18} />
            Helpful
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              selected === 'not_helpful'
                ? 'bg-orange-500 text-white'
                : 'border hover:bg-orange-50 dark:hover:bg-orange-900/20'
            }`}
            style={{
              borderColor: 'var(--border-color)',
              color: selected === 'not_helpful' ? undefined : 'var(--text-primary)',
            }}
          >
            <ThumbsDown size={18} />
            Not Helpful
          </button>
        </div>

        {selected && (
          <div className="mt-4 text-center text-sm animate-fade-in" style={{ color: 'var(--text-secondary)' }}>
            {selected === 'helpful' ? 'Thanks for your feedback! 👍' : 'We\'ll improve our recommendations 👎'}
          </div>
        )}
      </div>
    </div>
  );
};