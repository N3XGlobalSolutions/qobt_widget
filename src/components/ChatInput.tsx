// ============================================================
// ChatInput Component
// ============================================================
// Message input with send button, Enter-to-send,
// auto-focus, and disabled state during loading.
// Adapted from the main frontend ChatInput.
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder?: string;
  primaryColor?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled,
  placeholder = 'Type your message...',
  primaryColor = '#4F46E5',
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when bot finishes replying
  useEffect(() => {
    if (!disabled && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !disabled) {
        onSend(input.trim());
        setInput('');
      }
    }
  };

  const canSend = input.trim().length > 0 && !disabled;

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 w-full">
      <div className="relative flex-1">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            // Auto-resize textarea
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={`
            w-full resize-none overflow-hidden
            bg-white border border-gray-200 rounded-2xl
            py-3 pl-4 pr-4 text-sm text-gray-800
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-all duration-200
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            leading-relaxed
          `}
          style={{ focusRingColor: primaryColor } as any}
        />
      </div>
      <button
        type="submit"
        disabled={!canSend}
        className={`
          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
          transition-all duration-200 shadow-sm
          ${canSend
            ? 'hover:scale-105 hover:shadow-md text-white'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
        style={canSend ? { backgroundColor: primaryColor } : undefined}
        title="Send message"
      >
        <Send size={16} className={canSend ? 'fill-white' : ''} />
      </button>
    </form>
  );
};

export default ChatInput;
