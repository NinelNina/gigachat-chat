import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Chat, ChatAction, ChatState, Message } from '../../types';
import { loadChatsFromStorage, saveChatsToStorage } from '../../utils/storage';

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  isLoading: false,
  error: null,
  searchQuery: '',
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  let newState: ChatState;

  switch (action.type) {
    case 'SET_CHATS':
      newState = { ...state, chats: action.payload };
      break;
    case 'SET_ACTIVE_CHAT':
      newState = { ...state, activeChatId: action.payload };
      break;
    case 'ADD_CHAT':
      newState = { 
        ...state, 
        chats: [action.payload, ...state.chats],
        activeChatId: action.payload.id 
      };
      break;
    case 'UPDATE_CHAT':
      newState = {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.id ? { ...chat, ...action.payload } : chat
        ),
      };
      break;
    case 'DELETE_CHAT':
      newState = {
        ...state,
        chats: state.chats.filter(chat => chat.id !== action.payload),
        activeChatId: state.activeChatId === action.payload ? null : state.activeChatId,
      };
      break;
    case 'ADD_MESSAGE':
      newState = {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                messages: [...chat.messages, action.payload.message],
                lastMessage: action.payload.message.content,
                lastMessageTime: action.payload.message.timestamp,
              }
            : chat
        ),
      };
      break;
    case 'UPDATE_LAST_MESSAGE':
      newState = {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg, i) => 
                  i === chat.messages.length - 1 ? action.payload.message : msg
                ),
                lastMessage: action.payload.message.content,
                lastMessageTime: action.payload.message.timestamp,
              }
            : chat
        ),
      };
      break;
    case 'SET_LOADING':
      newState = { ...state, isLoading: action.payload };
      break;
    case 'SET_ERROR':
      newState = { ...state, error: action.payload };
      break;
    case 'SET_SEARCH_QUERY':
      newState = { ...state, searchQuery: action.payload };
      break;
    default:
      return state;
  }

  // Persist chats whenever they change
  if (action.type !== 'SET_SEARCH_QUERY' && action.type !== 'SET_LOADING' && action.type !== 'SET_ERROR' && action.type !== 'SET_ACTIVE_CHAT') {
    saveChatsToStorage(newState.chats);
  }
  
  return newState;
};

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
