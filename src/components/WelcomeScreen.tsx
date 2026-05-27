// ============================================================
// WelcomeScreen Component
// ============================================================
// Initial welcome state shown before conversation starts.
// Adapted from the main frontend WelcomeScreen for widget sizing.
// ============================================================

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  primaryColor?: string;
  botAvatar?: string;
  botName?: string;
  title?: string;
  subtitle?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  primaryColor = '#4F46E5',
  botAvatar,
  botName = 'AI Assistant',
  title = 'Welcome!',
  subtitle = 'Hi there! I\'m your AI assistant. How can I help you today?',
}) => {
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-5 py-6 w-full animate-fade-in">

      {/* AI Icon / Avatar */}
      <div
        className="mb-5 relative cursor-pointer group"
        onClick={onStart}
        style={{ width: 80, height: 80 }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-30 animate-pulse"
          style={{ backgroundColor: primaryColor }}
        />
        <div className="w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center relative z-10 border border-gray-100 transition-transform duration-300 group-hover:scale-105">
          {botAvatar ? (
            <img src={botAvatar} alt={botName} className="w-10 h-10 object-contain" />
          ) : (
            <Sparkles size={34} strokeWidth={1.5} style={{ color: primaryColor }} />
          )}
          {/* Online dot */}
          <div className="absolute bottom-1 right-1 flex items-center justify-center">
            <div className="absolute w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white relative z-10" />
          </div>
        </div>
      </div>

      {/* Greeting tooltip */}
      <div
        className={`transition-all duration-500 transform mb-4 ${
          showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-medium border border-gray-700 relative">
          👋 Hi! Ready to chat?
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 border-b border-r border-gray-700 rotate-45" />
        </div>
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight tracking-tight">
        {title}
      </h2>
      <p className="text-gray-500 text-[13px] max-w-[240px] mx-auto leading-relaxed mb-6">
        {subtitle}
      </p>

      {/* CTA Button */}
      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="relative z-10">Start Conversation</span>
        <div className="relative z-10 bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
          <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>

      {/* Powered by */}
      <p className="mt-6 text-[10px] text-gray-300">
        Powered by <span style={{ color: primaryColor }}>QBot AI</span>
      </p>
    </div>
  );
};

export default WelcomeScreen;
