import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputArea } from './InputArea';

describe('InputArea Component', () => {
    it('should call onSendMessage when the send button is clicked with non-empty input', async () => {
        const onSendMessage = vi.fn();
        const user = userEvent.setup();

        render(<InputArea onSendMessage={onSendMessage} />);

        const textarea = screen.getByPlaceholderText(/Спросите Gemini/i);
        const sendButton = screen.getByLabelText('Отправить');

        await user.type(textarea, 'Hello Gemini');
        await user.click(sendButton);

        expect(onSendMessage).toHaveBeenCalledWith('Hello Gemini', []);
    });

    it('should call onSendMessage when Enter is pressed (without Shift)', async () => {
        const onSendMessage = vi.fn();
        const user = userEvent.setup();

        render(<InputArea onSendMessage={onSendMessage} />);

        const textarea = screen.getByPlaceholderText(/Спросите Gemini/i);
        await user.type(textarea, 'Enter test{enter}');

        expect(onSendMessage).toHaveBeenCalledWith('Enter test', []);
    });

    it('should have the send button disabled when input is empty and no files attached', () => {
        const onSendMessage = vi.fn();
        render(<InputArea onSendMessage={onSendMessage} />);

        const sendBtn = screen.getByLabelText('Отправить');
        expect(sendBtn).toBeDisabled();
    });
});
