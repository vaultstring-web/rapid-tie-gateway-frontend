'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Download, 
  Mail, 
  Smartphone, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  Clock,
  Users,
  Ticket,
  QrCode
} from 'lucide-react';
import { QRCodeGrid } from '@/components/organizer/QRCodeGrid';
import { RoleQRGenerator } from '@/components/organizer/RoleQRGenerator';
import { qrCodeManagementService } from '@/services/events/qrCodeManagement.service';
import { Ticket as TicketType, EventInfo, DeliveryStatus } from '@/types/events/qrCodeManagement';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function QRCodeManagementPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [loading, setLoading] = useState({
    info: true,
    tickets: true,
  });
  const [exporting, setExporting] = useState(false);
  const [resendingBulk, setResendingBulk] = useState(false);

  const loadEventInfo = async () => {
    try {
      const info = await qrCodeManagementService.getEventInfo(eventId);
      setEventInfo(info);
    } catch (error) {
      console.error('Failed to load event info:', error);
      toast.error('Failed to load event information');
    } finally {
      setLoading(prev => ({ ...prev, info: false }));
    }
  };

  const loadTickets = async () => {
    try {
      const ticketsData = await qrCodeManagementService.getTickets(eventId);
      setTickets(ticketsData);
      setFilteredTickets(ticketsData);
    } catch (error) {
      console.error('Failed to load tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(prev => ({ ...prev, tickets: false }));
    }
  };

  useEffect(() => {
    loadEventInfo();
    loadTickets();
  }, [eventId]);

  useEffect(() => {
    let filtered = [...tickets];
    
    if (selectedRoleFilter !== 'all') {
      filtered = filtered.filter(t => t.role === selectedRoleFilter);
    }
    
    if (selectedStatusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === selectedStatusFilter);
    }
    
    setFilteredTickets(filtered);
  }, [selectedRoleFilter, selectedStatusFilter, tickets]);

  const handleRegenerateQR = async (ticketId: string) => {
    try {
      await qrCodeManagementService.regenerateQRCode(eventId, ticketId);
      await loadTickets();
      toast.success('QR code regenerated');
    } catch (error) {
      toast.error('Failed to regenerate QR code');
    }
  };

  const handleResendTicket = async (ticketId: string, method: 'email' | 'sms') => {
    try {
      await qrCodeManagementService.resendTickets(eventId, [ticketId], method);
      await loadTickets();
      toast.success(`Ticket resent via ${method.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to resend ticket');
    }
  };

  const handleBulkResend = async (method: 'email' | 'sms') => {
    if (selectedTickets.length === 0) {
      toast.error('No tickets selected');
      return;
    }
    
    setResendingBulk(true);
    try {
      await qrCodeManagementService.resendTickets(eventId, selectedTickets, method);
      await loadTickets();
      setSelectedTickets([]);
      toast.success(`${selectedTickets.length} tickets resent via ${method.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to resend tickets');
    } finally {
      setResendingBulk(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (selectedTickets.length === 0) {
      toast.error('No tickets selected for download');
      return;
    }
    
    setExporting(true);
    try {
      const blob = await qrCodeManagementService.downloadTicketsPDF(eventId, selectedTickets);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets-${eventInfo?.name || eventId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch (error) {
      toast.error('Failed to download PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const stats = [
    { label: 'Total Tickets', value: eventInfo?.totalTickets || 0, icon: Ticket, color: 'text-blue-500' },
    { label: 'Sold', value: eventInfo?.ticketsSold || 0, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Used', value: eventInfo?.ticketsUsed || 0, icon: Clock, color: 'text-yellow-500' },
    { label: 'Remaining', value: (eventInfo?.totalTickets || 0) - (eventInfo?.ticketsSold || 0), icon: Ticket, color: 'text-purple-500' },
  ];

  if (loading.info || loading.tickets) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading QR codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm mb-2 inline-flex items-center gap-1 hover:text-primary-green-500 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← Back to Event
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            QR Code Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {eventInfo?.name} - {eventInfo?.date && new Date(eventInfo.date).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </span>
                  <Icon size={18} className={stat.color} />
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stat.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Role QR Generator */}
        <div className="mb-6">
          <RoleQRGenerator
            eventId={eventId}
            eventName={eventInfo?.name || 'Event'}
            onGenerate={(role, qrData) => {
              console.log(`Generated ${role} QR code`, qrData);
            }}
          />
        </div>

        {/* Filters and Bulk Actions */}
        <div
          className="rounded-xl p-4 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Filter:</span>
              </div>
              
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="all">All Roles</option>
                <option value="MERCHANT">Merchant</option>
                <option value="ORGANIZER">Organizer</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="APPROVER">Approver</option>
                <option value="FINANCE_OFFICER">Finance</option>
                <option value="ADMIN">Admin</option>
                <option value="PUBLIC">Public</option>
              </select>
              
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="used">Used</option>
                <option value="expired">Expired</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                {selectedTickets.length === filteredTickets.length ? 'Deselect All' : 'Select All'}
              </button>
              
              <button
                onClick={() => handleBulkResend('email')}
                disabled={selectedTickets.length === 0 || resendingBulk}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {resendingBulk ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Mail size={14} />
                )}
                Resend Email
              </button>
              
              <button
                onClick={() => handleBulkResend('sms')}
                disabled={selectedTickets.length === 0 || resendingBulk}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {resendingBulk ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Smartphone size={14} />
                )}
                Resend SMS
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={selectedTickets.length === 0 || exporting}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-primary-green-500 text-white hover:bg-primary-green-600 transition-colors disabled:opacity-50"
              >
                {exporting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                Download PDF
              </button>
            </div>
          </div>
          
          {selectedTickets.length > 0 && (
            <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
              {selectedTickets.length} ticket{selectedTickets.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* QR Code Grid */}
        <QRCodeGrid
          tickets={filteredTickets}
          eventName={eventInfo?.name || 'Event'}
          onRegenerateQR={handleRegenerateQR}
          onResendTicket={handleResendTicket}
          loading={loading.tickets}
        />
      </div>
    </div>
  );
}