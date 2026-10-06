import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Global uncaught error telemetry capture
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('[GAIA Telemetry OS] Uncaught Global Error:', event.error || event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[GAIA Telemetry OS] Unhandled Promise Rejection:', event.reason);
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  const fatalDiv = document.createElement('div');
  fatalDiv.style.cssText = 'padding: 32px; background: #131315; color: #ffb4ab; font-family: monospace; min-height: 100vh;';
  fatalDiv.innerHTML = '<h2>[CRITICAL ERROR]: Root DOM node #root missing</h2>';
  document.body.appendChild(fatalDiv);
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (err) {
    console.error('[GAIA Telemetry OS] Fatal Mount Error:', err);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; padding: 32px; background: #131315; color: #ffb4ab; font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; justify-content: center;">
        <div style="background: #1E1E24; border: 1px solid #ef4444; border-radius: 4px; padding: 24px; max-width: 600px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <div style="color: #ef4444; font-weight: bold; font-size: 16px; margin-bottom: 8px;">[FATAL MOUNT EXCEPTION]</div>
          <div style="color: #e5e1e4; font-size: 13px; margin-bottom: 16px;">Failed to initialize React root renderer.</div>
          <pre style="background: #0e0e10; padding: 12px; border-radius: 4px; font-size: 11px; overflow-x: auto; color: #ffdad7;">${
            err instanceof Error ? err.stack || err.message : String(err)
          }</pre>
          <div style="margin-top: 16px; text-align: right;">
            <button onclick="window.location.reload()" style="background: #0066b1; color: white; border: none; padding: 6px 16px; border-radius: 4px; font-family: inherit; font-size: 12px; cursor: pointer;">Retry Reboot</button>
          </div>
        </div>
      </div>
    `;
  }
}
