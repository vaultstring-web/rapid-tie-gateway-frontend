'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Wifi, WifiOff, RefreshCw, Users, Camera, FileText } from 'lucide-react';
import { ScannerView } from '@/components/organizer/checkin/ScannerView';
import { CheckinStatsChart } from '@/components/organizer/checkin/CheckinStatsChart';
import { ManualEntryForm } from '@/components/organizer/checkin/ManualEntryForm';
import { RecentCheckinsFeed } from '@/components/organizer/checkin/RecentCheckinsFeed';
import { checkinService } from '@/services/organizer/checkin.service';
import { offlineStorage } from '@/services/organizer/offlineStorage.service';
import { CheckinStats, CheckinRecord } from '@/types/organizer/checkin';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockStats = (): CheckinStats => {
  const total = 1250;
  const checkedIn = 678;
  return {
    total,
    checkedIn,
    notCheckedIn: total - checkedIn,
    percentage: Math.round((checkedIn / total) * 100),
    byRole: [
      { role: 'MERCHANT', total: 450, checkedIn: 245, percentage: 54, color: '#10b981' },
      { role: 'ORGANIZER', total: 120, checkedIn: 89, percentage: 74, color: '#3b82f6' },
      { role: 'EMPLOYEE', total: 300, checkedIn: 156, percentage: 52, color: '#8b5cf6' },
      { role: 'APPROVER', total: 80, checkedIn: 45, percentage: 56, color: '#f59e0b' },
      { role: 'FINANCE_OFFICER', total: 50, checkedIn: 32, percentage: 64, color: '#06b6d4' },
      { role: 'ADMIN', total: 10, checkedIn: 8, percentage: 80, color: '#ef4444' },
      { role: 'PUBLIC', total: 240, checkedIn: 103, percentage: 43, color: '#6b7280' },
    ],
    lastCheckin: null,
  };
};

const getMockRecentCheckins = (): CheckinRecord[] => {
  return [
    {
      id: '1',
      ticketId: 'tkt-001',
      attendeeName: 'John Doe',
      attendeeEmail: 'john@example.com',
      ticketNumber: 'TKT-0001',
      tierName: 'VIP',
      role: 'MERCHANT',
      checkedInAt: new Date().toISOString(),
      checkedInBy: 'Scanner',
      method: 'qr',
      synced: true,
    },
    {
      id: '2',
      ticketId: 'tkt-002',
      attendeeName: 'Jane Smith',
      attendeeEmail: 'jane@example.com',
      ticketNumber: 'TKT-0002',
      tierName: 'General Admission',
      role: 'PUBLIC',
      checkedInAt: new Date(Date.now() - 60000).toISOString(),
      checkedInBy: 'Manual Entry',
      method: 'manual',
      synced: true,
    },
  ];
};

