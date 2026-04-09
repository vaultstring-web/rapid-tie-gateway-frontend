'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';

export default function TestConnectionPage() {
  const [status, setStatus] = useState<string>('Testing...');
  const [apiStatus, setApiStatus] = useState<string>('Testing...');

  useEffect(() => {
    // Test backend health
    fetch('http://localhost:3001/health')
      .then(res => res.json())
      .then(data => setStatus(`✅ Connected: ${data.project} on port ${data.port || 3001}`))
      .catch(err => setStatus(`❌ Backend not reachable: ${err.message}`));

    // Test API endpoint
    apiClient.get('/auth/status')
      .then(res => setApiStatus('✅ API is reachable'))
      .catch(err => setApiStatus(`❌ API error: ${err.message}`));
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-h2 mb-6">🔌 Connection Test</h1>
      
      <div className="card mb-4">
        <h2 className="text-h5 mb-2">Backend Health</h2>
        <p className={status.includes('✅') ? 'text-semantic-success-main' : 'text-semantic-error-main'}>
          {status}
        </p>
      </div>
      
      <div className="card">
        <h2 className="text-h5 mb-2">API Connection</h2>
        <p className={apiStatus.includes('✅') ? 'text-semantic-success-main' : 'text-semantic-error-main'}>
          {apiStatus}
        </p>
      </div>
      
      <div className="card mt-4">
        <h2 className="text-h5 mb-2">Configuration</h2>
        <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
        <p><strong>Frontend URL:</strong> {process.env.NEXTAUTH_URL}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
}