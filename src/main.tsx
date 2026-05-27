// ============================================================
// Widget Bootstrap Entry Point
// ============================================================

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import cssText from './index.css?inline';

declare global {
  interface Window {
    QBotConfig?: QBotConfig;
    QBot?: {
      open: () => void;
      close: () => void;
      toggle: () => void;
      destroy: () => void;
    };
  }
}

export interface QBotConfig {
  apiKey: string;
  tenantId: string;
  apiBaseUrl: string;
  theme?: {
    primary?: string;
    secondary?: string;
  };
  botName?: string;
  botAvatar?: string;
  placeholder?: string;
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  position?: 'bottom-right' | 'bottom-left';
  zIndex?: number;
}

function bootstrap() {
  const config = window.QBotConfig;

  if (!config) {
    console.warn('[QBot Widget] window.QBotConfig is not defined. Widget will not initialize.');
    return;
  }
  if (!config.tenantId) {
    console.error('[QBot Widget] tenantId is required in window.QBotConfig.');
    return;
  }
  

  // ─── Host element: full-viewport fixed overlay (pointer-events:none) ───
  // This is the KEY fix: the host covers the entire viewport so that
  // child elements can use absolute/fixed positioning correctly without
  // being clipped by a tiny corner container.
  const hostEl = document.createElement('div');
  hostEl.id = 'qbot-widget-host';
  Object.assign(hostEl.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: String(config.zIndex ?? 999999),
    pointerEvents: 'none', // transparent to host page clicks
    overflow: 'hidden',
  });
  document.body.appendChild(hostEl);

  // ─── Shadow DOM for CSS isolation ────────────────────────────────────
  const shadowRoot = hostEl.attachShadow({ mode: 'open' });

  // Inject styles directly into the Shadow DOM
  const styleEl = document.createElement('style');
  styleEl.textContent = cssText;
  shadowRoot.appendChild(styleEl);

  const mountPoint = document.createElement('div');
  mountPoint.id = 'qbot-widget-mount';
  Object.assign(mountPoint.style, {
    width: '100%',
    height: '100%',
    pointerEvents: 'none', // still none; individual components enable their own
  });
  shadowRoot.appendChild(mountPoint);

  // ─── Mount React ─────────────────────────────────────────────────────
  const root = createRoot(mountPoint);
  root.render(
    <React.StrictMode>
      <App config={config} shadowRoot={shadowRoot} />
    </React.StrictMode>
  );

  // ─── Public API ───────────────────────────────────────────────────────
  window.QBot = {
    open: () => mountPoint.dispatchEvent(new CustomEvent('qbot:open', { bubbles: true, composed: true })),
    close: () => mountPoint.dispatchEvent(new CustomEvent('qbot:close', { bubbles: true, composed: true })),
    toggle: () => mountPoint.dispatchEvent(new CustomEvent('qbot:toggle', { bubbles: true, composed: true })),
    destroy: () => {
      root.unmount();
      hostEl.remove();
      delete window.QBot;
    },
  };

  console.info('[QBot Widget] Initialized for tenant:', config.tenantId);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
