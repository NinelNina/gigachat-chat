import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatReducer, initialState } from './ChatReducer';
import { Chat, Message } from '../types';

vi.mock('../utils/storage', () => ({
    saveChatsToStorage: vi.fn(),
    loadChatsFromStorage: vi.fn(() => []),
}));

describe('chatReducer', () => {
    it('ADD_CHAT: should add a new chat and set it as active', () => {
        const newChat: Chat = {
            id: 'chat-1',
            title: 'New Chat',
            messages: [],
            lastMessage: '',
            lastMessageTime: '',
        };

        const action = { type: 'ADD_CHAT' as const, payload: newChat };
        const nextState = chatReducer(initialState, action);

        expect(nextState.chats).toHaveLength(1);
        expect(nextState.chats[0]).toEqual(newChat);
        expect(nextState.activeChatId).toBe('chat-1');
    });

    it('ADD_MESSAGE: should add a message to the specified chat', () => {
        const existingChat: Chat = {
            id: 'chat-1',
            title: 'Test Chat',
            messages: [],
            lastMessage: '',
            lastMessageTime: '',
        };

        const stateWithChat = { ...initialState, chats: [existingChat] };
        const newMessage: Message = {
            id: 'msg-1',
            content: 'Hello World',
            role: 'user',
            timestamp: new Date().toISOString(),
        };

        const action = {
            type: 'ADD_MESSAGE' as const,
            payload: { chatId: 'chat-1', message: newMessage }
        };

        const nextState = chatReducer(stateWithChat, action);

        const updatedChat = nextState.chats.find(c => c.id === 'chat-1');
        expect(updatedChat?.messages).toHaveLength(1);
        expect(updatedChat?.messages[0]).toEqual(newMessage);
        expect(updatedChat?.lastMessage).toBe(newMessage.content);
    });

    it('DELETE_CHAT: should remove the chat and reset activeChatId if it was the active one', () => {
        const chatToDelete: Chat = {
            id: 'chat-1',
            title: 'Deletable',
            messages: [],
            lastMessage: '',
            lastMessageTime: '',
        };

        const state = { ...initialState, chats: [chatToDelete], activeChatId: 'chat-1' };
        const action = { type: 'DELETE_CHAT' as const, payload: 'chat-1' };

        const nextState = chatReducer(state, action);

        expect(nextState.chats).toHaveLength(0);
        expect(nextState.activeChatId).toBeNull();
    });

    it('UPDATE_CHAT: should update chat properties (e.g., rename title)', () => {
        const chat: Chat = {
            id: 'chat-1',
            title: 'Old Title',
            messages: [],
            lastMessage: '',
            lastMessageTime: '',
        };

        const state = { ...initialState, chats: [chat] };
        const action = {
            type: 'UPDATE_CHAT' as const,
            payload: { id: 'chat-1', title: 'New Title' }
        };

        const nextState = chatReducer(state, action);

        const updatedChat = nextState.chats.find(c => c.id === 'chat-1');
        expect(updatedChat?.title).toBe('New Title');
    });
});
