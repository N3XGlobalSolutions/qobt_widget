// ============================================================
// FloatingButton Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

interface FloatingButtonProps {
  primaryColor?: string;
  botAvatar?: string;
  position?: 'bottom-right' | 'bottom-left';
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  primaryColor = '#4F46E5',
  botAvatar,
}) => {
  const { isOpen, toggleWidget, messages } = useChatStore();
  const [unread, setUnread] = useState(0);
  const [prevCount, setPrevCount] = useState(0);

  // Track new bot messages while closed
  useEffect(() => {
    const botMsgs = messages.filter((m) => m.role === 'model' && !m.isStreaming);
    if (!isOpen && botMsgs.length > prevCount) {
      setUnread((u) => u + (botMsgs.length - prevCount));
    }
    setPrevCount(botMsgs.length);
  }, [messages, isOpen]);

  // Clear unread when opened
  useEffect(() => {
    if (isOpen) setUnread(0);
  }, [isOpen]);

  return (
    <button
      id="qbot-toggle-btn"
      onClick={toggleWidget}
      title={isOpen ? 'Close chat' : 'Chat with us'}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      style={{
        position: 'relative',
        width: 56,
        height: 56,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: primaryColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        pointerEvents: 'auto',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.22)';
      }}
    >
      {/* Pulse ring — only when closed */}
      {!isOpen && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: primaryColor,
            opacity: 0.35,
            animation: 'qbot-pulse 2s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Icon */}
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isOpen ? (
          <X size={24} color="white" strokeWidth={2.5} />
        ) : botAvatar ? (
          <img src={botAvatar} alt="chat" style={{ width: 30, height: 30, objectFit: 'contain', borderRadius: '50%' }} />
        ) : (
          <MessageCircle size={26} color="white" strokeWidth={2} />
        )}
      </span>

      {/* Unread badge */}
      {!isOpen && unread > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 18,
            height: 18,
            background: '#ef4444',
            color: 'white',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        >
          {unread > 9 ? '9+' : unread}
        </span>
      )}

      {/* Inline keyframe for pulse (can't use Tailwind inside Shadow DOM easily) */}
      <style>{`
        @keyframes qbot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.45); opacity: 0; }
        }
      `}</style>
    </button>
  );
};

export default FloatingButton;
