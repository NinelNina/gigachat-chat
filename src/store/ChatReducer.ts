import { ChatAction, ChatState } from '../types';
import { saveChatsToStorage } from '../utils/storage';

export const initialState: ChatState = {
    chats: [],
    activeChatId: null,
    isLoading: false,
    error: null,
    searchQuery: '',
};

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
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

    if (action.type !== 'SET_SEARCH_QUERY' && action.type !== 'SET_LOADING' && action.type !== 'SET_ERROR' && action.type !== 'SET_ACTIVE_CHAT') {
        saveChatsToStorage(newState.chats);
    }

    return newState;
};
