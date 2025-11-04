/**
 * Debug page to check environment variables
 * Visit /debug-env to see what env vars are loaded
 */

export default function DebugEnvPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Debug</h1>
      <div style={{ background: '#f5f5f5', padding: '20px', marginTop: '20px' }}>
        <h2>NEXT_PUBLIC Variables (Available in Browser)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Variable</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px' }}>NEXT_PUBLIC_SAAS_URL</td>
              <td style={{ padding: '10px', fontWeight: 'bold', color: process.env.NEXT_PUBLIC_SAAS_URL ? 'green' : 'red' }}>
                {process.env.NEXT_PUBLIC_SAAS_URL || '(empty)'}
              </td>
            </tr>
            <tr style={{ background: '#fff' }}>
              <td style={{ padding: '10px' }}>NEXT_PUBLIC_LAUNDRY_SLUG</td>
              <td style={{ padding: '10px' }}>{process.env.NEXT_PUBLIC_LAUNDRY_SLUG || '(empty)'}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>NEXT_PUBLIC_LAUNDRY_API_KEY</td>
              <td style={{ padding: '10px' }}>
                {process.env.NEXT_PUBLIC_LAUNDRY_API_KEY 
                  ? process.env.NEXT_PUBLIC_LAUNDRY_API_KEY.substring(0, 10) + '...' 
                  : '(empty)'}
              </td>
            </tr>
            <tr style={{ background: '#fff' }}>
              <td style={{ padding: '10px' }}>NEXT_PUBLIC_SITE_URL</td>
              <td style={{ padding: '10px' }}>{process.env.NEXT_PUBLIC_SITE_URL || '(empty)'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={{ background: '#fff3cd', padding: '20px', marginTop: '20px', border: '2px solid #ffc107' }}>
        <h3>⚠️ Important Notes:</h3>
        <ul>
          <li>NEXT_PUBLIC_ variables are embedded at <strong>build time</strong></li>
          <li>In development, changes require a <strong>server restart</strong></li>
          <li>If NEXT_PUBLIC_SAAS_URL is empty or wrong, the app cannot communicate with the SaaS platform</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Expected Values:</h3>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
{`NEXT_PUBLIC_SAAS_URL=http://localhost:3000
NEXT_PUBLIC_LAUNDRY_SLUG=clean-fresh-laundry
NEXT_PUBLIC_LAUNDRY_API_KEY=wp_2hmoc70526zqpwdqc3keo
NEXT_PUBLIC_SITE_URL=http://localhost:3001`}
        </pre>
      </div>
    </div>
  );
}
