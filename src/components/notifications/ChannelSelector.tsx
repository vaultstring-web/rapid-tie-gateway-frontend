'use client';

import { Mail, Smartphone, Bell, BellRing } from 'lucide-react';
import { NotificationChannel } from '@/types/notificationPreferences';
import { useTheme } from '@/context/ThemeContext';

interface ChannelSelectorProps {
  channels: NotificationChannel[];
  onChange: (channel: NotificationChannel, enabled: boolean) => void;
  disabled?: boolean;
}

const CHANNELS: { id: NotificationChannel; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'email', label: 'Email', icon: <Mail size={14} />, color: 'text-blue-500' },
  { id: 'sms', label: 'SMS', icon: <Smartphone size={14} />, color: 'text-green-500' },
  { id: 'push', label: 'Push', icon: <Bell size={14} />, color: 'text-purple-500' },
  { id: 'in_app', label: 'In-App', icon: <BellRing size={14} />, color: 'text-orange-500' },
];

export const ChannelSelector = ({ channels, onChange, disabled = false }: ChannelSelectorProps) => {
  const { theme } = useTheme();

  const isEnabled = (channelId: NotificationChannel) => channels.includes(channelId);

  const handleToggle = (channelId: NotificationChannel) => {
    onChange(channelId, !isEnabled(channelId));
  };

  return (
    <div className="flex gap-2">
      {CHANNELS.map((channel) => (
        <button
          key={channel.id}
          onClick={() => handleToggle(channel.id)}
          disabled={disabled}
          className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all
            ${isEnabled(channel.id) 
              ? `${channel.color} bg-opacity-10` 
              : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}
          `}
          style={{
            backgroundColor: isEnabled(channel.id) ? `${channel.color.replace('text-', '')}10` : undefined,
          }}
        >
          {channel.icon}
          {channel.label}
        </button>
      ))}
    </div>
  );
};