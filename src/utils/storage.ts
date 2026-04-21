import type { Chat } from '../types';

const STORAGE_KEY = 'gemini_chat_history';

export const saveChatsToStorage = (chats: Chat[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Failed to save chats to localStorage:', error);
  }
};

export const loadChatsFromStorage = (): Chat[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load chats from localStorage:', error);
    return [];
  }
};

export const saveThemeToStorage = (theme: 'light' | 'dark') => {
  localStorage.setItem('theme', theme);
};

export const loadThemeFromStorage = (): 'light' | 'dark' | null => {
  return localStorage.getItem('theme') as 'light' | 'dark' | null;
};
