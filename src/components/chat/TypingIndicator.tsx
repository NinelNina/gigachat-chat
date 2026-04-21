import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4 px-4 py-4 sm:py-6">
      <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
        <Bot size={16} className="text-white" />
      </div>

      <div className="flex-1">
        <span className="text-xs font-medium text-[var(--color-text-secondary)] mb-1 block">
          Gemini
        </span>

        <div className="inline-block bg-[var(--color-message-assistant)] border border-[var(--color-border)] rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
