// ============================================================
// QuickReplies Component
// ============================================================
// Horizontally scrollable quick reply buttons.
// Adapted from the main frontend QuickReplies.
// ============================================================

import React from 'react';

interface QuickRepliesProps {
  options: string[];
  onSelect: (option: string) => void;
  primaryColor?: string;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({
  options,
  onSelect,
  primaryColor = '#4F46E5',
}) => {
  if (!options || options.length === 0) return null;

  const hexToRgb = (hex: string): string => {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    try {
      const num = parseInt(h, 16);
      return `${num >> 16}, ${(num >> 8) & 255}, ${num & 255}`;
    } catch {
      return '79, 70, 229';
    }
  };

  const rgb = hexToRgb(primaryColor);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 mb-1 px-1 -mx-1">
      <div className="flex gap-2 whitespace-nowrap px-1">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option)}
            className="
              px-4 py-2 border rounded-full text-[13px] font-medium
              shadow-sm hover:shadow-md
              transition-all duration-200 ease-out
              animate-fade-in-up flex-shrink-0
            "
            style={{
              animationDelay: `${index * 50}ms`,
              color: primaryColor,
              backgroundColor: `rgba(${rgb}, 0.08)`,
              borderColor: `rgba(${rgb}, 0.2)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = primaryColor;
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `rgba(${rgb}, 0.08)`;
              e.currentTarget.style.color = primaryColor;
              e.currentTarget.style.borderColor = `rgba(${rgb}, 0.2)`;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;
