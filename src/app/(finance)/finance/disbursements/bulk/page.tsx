// src/app/(finance)/finance/disbursements/bulk/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, CheckCircle, XCircle, AlertCircle, Loader2, ArrowRight, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParsedRecord {
  id: number;
  recipient: string;
  amount: number;
  type: string;
  status: string;
  message?: string;
}

export default function BulkDisbursement() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedRecord[] | null>(null);

  // Template download handler
  const downloadTemplate = () => {
    // Create CSV template content
    const headers = ['Recipient Name', 'Amount', 'Type', 'Event/Department', 'Notes'];
    const sampleRow = ['John Doe', '1000', 'Travel', 'Sales Conference', 'Flight and hotel'];
    const csvContent = [
      headers.join(','),
      sampleRow.join(','),
      ['Jane Smith', '2500', 'Equipment', 'Engineering', 'New laptop'].join(','),
      ['Mike Johnson', '500', 'Training', 'Marketing', 'Course fee'].join(',')
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'disbursement_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        // Simulate parsing results
        setParsedData([
          { id: 1, recipient: 'Alex Johnson', amount: 1250, type: 'Travel', status: 'Valid' },
          { id: 2, recipient: 'Sarah Miller', amount: 3400, type: 'Equipment', status: 'Valid' },
          { id: 3, recipient: 'Unknown User', amount: 0, type: 'Other', status: 'Error', message: 'Invalid recipient ID' },
          { id: 4, recipient: 'Michael Chen', amount: 800, type: 'Event', status: 'Valid' },
          { id: 5, recipient: 'Emma Wilson', amount: 1500, type: 'Travel', status: 'Warning', message: 'Amount exceeds limit' },
        ]);
      }
    }, 200);
  };

  const validRecords = parsedData?.filter(r => r.status === 'Valid').length || 0;
  const errorRecords = parsedData?.filter(r => r.status === 'Error').length || 0;

  return (
    <div className="space-y-8 animate-slide-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Disbursement</h1>
          <p className="text-gray-500 mt-1">Upload CSV or Excel files to process multiple disbursements at once.</p>
        </div>
        <button 
          onClick={downloadTemplate}
          className="btn-secondary gap-2 inline-flex items-center justify-center"
        >
          <Download className="w-5 h-5 shrink-0" />
          <span>Download Template</span>
        </button>
      </header>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <div className="p-1.5 bg-blue-100 rounded-lg shrink-0">
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 mb-1">How to use Bulk Disbursement:</h4>
          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>Download the CSV template using the button above</li>
            <li>Fill in your disbursement data (recipient, amount, type, etc.)</li>
            <li>Save the file and drag & drop or click to upload</li>
            <li>Review the validation results - errors will be highlighted</li>
            <li>Click "Process Valid Records" to disburse only the valid entries</li>
          </ol>
        </div>
      </div>

      {/* Upload Zone */}
      {!parsedData && (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "card border-2 border-dashed py-16 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer",
            isDragging ? "border-[#84cc16] bg-[#84cc16]/5 scale-[1.01]" : "border-gray-200 bg-white"
          )}
        >
          {isUploading ? (
            <div className="text-center space-y-4 w-full max-w-xs">
              <div className="flex justify-center">
                <Loader2 className="w-12 h-12 text-[#84cc16] animate-spin" />
              </div>
              <p className="text-sm font-bold text-gray-900">Uploading and Parsing File...</p>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-[#84cc16] h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{uploadProgress}% Complete</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Drag and drop your file here</p>
                <p className="text-sm text-gray-500">or click to browse from your computer</p>
              </div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Supports .CSV, .XLSX</p>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="btn-primary cursor-pointer inline-flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Select File</span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Preview Table */}
      <AnimatePresence>
        {parsedData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">File Parsed Successfully</h3>
                  <p className="text-sm text-gray-500">
                    Found {parsedData.length} records: 
                    <span className="text-green-600 ml-1">{validRecords} valid</span>
                    {errorRecords > 0 && <span className="text-red-600 ml-1">{errorRecords} errors</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  className="btn-secondary btn-small inline-flex items-center justify-center gap-2" 
                  onClick={() => setParsedData(null)}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Another File</span>
                </button>
                <button 
                  className="btn-primary btn-small inline-flex items-center justify-center gap-2"
                  disabled={validRecords === 0}
                >
                  <span>Process {validRecords} Valid Records</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 font-bold text-gray-700">Recipient</th>
                      <th className="px-6 py-4 font-bold text-gray-700">Type</th>
                      <th className="px-6 py-4 font-bold text-gray-700 text-right">Amount</th>
                      <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedData.map((row) => (
                      <tr key={row.id} className={cn(
                        "transition-colors",
                        row.status === 'Error' ? "bg-red-50/50" : 
                        row.status === 'Warning' ? "bg-amber-50/50" : "hover:bg-gray-50"
                      )}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{row.recipient}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{row.type}</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          MK {row.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {row.status === 'Valid' ? (
                            <div className="inline-flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase">
                              <CheckCircle className="w-3 h-3 shrink-0" />
                              <span>Valid</span>
                            </div>
                          ) : row.status === 'Warning' ? (
                            <div className="space-y-1">
                              <div className="inline-flex items-center gap-1 text-amber-600 font-bold text-[10px] uppercase">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>Warning</span>
                              </div>
                              <p className="text-[10px] text-amber-600 italic">{row.message}</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="inline-flex items-center gap-1 text-red-600 font-bold text-[10px] uppercase">
                                <XCircle className="w-3 h-3 shrink-0" />
                                <span>Error</span>
                              </div>
                              <p className="text-[10px] text-red-500 italic">{row.message}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}