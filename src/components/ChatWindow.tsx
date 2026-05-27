// ============================================================
// ChatWindow Component
// ============================================================

import React, { useRef, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { WidgetConfig } from '../types';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import QuickReplies from './QuickReplies';
import ActionButtons from './ActionButtons';
import WelcomeScreen from './WelcomeScreen';

interface ChatWindowProps {
  config: WidgetConfig;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ config }) => {
  const {
    messages, isLoading, conversationStarted, quickReplies, showActions, error,
    startConversation, sendMessage, addFeedback,
    handleScheduleCall, handleMaybeLater, resetConversation, closeWidget, clearError,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const primaryColor = config.theme?.primary || '#4F46E5';
  const secondaryColor = config.theme?.secondary || primaryColor;

  useEffect(() => {
    const t = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(t);
  }, [messages, isLoading]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8fafc',
      borderRadius: 'var(--qbot-border-radius, 20px)',
      boxShadow: '0 8px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      border: '1px solid rgba(0,0,0,0.08)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      pointerEvents: 'auto',
    }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor}dd 100%)`,
        flexShrink: 0,
      }}>
        {/* Bot info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0,
          }}>
            {config.botAvatar
              ? <img src={config.botAvatar} alt="bot" style={{ width: 20, height: 20, objectFit: 'contain' }} />
              : <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
            }
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>
              {config.botName || 'AI Assistant'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'qbot-blink 2s ease-in-out infinite' }} />
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Online</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { icon: <RotateCcw size={18} />, onClick: resetConversation, title: 'Restart' },
            { icon: <X size={18} />, onClick: closeWidget, title: 'Close' },
          ].map((btn, i) => (
            <button key={i} onClick={btn.onClick} title={btn.title} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.8)', padding: '5px 6px',
              borderRadius: 8, display: 'flex', alignItems: 'center',
              transition: 'background 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        <style>{`
          @keyframes qbot-blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
        `}</style>
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {!conversationStarted ? (
          /* Welcome Screen */
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <WelcomeScreen
              onStart={startConversation}
              primaryColor={primaryColor}
              botAvatar={config.botAvatar}
              botName={config.botName}
              title={config.welcomeTitle}
              subtitle={config.welcomeSubtitle}
            />
          </div>
        ) : (
          <>
            {/* Messages */}
            <div
              className="qbot-messages"
              style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 4px' }}
            >
              {messages.length === 0 && (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', height: '100%', gap: 10, opacity: 0.6,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: primaryColor + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {config.botAvatar
                      ? <img src={config.botAvatar} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                      : <span style={{ fontSize: 22 }}>💬</span>
                    }
                  </div>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Say hello to get started! 👋</span>
                </div>
              )}

              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  botAvatar={config.botAvatar}
                  botName={config.botName}
                  primaryColor={primaryColor}
                  allowFeedback={true}
                  onFeedback={addFeedback}
                />
              ))}

              {error && !isLoading && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 12, padding: '8px 12px', marginBottom: 8,
                  fontSize: 12, color: '#dc2626',
                }}>
                  <span>{error}</span>
                  <button onClick={clearError} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', marginLeft: 8 }}>
                    <X size={12} />
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {quickReplies.length > 0 && !isLoading && (
              <div style={{ padding: '0 12px' }}>
                <QuickReplies options={quickReplies} onSelect={sendMessage} primaryColor={primaryColor} />
              </div>
            )}

            {/* Action buttons */}
            {showActions && !isLoading && (
              <div style={{ padding: '0 12px' }}>
                <ActionButtons onSchedule={handleScheduleCall} onLater={handleMaybeLater} primaryColor={primaryColor} />
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: '10px 12px 12px',
              background: 'white',
              borderTop: '1px solid #f1f5f9',
              flexShrink: 0,
            }}>
              <ChatInput
                onSend={sendMessage}
                disabled={isLoading}
                placeholder={config.placeholder}
                primaryColor={primaryColor}
              />
              <div style={{ textAlign: 'center', marginTop: 6, fontSize: 10, color: '#cbd5e1' }}>
                Powered by <span style={{ color: primaryColor }}>QBot</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