export default function CheckinManagementPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [stats, setStats] = useState<CheckinStats | null>(null);
  const [recentCheckins, setRecentCheckins] = useState<CheckinRecord[]>([]);
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [useMockData, setUseMockData] = useState(false);
  const [activeTab, setActiveTab] = useState<'scanner' | 'manual'>('scanner');

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init();
    
    // Online/Offline listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    loadData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      if (isOnline && !useMockData) {
        loadData();
      }
    }, 10000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleOnline = () => {
    setIsOnline(true);
    toast.success('Connection restored. Syncing offline check-ins...');
    syncOfflineCheckins();
    loadData();
  };

  const handleOffline = () => {
    setIsOnline(false);
    toast.error('You are offline. Check-ins will be saved locally and synced when online.');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      let statsData, recentData;
      try {
        [statsData, recentData] = await Promise.all([
          checkinService.getStats(eventId),
          checkinService.getRecentCheckins(eventId, 20),
        ]);
        setUseMockData(false);
      } catch (error) {
        console.warn('Failed to fetch from API, using mock data:', error);
        statsData = getMockStats();
        recentData = getMockRecentCheckins();
        setUseMockData(true);
      }
      setStats(statsData);
      setRecentCheckins(recentData);
    } catch (error) {
      console.error('Failed to load check-in data:', error);
      toast.error('Failed to load check-in data');
    } finally {
      setLoading(false);
    }
  };

  const syncOfflineCheckins = async () => {
    const queue = await offlineStorage.getQueue();
    if (queue.length === 0) return;
    
    toast.loading(`Syncing ${queue.length} offline check-ins...`, { id: 'sync' });
    
    try {
      await checkinService.syncOfflineCheckins(eventId, queue);
      await offlineStorage.clearQueue();
      toast.success(`${queue.length} check-ins synced`, { id: 'sync' });
      loadData();
    } catch (error) {
      toast.error('Failed to sync offline check-ins', { id: 'sync' });
    }
  };

  const handleQRScan = async (qrData: string) => {
    if (processing) return;
    setProcessing(true);
    
    try {
      let result;
      if (useMockData) {
        // Mock check-in
        await new Promise(resolve => setTimeout(resolve, 500));
        result = {
          id: Date.now().toString(),
          ticketId: 'mock-ticket',
          attendeeName: 'Demo Attendee',
          attendeeEmail: 'demo@example.com',
          ticketNumber: qrData.slice(-8),
          tierName: 'VIP',
          role: 'PUBLIC',
          checkedInAt: new Date().toISOString(),
          checkedInBy: 'Scanner',
          method: 'qr',
          synced: !isOnline,
        };
        toast.success(`${result.attendeeName} checked in!`);
      } else {
        result = await checkinService.checkinByQR(eventId, qrData);
        toast.success(`${result.attendeeName} checked in!`);
      }
      
      if (isOnline) {
        setRecentCheckins(prev => [result, ...prev.slice(0, 19)]);
        if (stats) {
          setStats(prev => ({
            ...prev!,
            checkedIn: prev!.checkedIn + 1,
            percentage: Math.round(((prev!.checkedIn + 1) / prev!.total) * 100),
            byRole: prev!.byRole.map(role =>
              role.role === result.role
                ? { ...role, checkedIn: role.checkedIn + 1, percentage: Math.round(((role.checkedIn + 1) / role.total) * 100) }
                : role
            ),
          }));
        }
      } else {
        // Store offline
        await offlineStorage.addToQueue({
          id: result.id,
          ticketId: result.ticketId,
          attendeeName: result.attendeeName,
          eventId,
        });
        setRecentCheckins(prev => [{ ...result, method: 'offline', synced: false }, ...prev.slice(0, 19)]);
        toast.info('Check-in saved offline. Will sync when online.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to check in');
    } finally {
      setProcessing(false);
    }
  };

  const handleManualCheckin = async (ticketNumber: string) => {
    setProcessing(true);
    
    try {
      let result;
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 500));
        result = {
          id: Date.now().toString(),
          ticketId: 'mock-ticket',
          attendeeName: 'Manual Attendee',
          attendeeEmail: 'manual@example.com',
          ticketNumber,
          tierName: 'General Admission',
          role: 'PUBLIC',
          checkedInAt: new Date().toISOString(),
          checkedInBy: 'Manual Entry',
          method: 'manual',
          synced: !isOnline,
        };
        toast.success(`${result.attendeeName} checked in!`);
      } else {
        result = await checkinService.checkinManual(eventId, ticketNumber);
        toast.success(`${result.attendeeName} checked in!`);
      }
      
      if (isOnline) {
        setRecentCheckins(prev => [result, ...prev.slice(0, 19)]);
        if (stats) {
          setStats(prev => ({
            ...prev!,
            checkedIn: prev!.checkedIn + 1,
            percentage: Math.round(((prev!.checkedIn + 1) / prev!.total) * 100),
            byRole: prev!.byRole.map(role =>
              role.role === result.role
                ? { ...role, checkedIn: role.checkedIn + 1, percentage: Math.round(((role.checkedIn + 1) / role.total) * 100) }
                : role
            ),
          }));
        }
      } else {
        await offlineStorage.addToQueue({
          id: result.id,
          ticketId: result.ticketId,
          attendeeName: result.attendeeName,
          eventId,
        });
        setRecentCheckins(prev => [{ ...result, method: 'offline', synced: false }, ...prev.slice(0, 19)]);
        toast.info('Check-in saved offline. Will sync when online.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Ticket not found or already checked in');
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Check-in Management
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Scan tickets or manually check in attendees
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* Online/Offline Indicator */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isOnline ? 'border-green-500' : 'border-yellow-500'}`}>
              {isOnline ? (
                <>
                  <Wifi size={16} className="text-green-500" />
                  <span className="text-sm text-green-500">Online</span>
                </>
              ) : (
                <>
                  <WifiOff size={16} className="text-yellow-500" />
                  <span className="text-sm text-yellow-500">Offline Mode</span>
                </>
              )}
            </div>
            
            <button
              onClick={() => loadData()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {useMockData && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Demo Mode - Using sample data. Connect to backend for live check-in.
            </p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Scanner & Manual Entry */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => setActiveTab('scanner')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'scanner'
                    ? 'border-b-2 border-primary-green-500 text-primary-green-500'
                    : 'hover:text-primary-green-500'
                }`}
                style={{ color: activeTab === 'scanner' ? undefined : 'var(--text-secondary)' }}
              >
                <Camera size={16} />
                QR Scanner
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'manual'
                    ? 'border-b-2 border-primary-green-500 text-primary-green-500'
                    : 'hover:text-primary-green-500'
                }`}
                style={{ color: activeTab === 'manual' ? undefined : 'var(--text-secondary)' }}
              >
                <FileText size={16} />
                Manual Entry
              </button>
            </div>

            {activeTab === 'scanner' ? (
              <ScannerView
                onScan={handleQRScan}
                scanning={!processing}
                onError={(err) => toast.error(err)}
              />
            ) : (
              <ManualEntryForm onSubmit={handleManualCheckin} loading={processing} />
            )}
          </div>

          {/* Right Column - Stats & Recent Check-ins */}
          <div className="space-y-6">
            {/* Check-in Stats */}
            <div
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Users size={18} />
                Check-in Progress
              </h2>
              {stats && <CheckinStatsChart stats={stats} loading={loading} />}
            </div>

            {/* Recent Check-ins Feed */}
            <div
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Recent Check-ins
              </h2>
              <RecentCheckinsFeed checkins={recentCheckins} loading={loading} isOffline={!isOnline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}