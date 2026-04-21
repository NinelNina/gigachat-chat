import React, { useEffect, useRef } from 'react';
import { Message as MessageType } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { Bot } from 'lucide-react';

interface MessageListProps {
  messages: MessageType[];
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const isAssistantResponding = messages.length > 0 && messages[messages.length - 1].role === 'assistant';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <Bot size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
              Добро пожаловать в Gemini Chat!
            </h3>
            <p className="text-[var(--color-text-muted)] max-w-md">
              Спросите меня о чем угодно. Я использую современную языковую модель Gemini для ответов на ваши вопросы.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isLoading && !isAssistantResponding && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
