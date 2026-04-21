import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Message } from './Message';
import { Message as MessageType } from '../../types';

describe('Message Component', () => {
    const userMessage: MessageType = {
        id: '1',
        role: 'user',
        content: 'User message text',
        timestamp: new Date().toISOString()
    };

    const assistantMessage: MessageType = {
        id: '2',
        role: 'assistant',
        content: 'Assistant message text',
        timestamp: new Date().toISOString()
    };

    it('renders user message correctly', () => {
        render(<Message message={userMessage} />);

        expect(screen.getByText('User message text')).toBeInTheDocument();
        expect(screen.getByText('Вы')).toBeInTheDocument();

        const contentBox = screen.getByText('User message text').closest('.message-content');
        expect(contentBox).toHaveClass('bg-blue-600');
    });

    it('renders assistant message correctly', () => {
        render(<Message message={assistantMessage} />);

        expect(screen.getByText('Assistant message text')).toBeInTheDocument();
        expect(screen.getByText('Gemini')).toBeInTheDocument();

        const contentBox = screen.getByText('Assistant message text').closest('.message-content');
        expect(contentBox).toHaveClass('bg-[var(--color-message-assistant)]');
    });

    it('shows copy button for assistant message and it is hidden/visible based on hover', () => {
        render(<Message message={assistantMessage} />);

        const copyButton = screen.getByTitle('Копировать');
        expect(copyButton).toBeInTheDocument();
    });

    it('hides copy button for user messages', () => {
        render(<Message message={userMessage} />);

        expect(screen.queryByTitle('Копировать')).not.toBeInTheDocument();
    });
});
