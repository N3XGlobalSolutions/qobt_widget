// ============================================================
// ActionButtons Component
// ============================================================
// "Schedule a call" / "Maybe later" action buttons
// that appear after the bot shows the summary message.
// ============================================================

import React from 'react';
import { CalendarDays, Clock } from 'lucide-react';

interface ActionButtonsProps {
  onSchedule: () => void;
  onLater: () => void;
  primaryColor?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSchedule, onLater, primaryColor = '#4F46E5' }) => {
  return (
    <div className="flex gap-2 justify-end mb-3 animate-fade-in-up w-full">
      <button
        onClick={onSchedule}
        className="flex-1 flex items-center justify-center gap-2 text-white font-medium py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <CalendarDays size={15} />
        Schedule a call
      </button>
      <button
        onClick={onLater}
        className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-sm"
      >
        <Clock size={15} />
        Maybe later
      </button>
    </div>
  );
};

export default ActionButtons;
