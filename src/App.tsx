// ============================================================
// Widget App Root
// ============================================================

import React, { useEffect, useRef } from 'react';
import { WidgetConfig } from './types';
import { useChatStore } from './store/chatStore';
import FloatingButton from './components/FloatingButton';
import ChatWindow from './components/ChatWindow';

interface AppProps {
  config: WidgetConfig;
  shadowRoot: ShadowRoot;
}

const App: React.FC<AppProps> = ({ config, shadowRoot }) => {
  const { isOpen, openWidget, closeWidget, toggleWidget, setConfig } = useChatStore();
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConfig(config);
  }, [config, setConfig]);

  // Listen for external programmatic control events
  useEffect(() => {
    const mountPoint = shadowRoot.getElementById('qbot-widget-mount');
    if (!mountPoint) return;
    const onOpen = () => openWidget();
    const onClose = () => closeWidget();
    const onToggle = () => toggleWidget();
    mountPoint.addEventListener('qbot:open', onOpen);
    mountPoint.addEventListener('qbot:close', onClose);
    mountPoint.addEventListener('qbot:toggle', onToggle);
    return () => {
      mountPoint.removeEventListener('qbot:open', onOpen);
      mountPoint.removeEventListener('qbot:close', onClose);
      mountPoint.removeEventListener('qbot:toggle', onToggle);
    };
  }, [shadowRoot, openWidget, closeWidget, toggleWidget]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const path = e.composedPath();
      const insideWindow = path.some((el) => el === windowRef.current);
      const isToggleBtn = path.some((el) => el instanceof Element && el.id === 'qbot-toggle-btn');
      if (!insideWindow && !isToggleBtn) closeWidget();
    };
    document.addEventListener('click', handleClickOutside, { capture: true });
    return () => document.removeEventListener('click', handleClickOutside, { capture: true });
  }, [isOpen, closeWidget]);

  const primaryColor = config.theme?.primary || '#4F46E5';
  const position = config.position || 'bottom-right';
  const isLeft = position === 'bottom-left';

  return (
    // Full-size wrapper — pointer-events:none so page clicks pass through
    <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>

      {/* ── Floating toggle button ── */}
      <div
        className={`qbot-toggle-btn-container ${isOpen ? 'widget-open' : ''}`}
        style={{
          position: 'fixed',
          bottom: '20px',
          [isLeft ? 'left' : 'right']: '20px',
          pointerEvents: 'auto',
          zIndex: 1,
        }}
      >
        <FloatingButton
          primaryColor={primaryColor}
          botAvatar={config.botAvatar}
          position={position}
        />
      </div>

      {/* ── Chat window panel ── */}
      <div
        ref={windowRef}
        className={`qbot-chat-window-container ${isOpen ? 'widget-open' : ''}`}
        style={{
          position: 'fixed',
          bottom: 'var(--qbot-window-bottom, 88px)',
          [isLeft ? 'left' : 'right']: 'var(--qbot-window-right, 16px)',
          pointerEvents: isOpen ? 'auto' : 'none',
          zIndex: 1,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(18px)',
          transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1), bottom 0.25s ease, right 0.25s ease, left 0.25s ease, top 0.25s ease',
          transformOrigin: isLeft ? 'bottom left' : 'bottom right',
        }}
      >
        <ChatWindow config={config} />
      </div>
    </div>

  );
};

export default App;
