import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveChatsToStorage, loadChatsFromStorage } from './storage';
import { Chat } from '../types';

describe('storage utility', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('saveChatsToStorage: should save chats to localStorage', () => {
        const chats: Chat[] = [{
            id: '1',
            title: 'Test',
            messages: [],
            lastMessage: '',
            lastMessageTime: ''
        }];

        saveChatsToStorage(chats);

        const savedData = localStorage.getItem('gemini_chat_history');
        expect(savedData).toBe(JSON.stringify(chats));
    });

    it('loadChatsFromStorage: should return chats from localStorage', () => {
        const chats: Chat[] = [{
            id: '1',
            title: 'Test',
            messages: [],
            lastMessage: '',
            lastMessageTime: ''
        }];
        localStorage.setItem('gemini_chat_history', JSON.stringify(chats));

        const loadedChats = loadChatsFromStorage();
        expect(loadedChats).toEqual(chats);
    });

    it('loadChatsFromStorage: should return empty array for invalid JSON', () => {
        localStorage.setItem('gemini_chat_history', 'invalid-json');

        // Silence console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const loadedChats = loadChatsFromStorage();

        expect(loadedChats).toEqual([]);
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('loadChatsFromStorage: should return empty array if no data exists', () => {
        const loadedChats = loadChatsFromStorage();
        expect(loadedChats).toEqual([]);
    });
});
