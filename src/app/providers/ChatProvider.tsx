import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Chat, ChatAction, ChatState, Message } from '../../types';
import { loadChatsFromStorage } from '../../utils/storage';
import { chatReducer, initialState } from '../../store/ChatReducer';

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    const savedChats = loadChatsFromStorage();
    if (savedChats.length > 0) {
      dispatch({ type: 'SET_CHATS', payload: savedChats });
    }
  }, []);

  return (
      <ChatContext.Provider value={{ state, dispatch }}>
        {children}
      </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
