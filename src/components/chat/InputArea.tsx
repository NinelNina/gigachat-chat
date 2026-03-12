import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip } from 'lucide-react';
import { Button } from '../ui/Button';

interface InputAreaProps {
    onSendMessage: (message: string) => void;
    onStopGeneration?: () => void;
    isGenerating?: boolean;
    disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
                                                        onSendMessage,
                                                        onStopGeneration,
                                                        isGenerating = false,
                                                        disabled = false,
                                                    }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [input]);

    const handleSubmit = () => {
        if (input.trim() && !disabled && !isGenerating) {
            onSendMessage(input.trim());
            setInput('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="border-t border-[var(--color-border)] p-6 bg-[var(--color-sidebar-bg)]">
            <div className="max-w-4xl mx-auto">
                <div className="relative flex items-end gap-3 bg-[var(--color-input-bg)] rounded-2xl p-3 shadow-lg border border-[var(--color-border)]">
                    {/* Attach Button */}
                    <button
                        className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Прикрепить файл"
                        disabled={disabled || isGenerating}
                    >
                        <Paperclip size={20} />
                    </button>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Введите сообщение..."
                        disabled={disabled || isGenerating}
                        rows={1}
                        className="flex-1 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none text-[var(--color-text)] placeholder-[var(--color-text-muted)] py-3 px-2 max-h-[150px] text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ minHeight: '44px' }}
                    />

                    {/* Send/Stop Button */}
                    {isGenerating ? (
                        <Button
                            onClick={onStopGeneration}
                            variant="danger"
                            className="flex-shrink-0 px-5 bg-red-500 hover:bg-red-600 text-white border-0"
                        >
                            <Square size={16} className="mr-2" />
                            Стоп
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!input.trim() || disabled}
                            className="flex-shrink-0 px-5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} className="mr-2" />
                            Отправить
                        </Button>
                    )}
                </div>

                {/* Подсказка с клавишами */}
                <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)] mt-3">
                    <span>Нажмите</span>
                    <kbd className="px-2 py-1 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-secondary)] font-mono text-xs">
                        Enter
                    </kbd>
                    <span>для отправки,</span>
                    <kbd className="px-2 py-1 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-secondary)] font-mono text-xs">
                        Shift+Enter
                    </kbd>
                    <span>для новой строки</span>
                </div>
            </div>
        </div>
    );
};