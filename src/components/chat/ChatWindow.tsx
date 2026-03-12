import React from 'react';
import { Settings, Menu, /*Moon, Sun*/ } from 'lucide-react';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import type { Message as MessageType } from '../../types';

interface ChatWindowProps {
    chatTitle: string;
    messages: MessageType[];
    isTyping?: boolean;
    isGenerating?: boolean;
    onSendMessage: (message: string) => void;
    onStopGeneration?: () => void;
    onOpenSettings: () => void;
    onToggleSidebar?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
                                                          chatTitle,
                                                          messages,
                                                          isTyping = false,
                                                          isGenerating = false,
                                                          onSendMessage,
                                                          onStopGeneration,
                                                          onOpenSettings,
                                                          onToggleSidebar,
                                                      }) => {

    // Состояние для темы (можно вынести в контекст или глобальное состояние)
    const [isDark, setIsDark] = React.useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <main className="flex-1 flex flex-col h-screen bg-[var(--color-chat-bg)]">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-sidebar-bg)]/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 hover:bg-[var(--color-hover)] rounded-xl transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={20} className="text-[var(--color-text-secondary)]" />
                    </button>

                    <div>
                        <h2 className="text-lg font-semibold text-[var(--color-text)] truncate">
                            {chatTitle}
                        </h2>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            {messages.length} {messages.length === 1 ? 'сообщение' :
                            messages.length >= 2 && messages.length <= 4 ? 'сообщения' : 'сообщений'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Кнопка переключения темы */}
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2.5 hover:bg-[var(--color-hover)] rounded-xl transition-colors"
                        title={isDark ? 'Светлая тема' : 'Тёмная тема'}
                    >
                        {/*{isDark ? (*/}
                        {/*    <Sun size={20} className="text-[var(--color-text-secondary)]" />*/}
                        {/*) : (*/}
                        {/*    <Moon size={20} className="text-[var(--color-text-secondary)]" />*/}
                        {/*)}*/}
                    </button>

                    {/* Кнопка настроек */}
                    <button
                        onClick={onOpenSettings}
                        className="p-2.5 hover:bg-[var(--color-hover)] rounded-xl transition-colors"
                        title="Настройки"
                    >
                        <Settings size={20} className="text-[var(--color-text-secondary)]" />
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full py-8 px-4 md:px-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                                <span className="text-3xl text-white">💬</span>
                            </div>
                            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                                Начните разговор
                            </h3>
                            <p className="text-[var(--color-text-muted)] max-w-md">
                                Задайте вопрос или напишите сообщение, чтобы начать общение с GigaChat
                            </p>
                        </div>
                    ) : (
                        <MessageList
                            messages={messages}
                            isTyping={isTyping}
                        />
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-[var(--color-border)] bg-[var(--color-sidebar-bg)]/50 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto w-full">
                    <InputArea
                        onSendMessage={onSendMessage}
                        onStopGeneration={onStopGeneration}
                        isGenerating={isGenerating}
                    />
                </div>
            </div>
        </main>
    );
};