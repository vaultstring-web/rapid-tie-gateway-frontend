'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Send, X, Phone, Video, MoreVertical } from 'lucide-react';
import { Conversation, Message, Attendee } from '@/types/events/eventNetworking';
import { useTheme } from '@/context/ThemeContext';
import { formatDistanceToNow } from 'date-fns';

interface MessagingInterfaceProps {
  conversations: Conversation[];
  currentUser: Attendee;
  onSendMessage: (conversationId: string, content: string) => void;
  onSelectConversation: (conversation: Conversation) => void;
  onClose?: () => void;
  loading?: boolean;
}

export const MessagingInterface = ({
  conversations,
  currentUser,
  onSendMessage,
  onSelectConversation,
  onClose,
  loading,
}: MessagingInterfaceProps) => {
  const { theme } = useTheme();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (selectedConversation) {
      // Load messages for selected conversation
      setMessages(selectedConversation.lastMessage ? [selectedConversation.lastMessage] : []);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    onSelectConversation(conversation);
  };

  const handleSend = () => {
    if (messageInput.trim() && selectedConversation) {
      onSendMessage(selectedConversation.id, messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getOtherParticipant = (conversation: Conversation): Attendee => {
    return conversation.participants.find(p => p.id !== currentUser.id)!;
  };

  return (
    <div
      className="fixed right-0 bottom-0 w-96 h-[500px] rounded-t-xl shadow-xl flex flex-col overflow-hidden z-40"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        borderWidth: 1,
        borderBottom: 'none',
      }}
    >
      {/* Header */}
      <div
        className="p-3 border-b flex justify-between items-center"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Messages
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
            {conversations.filter(c => c.unreadCount > 0).length} unread
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className={`w-1/3 border-r overflow-y-auto ${selectedConversation ? 'hidden md:block' : 'w-full'}`} style={{ borderColor: 'var(--border-color)' }}>
          {loading ? (
            <div className="p-4 text-center">
              <div className="w-6 h-6 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isActive = selectedConversation?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-3 text-left transition-colors ${
                    isActive ? 'bg-primary-green-500/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex gap-2">
                    <Image
                      src={other.avatar || '/images/default-avatar.png'}
                      alt={other.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {other.name}
                        </p>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {conv.lastMessage?.content}
                      </p>
                    </div>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="absolute right-3 mt-1 w-5 h-5 rounded-full bg-primary-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">{conv.unreadCount}</span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Messages Area */}
        {selectedConversation && (
          <div className="flex-1 flex flex-col">
            {/* Conversation Header */}
            <div
              className="p-3 border-b flex justify-between items-center"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={getOtherParticipant(selectedConversation).avatar || '/images/default-avatar.png'}
                  alt={getOtherParticipant(selectedConversation).name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {getOtherParticipant(selectedConversation).name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {getOtherParticipant(selectedConversation).role}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Video size={16} style={{ color: 'var(--text-secondary)' }} />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreVertical size={16} style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg) => {
                const isOwn = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] p-2 rounded-lg ${
                        isOwn
                          ? 'bg-primary-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className={`text-xs ${isOwn ? 'text-white/70' : 'text-gray-500'} block text-right mt-1`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="p-3 border-t flex gap-2"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 resize-none p-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className="p-2 rounded-lg bg-primary-green-500 text-white hover:bg-primary-green-600 transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};