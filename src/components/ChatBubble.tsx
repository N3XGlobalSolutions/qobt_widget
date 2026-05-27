// ============================================================
// ChatBubble Component
// ============================================================
// Renders a single message bubble — user or bot.
// Extracted from the main frontend and adapted for the widget.
// Bot messages support full Markdown rendering via react-markdown.
// ============================================================

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { Message, MessageRole } from '../types';
import { User, ThumbsUp, ThumbsDown, MapPin, DollarSign, Home, Calendar, CreditCard, Check, Info } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  botAvatar?: string;
  botName?: string;
  primaryColor?: string;
  allowFeedback?: boolean;
  onFeedback?: (messageId: string, feedback: 'up' | 'down') => void;
}

const TypingIndicator: React.FC = () => (
  <div className="flex gap-1.5 items-center px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-gray-400 animate-typing-dot"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const MarkdownContent: React.FC<{ content: string }> = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkBreaks]}
    rehypePlugins={[rehypeRaw]}
    className="qbot-prose"
    components={{
      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
      li: ({ children }) => <li className="text-gray-700">{children}</li>,
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[12px] font-mono text-pink-600">{children}</code>
      ),
      pre: ({ children }) => (
        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto my-2 text-[12px]">{children}</pre>
      ),
      a: ({ href, children }) => (
        <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
      h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
      h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
      h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-600 my-2">{children}</blockquote>
      ),
      table: ({ children }) => (
        <div className="overflow-x-auto my-2 rounded-lg border border-blue-100 shadow-sm">
          <table className="min-w-full text-sm border-collapse">{children}</table>
        </div>
      ),
      thead: ({ children }) => <thead className="bg-blue-50">{children}</thead>,
      tbody: ({ children }) => <tbody>{children}</tbody>,
      tr: ({ children }) => <tr className="even:bg-slate-50">{children}</tr>,
      th: ({ children }) => (
        <th className="px-3 py-2 text-left font-semibold text-blue-800 border border-blue-100 whitespace-nowrap text-[11px]">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="px-3 py-2 text-gray-700 border border-gray-100 whitespace-nowrap text-[11px]">
          {children}
        </td>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

const SummaryCard: React.FC<{ summaryData: Record<string, any> }> = ({ summaryData }) => {
  const sd = summaryData || {};

  const findKey = (search: string) => Object.keys(sd).find((k) => k.toLowerCase() === search);
  const nameKey = findKey('name');
  const phoneKey = findKey('phone');

  const getValue = (val: any): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val.answer) return val.answer;
    return String(val);
  };

  const nameValue = nameKey ? getValue(sd[nameKey]) : null;
  const phoneValue = phoneKey ? getValue(sd[phoneKey]) : null;

  const INTERNAL_KEYS = new Set([
    'name', 'phone', 'answers', 'signal_breakdown', 'avg_signal_score',
    'total_questions', 'disqualified', 'sessionId', 's3_max_lead_output', 's3_lead_output', 's2_lead_output',
  ]);

  const isS3 = Array.isArray(sd.answers) && sd.lead_priority !== undefined;

  const remaining = Object.entries(sd).filter(([key]) => {
    const lower = key.toLowerCase();
    if (isS3) return !INTERNAL_KEYS.has(key) && lower !== 'name' && lower !== 'phone';
    return lower !== 'name' && lower !== 'phone' && key !== 'sessionId' && !key.startsWith('q0')
      && key !== 's3_max_lead_output' && key !== 's3_lead_output' && key !== 's2_lead_output';
  });

  const getIcon = (key: string, label: string) => {
    const lk = key.toLowerCase();
    const ll = label.toLowerCase();
    if (lk.includes('location') || ll.includes('address') || ll.includes('area'))
      return { icon: <MapPin className="w-3 h-3" />, bg: 'bg-red-50 text-red-500' };
    if (lk.includes('budget') || ll.includes('price'))
      return { icon: <DollarSign className="w-3 h-3" />, bg: 'bg-green-50 text-green-600' };
    if (lk.includes('type') || ll.includes('bhk') || ll.includes('property'))
      return { icon: <Home className="w-3 h-3" />, bg: 'bg-blue-50 text-blue-500' };
    if (lk.includes('move') || ll.includes('timeline') || ll.includes('date'))
      return { icon: <Calendar className="w-3 h-3" />, bg: 'bg-purple-50 text-purple-500' };
    if (lk.includes('financ') || ll.includes('loan'))
      return { icon: <CreditCard className="w-3 h-3" />, bg: 'bg-yellow-50 text-yellow-600' };
    return { icon: <Check className="w-3 h-3" />, bg: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className="mt-2 w-full bg-white rounded-xl p-4 shadow-md border border-gray-100 animate-fade-in-up">
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-2 flex items-center justify-between">
        <span>Lead Qualification Summary</span>
        <span className="bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded-full">Completed</span>
      </h3>

      {(nameValue || phoneValue) && (
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-dashed border-gray-200">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <User size={20} />
          </div>
          <div>
            {nameValue && <h4 className="text-sm font-bold text-gray-900">{nameValue}</h4>}
            {phoneValue && <div className="text-xs text-gray-500 mt-0.5">{phoneValue}</div>}
          </div>
        </div>
      )}

      {isS3 && Array.isArray(sd.answers) && sd.answers.length > 0 && (
        <div className="grid grid-cols-1 gap-3 text-sm">
          {sd.answers.map((ans: any, i: number) => {
            if (!ans || typeof ans !== 'object') return null;
            const question = typeof ans.question === 'string' ? ans.question : `Question ${i + 1}`;
            const answer = typeof ans.answer === 'string' ? ans.answer : String(ans.answer || '—');
            return (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-0.5 p-1 rounded bg-gray-100 text-gray-600 flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="block text-[11px] text-gray-500 font-medium">{question}</span>
                  <span className="font-semibold text-gray-800 text-sm">{answer}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isS3 && (
        <div className="grid grid-cols-1 gap-3">
          {remaining.map(([key, value]) => {
            const valueObj = value as { label?: string; answer?: string } | null;
            let label: string;
            let displayValue: string;

            if (typeof value === 'object' && value !== null && valueObj?.label && valueObj?.answer !== undefined) {
              label = valueObj.label;
              displayValue = valueObj.answer || 'Not provided';
            } else {
              label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
              displayValue = typeof value === 'string' ? value : String(value || 'Not provided');
            }

            const { icon, bg } = getIcon(key, label);

            return (
              <div key={key} className="flex items-start gap-2">
                <div className={`mt-0.5 p-1 rounded flex-shrink-0 ${bg}`}>{icon}</div>
                <div className="overflow-hidden">
                  <span className="block text-[11px] text-gray-500 font-medium">{label}</span>
                  <span className="font-semibold text-gray-800 text-sm truncate block" title={displayValue}>
                    {displayValue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  botAvatar,
  botName,
  primaryColor = '#4F46E5',
  allowFeedback,
  onFeedback,
}) => {
  const isBot = message.role === MessageRole.Bot;

  return (
    <div className={`flex w-full mb-3 animate-fade-in-up ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex gap-2.5 max-w-[90%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>

        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm mt-0 overflow-hidden
            ${isBot ? 'bg-white border border-gray-100' : 'bg-gray-900 border border-gray-700'}`}
        >
          {isBot ? (
            <img
              src={botAvatar || 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png'}
              alt={botName || 'Bot'}
              className="w-4 h-4 object-contain"
            />
          ) : (
            <User size={14} className="text-white" />
          )}
        </div>

        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
          {/* Sender label */}
          <span className="text-[10px] text-gray-400 mb-1 px-1">
            {isBot ? botName || 'AI Assistant' : 'You'}
          </span>

          {/* Message bubble */}
          {message.isStreaming ? (
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 px-1 py-1">
              <TypingIndicator />
            </div>
          ) : isBot && message.showActions ? (
            // Summary message with special styling
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📋</span>
                <h4 className="font-semibold text-blue-900 text-sm">Your Information Summary</h4>
              </div>
              <div className="qbot-prose text-sm text-gray-800">
                <MarkdownContent content={message.text} />
              </div>
            </div>
          ) : (
            <div
              className={`
                px-4 py-2.5 text-sm leading-relaxed break-words relative w-fit
                ${isBot
                  ? message.isSoftDQ
                    ? 'bg-amber-50/90 text-gray-800 rounded-2xl rounded-bl-md border border-amber-200/50 shadow-sm'
                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                  : 'text-white rounded-2xl rounded-br-md shadow-md'
                }
              `}
              style={!isBot ? { backgroundColor: primaryColor } : undefined}
            >
              {isBot ? (
                <MarkdownContent content={message.text} />
              ) : (
                <span className="whitespace-pre-wrap">{message.text}</span>
              )}
            </div>
          )}

          {/* Soft-DQ Banner */}
          {isBot && message.isSoftDQ && (
            <div className="mt-1.5 flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 max-w-xs">
              <Info size={12} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-[11px] text-amber-700">
                Based on your needs, we'll follow up when the timing is right.
              </span>
            </div>
          )}

          {/* Summary Card */}
          {isBot && message.isSummary && message.summaryData && (
            <SummaryCard summaryData={message.summaryData} />
          )}

          {/* Sources */}
          {isBot && message.sources && message.sources.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {message.sources.map((src, i) => (
                <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {src}
                </span>
              ))}
            </div>
          )}

          {/* Feedback */}
          {isBot && !message.isStreaming && allowFeedback && onFeedback && (
            <div className="flex gap-1.5 mt-1.5 ml-1 animate-fade-in">
              <button
                onClick={() => onFeedback(message.id, 'up')}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                  message.feedback === 'up' ? 'text-green-600 bg-green-50' : 'text-gray-300'
                }`}
                title="Helpful"
              >
                <ThumbsUp size={12} className={message.feedback === 'up' ? 'fill-current' : ''} />
              </button>
              <button
                onClick={() => onFeedback(message.id, 'down')}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                  message.feedback === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-300'
                }`}
                title="Not helpful"
              >
                <ThumbsDown size={12} className={message.feedback === 'down' ? 'fill-current' : ''} />
              </button>
              <span className="text-[9px] text-gray-300 self-center">Helpful?</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
