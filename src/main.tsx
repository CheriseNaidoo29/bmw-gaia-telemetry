import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    createRoot(rootElement).render(<App />);
  } catch (err) {
    console.error('Fatal initialization error:', err);
    rootElement.innerHTML = `
      <div style="padding: 32px; background: #131315; color: #ffb4ab; font-family: monospace;">
        <h2 style="margin-top:0;">Failed to mount application</h2>
        <pre>${err instanceof Error ? err.stack : String(err)}</pre>
      </div>
    `;
  }
}
