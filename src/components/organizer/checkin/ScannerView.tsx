'use client';

import { useState, useEffect, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Camera, CameraOff, ScanLine, AlertCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ScannerViewProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
  scanning: boolean;
}

export const ScannerView = ({ onScan, onError, scanning }: ScannerViewProps) => {
  const { theme } = useTheme();
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    checkCamera();
  }, []);

  const checkCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasCamera(videoDevices.length > 0);
      if (videoDevices.length === 0) {
        setCameraError('No camera found on this device');
      }
    } catch (err) {
      setCameraError('Unable to access camera');
      setHasCamera(false);
    }
  };

  const handleScan = (result: any) => {
    if (result && scanning) {
      onScan(result.text);
    }
  };

  const handleError = (err: any) => {
    console.error('Scanner error:', err);
    if (onError) onError(err.message);
  };

  if (!hasCamera) {
    return (
      <div
        className="rounded-xl p-8 text-center border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <CameraOff size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-secondary)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Camera Not Available
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {cameraError || 'Please ensure you have a camera connected and permissions granted'}
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="relative">
        <QrReader
          onResult={handleScan}
          onError={handleError}
          constraints={{ facingMode: 'environment' }}
          scanDelay={300}
          containerStyle={{ width: '100%' }}
          videoStyle={{ width: '100%', height: 'auto' }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-2 border-primary-green-500 rounded-lg m-8" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <ScanLine size={48} className="text-primary-green-500 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Position the QR code within the frame to scan
        </p>
      </div>
    </div>
  );
};