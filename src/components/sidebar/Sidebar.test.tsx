import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { useChat } from '../../app/providers/ChatProvider';
import { useNavigate } from 'react-router-dom';

vi.mock('../../app/providers/ChatProvider');
vi.mock('react-router-dom');

describe('Sidebar Component', () => {
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();
    const mockOnClose = vi.fn();

    const mockChats = [
        { id: '1', title: 'React Learning', lastMessage: 'Hooks', lastMessageTime: '', messages: [] },
        { id: '2', title: 'Vitest Tips', lastMessage: 'Mocks', lastMessageTime: '', messages: [] }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useChat as any).mockReturnValue({
            state: {
                chats: mockChats,
                searchQuery: '',
                activeChatId: null,
            },
            dispatch: mockDispatch
        });
        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    it('filters chats based on search query', () => {
        (useChat as any).mockReturnValue({
            state: {
                chats: mockChats,
                searchQuery: 'React',
                activeChatId: null,
            },
            dispatch: mockDispatch
        });

        render(<Sidebar isOpen={true} onClose={mockOnClose} />);

        expect(screen.getByText('React Learning')).toBeInTheDocument();
        expect(screen.queryByText('Vitest Tips')).not.toBeInTheDocument();
    });

    it('shows all chats when search query is empty', () => {
        render(<Sidebar isOpen={true} onClose={mockOnClose} />);

        expect(screen.getByText('React Learning')).toBeInTheDocument();
        expect(screen.getByText('Vitest Tips')).toBeInTheDocument();
    });

    it('calls window.confirm when delete button is clicked and dispatches delete if confirmed', async () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

        render(<Sidebar isOpen={true} onClose={mockOnClose} />);

        const deleteButtons = screen.getAllByLabelText('Удалить');
        fireEvent.click(deleteButtons[0]);

        expect(confirmSpy).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_CHAT', payload: '1' });
    });
});
