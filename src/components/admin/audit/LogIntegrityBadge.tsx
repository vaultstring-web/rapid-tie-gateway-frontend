'use client';

import { Shield, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { auditService } from '@/services/admin/audit.service';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface LogIntegrityBadgeProps {
  onVerify?: () => void;
}

export const LogIntegrityBadge = ({ onVerify }: LogIntegrityBadgeProps) => {
  const { theme } = useTheme();
  const [verified, setVerified] = useState<boolean | null>(null);
  const [tamperedCount, setTamperedCount] = useState(0);
  const [verifying, setVerifying] = useState(false);

  const verifyIntegrity = async () => {
    setVerifying(true);
    try {
      const result = await auditService.verifyIntegrity();
      setVerified(result.verified);
      setTamperedCount(result.tamperedLogs.length);
      toast.success(result.verified ? 'Log integrity verified' : `Found ${result.tamperedLogs.length} tampered logs`);
    } catch (error) {
      console.error('Failed to verify integrity:', error);
      toast.error('Failed to verify log integrity');
    } finally {
      setVerifying(false);
      onVerify?.();
    }
  };

  useEffect(() => {
    verifyIntegrity();
  }, []);

  const getIcon = () => {
    if (verified === null) return <Shield size={16} className="text-gray-500" />;
    if (verified) return <CheckCircle size={16} className="text-green-500" />;
    return <AlertTriangle size={16} className="text-red-500" />;
  };

  const getText = () => {
    if (verified === null) return 'Verifying integrity...';
    if (verified) return 'Logs verified - Tamper-proof';
    return `${tamperedCount} tampered logs detected`;
  };

  const getColor = () => {
    if (verified === null) return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    if (verified) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getColor()}`}>
      {verifying ? (
        <RefreshCw size={14} className="animate-spin" />
      ) : (
        getIcon()
      )}
      <span className="text-xs font-medium">{getText()}</span>
      <button
        onClick={verifyIntegrity}
        disabled={verifying}
        className="text-xs underline hover:no-underline disabled:opacity-50"
      >
        Verify
      </button>
    </div>
  );
};