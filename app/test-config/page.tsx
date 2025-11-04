/**
 * Test Config Page - Shows what config values are actually loaded
 */
'use client';

import { laundryConfig } from '@/lib/config';

export default function TestConfigPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>🔧 Configuration Test</h1>
      
      <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #3b82f6' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#1e40af' }}>Current Configuration Values:</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #bfdbfe' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Laundry Slug:</td>
              <td style={{ padding: '12px' }}>{laundryConfig.slug}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #bfdbfe' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>API Key:</td>
              <td style={{ padding: '12px' }}>{laundryConfig.apiKey.substring(0, 15)}...</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #bfdbfe' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>SaaS URL:</td>
              <td style={{ 
                padding: '12px', 
                fontWeight: 'bold', 
                color: laundryConfig.saasUrl ? '#059669' : '#dc2626',
                fontSize: '16px'
              }}>
                {laundryConfig.saasUrl || '⚠️ EMPTY - This is the problem!'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Site URL:</td>
              <td style={{ padding: '12px' }}>{laundryConfig.siteUrl}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ 
        background: laundryConfig.saasUrl ? '#f0fdf4' : '#fef2f2', 
        padding: '20px', 
        borderRadius: '8px',
        border: `2px solid ${laundryConfig.saasUrl ? '#22c55e' : '#ef4444'}`
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>
          {laundryConfig.saasUrl ? '✅ Configuration Status: OK' : '❌ Configuration Status: ERROR'}
        </h2>
        {laundryConfig.saasUrl ? (
          <p>
            The SaaS URL is configured correctly. API calls will be made to:{' '}
            <strong>{laundryConfig.saasUrl}</strong>
          </p>
        ) : (
          <div>
            <p style={{ marginBottom: '10px' }}>
              ⚠️ <strong>The SaaS URL is EMPTY!</strong> This is why you're getting "Failed to fetch" errors.
            </p>
            <p style={{ marginBottom: '10px' }}>
              The config file should have a fallback to <code>http://localhost:3000</code> but it's not working.
            </p>
            <p>
              <strong>Next steps:</strong>
            </p>
            <ol style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Clear your browser cache (Cmd+Shift+R or Ctrl+Shift+R)</li>
              <li>Stop the server and run: <code>rm -rf .next && npm run dev</code></li>
              <li>If still not working, there might be a module resolution issue</li>
            </ol>
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px', border: '2px solid #f59e0b' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>🔍 How to Fix:</h3>
        <p style={{ marginBottom: '10px' }}>If SaaS URL is empty, try this in order:</p>
        <ol style={{ marginLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Hard refresh browser:</strong> Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Clear Next.js cache:</strong>
            <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px', marginTop: '5px' }}>
              cd /Users/macbook/Documents/pressingrabat{'\n'}
              rm -rf .next{'\n'}
              npm run dev
            </pre>
          </li>
          <li>
            <strong>Reload this page</strong> and check if SaaS URL is now showing
          </li>
        </ol>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔄 Reload Page
        </button>
      </div>
    </div>
  );
}
