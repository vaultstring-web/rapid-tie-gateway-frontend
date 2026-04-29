'use client';

import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Calendar, Clock, Send, Save, Eye, X, Users, Mail, Smartphone } from 'lucide-react';
import { RecipientFilter, MessageTemplate } from '@/types/events/bulkMessaging';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface MessageComposerProps {
  eventId: string;
  onSend: (subject: string, content: string, scheduledFor?: Date) => Promise<void>;
  onSaveTemplate?: (name: string, subject: string, content: string) => Promise<void>;
  templates?: MessageTemplate[];
  loading?: boolean;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'link', 'image',
];

export const MessageComposer = ({ eventId, onSend, onSaveTemplate, templates, loading }: MessageComposerProps) => {
  const { theme } = useTheme();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [isScheduled, setIsScheduled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!content.trim()) {
      toast.error('Please enter message content');
      return;
    }

    setSending(true);
    try {
      const scheduledDateTime = isScheduled && scheduleDate
        ? new Date(`${scheduleDate.toISOString().split('T')[0]}T${scheduleTime}`)
        : undefined;
      
      await onSend(subject, content, scheduledDateTime);
      setSubject('');
      setContent('');
      setIsScheduled(false);
      setScheduleDate(null);
      toast.success(isScheduled ? 'Message scheduled successfully' : 'Message sent successfully');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!content.trim()) {
      toast.error('Please enter message content');
      return;
    }

    setSavingTemplate(true);
    try {
      await onSaveTemplate?.(templateName, subject, content);
      setTemplateName('');
      setShowTemplateSelector(false);
      toast.success('Template saved successfully');
    } catch (error) {
      toast.error('Failed to save template');
    } finally {
      setSavingTemplate(false);
    }
  };

  const loadTemplate = (template: MessageTemplate) => {
    setSubject(template.subject);
    setContent(template.content);
    setShowTemplateSelector(false);
    toast.success(`Loaded template: ${template.name}`);
  };

  const getEditorStyle = () => ({
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
    borderColor: 'var(--border-color)',
  });

  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail size={20} className="text-primary-green-500" />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Compose Message
          </h2>
        </div>
        <div className="flex gap-2">
          {templates && templates.length > 0 && (
            <button
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
              className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              📋 Load Template
            </button>
          )}
          {onSaveTemplate && (
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              💾 Save as Template
            </button>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <Eye size={14} className="inline mr-1" />
            Preview
          </button>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-xl max-w-md w-full p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {onSaveTemplate ? 'Save as Template' : 'Load Template'}
              </h3>
              <button onClick={() => setShowTemplateSelector(false)}>
                <X size={18} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            
            {onSaveTemplate ? (
              <div>
                <input
                  type="text"
                  placeholder="Template name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border mb-4 focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  onClick={handleSaveTemplate}
                  disabled={savingTemplate}
                  className="w-full py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 disabled:opacity-50"
                >
                  {savingTemplate ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {templates?.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template)}
                    className="w-full p-3 rounded-lg text-left border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {template.name}
                    </p>
                    <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                      {template.preview}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Form */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter message subject"
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
            Message Content
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write your message here..."
            style={{ height: '250px', marginBottom: '50px' }}
          />
        </div>

        {/* Schedule Options */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-green-500 focus:ring-primary-green-500"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Schedule for later</span>
          </label>
          
          {isScheduled && (
            <div className="flex gap-3">
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="date"
                  value={scheduleDate ? scheduleDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setScheduleDate(new Date(e.target.value))}
                  className="pl-9 pr-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSend}
            disabled={sending || loading}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 transition-colors disabled:opacity-50"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {isScheduled ? 'Schedule Message' : 'Send Now'}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Message Preview
              </h3>
              <button onClick={() => setShowPreview(false)}>
                <X size={18} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            <div className="border rounded-lg p-4 mb-4" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Subject: {subject || '(No subject)'}
              </p>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="w-full py-2 rounded-lg bg-primary-green-500 text-white font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};