'use client';

import { useState } from 'react';
import { X, Download, FileText, FileJson, FileSpreadsheet } from 'lucide-react';
import { AuditFilter } from '@/types/admin/audit';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'json' | 'excel') => Promise<void>;
}

export const ExportModal = ({ isOpen, onClose, onExport }: ExportModalProps) => {
  const { theme } = useTheme();
  const [format, setFormat] = useState<'csv' | 'json' | 'excel'>('csv');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExport(format);
      toast.success(`Exported as ${format.toUpperCase()}`);
      onClose();
    } catch (error) {
      toast.error('Failed to export');
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  const formats = [
    { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values, compatible with Excel' },
    { value: 'json', label: 'JSON', icon: FileJson, description: 'Raw JSON format for developers' },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Excel workbook (.xlsx)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-xl max-w-md w-full p-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-[#84cc16]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Export Audit Logs</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Choose your preferred export format. The export will include all logs matching your current filters.
        </p>

        <div className="space-y-3 mb-6">
          {formats.map((fmt) => {
            const Icon = fmt.icon;
            const isSelected = format === fmt.value;
            return (
              <button
                key={fmt.value}
                onClick={() => setFormat(fmt.value as any)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isSelected ? 'border-[#84cc16] bg-[#84cc16]/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{ borderColor: isSelected ? '#84cc16' : 'var(--border-color)' }}
              >
                <Icon size={20} className={isSelected ? 'text-[#84cc16]' : 'text-[var(--text-secondary)]'} />
                <div className="flex-1 text-left">
                  <p className={`text-sm font-medium ${isSelected ? 'text-[#84cc16]' : 'text-[var(--text-primary)]'}`}>
                    {fmt.label}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{fmt.description}</p>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#84cc16]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Export
          </button>
        </div>
      </div>
    </div>
  );
};