'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, CheckCheck, Inbox, RefreshCw } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { notificationService } from '@/services/notification.service';
import { Notification, NotificationType, NotificationsResponse } from '@/types/notifications';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [typeCounts, setTypeCounts] = useState<Record<NotificationType | 'all', number>>({
    all: 0,
    payment: 0,
    event: 0,
    dsa: 0,
    system: 0,
    reminder: 0,
    connection: 0,
    message: 0,
  });
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Load notifications
  const loadNotifications = useCallback(async (reset: boolean = false) => {
    const currentPage = reset ? 1 : page;
    
    if (reset) {
      setLoading(true);
    }
    
    try {
      const response: NotificationsResponse = await notificationService.getNotifications(
        currentPage,
        20,
        selectedType === 'all' ? undefined : selectedType
      );
      
      if (reset) {
        setNotifications(response.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }
      
      setHasMore(response.hasMore);
      setTotal(response.total);
      setUnreadCount(response.unreadCount);
      setPage(currentPage + 1);
      
      // Update type counts
      // This would come from the API ideally
      setTypeCounts(prev => ({
        ...prev,
        all: response.total,
      }));
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, selectedType]);

  // Initial load
  useEffect(() => {
    loadNotifications(true);
  }, [selectedType]);

  // WebSocket connection for real-time notifications
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        const socket = await notificationService.subscribeToNotifications();
        
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'new_notification') {
            setNotifications(prev => [data.notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            setTotal(prev => prev + 1);
            toast.success('New notification received');
          }
        };
        
        setWs(socket);
      } catch (error) {
        console.error('WebSocket connection failed:', error);
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast.error('Failed to update notification');
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  // Delete notification
  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setTotal(prev => prev - 1);
      if (!notifications.find(n => n.id === notificationId)?.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadNotifications(true);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Bell size={24} className="text-primary-green-500" />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-green-500 text-white">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Stay updated with your latest activity
            </p>
          </div>
          
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <CheckCheck size={16} />
                Mark all as read
              </button>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <NotificationFilters
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            counts={typeCounts}
          />
        </div>

        {/* Notifications List */}
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <Inbox size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-secondary)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No notifications
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              When you receive notifications, they'll appear here
            </p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={notifications.length}
            next={() => loadNotifications(false)}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }
            endMessage={
              <p className="text-center py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                You've seen all {total} notifications
              </p>
            }
          >
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}