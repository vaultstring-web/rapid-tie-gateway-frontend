'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Download, Users, Tag, Star } from 'lucide-react';
import { ROLE_QR_CONFIGS } from '@/types/events/qrCodeManagement';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface RoleQRGeneratorProps {
  eventId: string;
  eventName: string;
  onGenerate: (role: string, qrData: { qrCode: string; dataUrl: string }) => void;
}

export const RoleQRGenerator = ({ eventId, eventName, onGenerate }: RoleQRGeneratorProps) => {
  const { theme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<string>(ROLE_QR_CONFIGS[0].role);
  const [generatedQR, setGeneratedQR] = useState<{ qrCode: string; dataUrl: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedConfig = ROLE_QR_CONFIGS.find(r => r.role === selectedRole);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const qrData = {
        qrCode: `https://rapidtie.com/event/${eventId}/role/${selectedRole}`,
        dataUrl: '',
      };
      setGeneratedQR(qrData);
      onGenerate(selectedRole, qrData);
      toast.success(`${selectedConfig?.label} QR code generated`);
    } catch (error) {
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedQR?.dataUrl) {
      const link = document.createElement('a');
      link.download = `qr-${eventName}-${selectedConfig?.label}.png`;
      link.href = generatedQR.dataUrl;
      link.click();
      toast.success('QR code downloaded');
    }
  };

  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-primary-green-500" />
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Role-Specific QR Codes
        </h3>
      </div>

      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Generate special QR codes for different attendee roles with custom benefits
      </p>

      {/* Role Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {ROLE_QR_CONFIGS.map((config) => (
          <button
            key={config.role}
            onClick={() => setSelectedRole(config.role)}
            className={`p-2 rounded-lg text-center transition-all ${
              selectedRole === config.role
                ? 'ring-2 ring-primary-green-500'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: `${config.color}20`,
              borderColor: config.color,
              borderWidth: 1,
            }}
          >
            <div className="text-sm font-medium" style={{ color: config.color }}>
              {config.label}
            </div>
            {config.discount && (
              <div className="text-xs mt-1" style={{ color: config.color }}>
                {config.discount}% off
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Benefits Preview */}
      {selectedConfig && (
        <div
          className="p-3 rounded-lg mb-4 flex items-center gap-2"
          style={{ backgroundColor: `${selectedConfig.color}10` }}
        >
          <Star size={14} style={{ color: selectedConfig.color }} />
          <span className="text-sm" style={{ color: selectedConfig.color }}>
            {selectedConfig.specialAccess || `${selectedConfig.label} benefits apply`}
          </span>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 transition-colors disabled:opacity-50 mb-4"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </div>
        ) : (
          `Generate ${selectedConfig?.label} QR Code`
        )}
      </button>

      {/* Generated QR Display */}
      {generatedQR && selectedConfig && (
        <div
          className="mt-4 p-4 rounded-lg text-center border"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="inline-block p-3 bg-white rounded-lg mb-3">
            <QRCode value={generatedQR.qrCode} size={120} />
          </div>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            {selectedConfig.label} QR Code
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm border"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <Download size={14} />
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
};