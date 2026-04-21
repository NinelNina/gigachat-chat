import React from 'react';
import { Plus, Bot, X } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { ChatList } from './ChatList';
import { Button } from '../ui/Button';
import { useChat } from '../../app/providers/ChatProvider';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useChat();
  const navigate = useNavigate();

  const filteredChats = state.chats.filter(chat => {
    const query = state.searchQuery.toLowerCase();
    return (
      chat.title.toLowerCase().includes(query) ||
      chat.lastMessage.toLowerCase().includes(query)
    );
  });

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'Новый чат',
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      messages: [],
    };
    dispatch({ type: 'ADD_CHAT', payload: newChat });
    navigate(`/chat/${newChat.id}`);
    onClose();
  };

  const handleSelectChat = (id: string) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: id });
    navigate(`/chat/${id}`);
    onClose();
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    dispatch({ type: 'UPDATE_CHAT', payload: { id, title: newTitle } });
  };

  const handleDeleteChat = (id: string) => {
    dispatch({ type: 'DELETE_CHAT', payload: id });
    if (state.activeChatId === id) {
      navigate('/');
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 
          w-72 sm:w-80 
          bg-[var(--color-sidebar-bg)]
          border-r border-[var(--color-border)]
          flex flex-col 
          transform transition-transform duration-300 ease-in-out
          shadow-xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 sm:p-5 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bot size={20} className="text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Gemini Chat
              </h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-[var(--color-hover)] rounded-lg text-[var(--color-text-secondary)]"
            >
              <X size={18} />
            </button>
          </div>

          <Button onClick={handleNewChat} className="w-full shadow-md py-2.5">
            <Plus size={18} />
            <span>Новый чат</span>
          </Button>
        </div>

        <div className="p-4 sm:p-5 border-b border-[var(--color-border)]">
          <SearchInput
            value={state.searchQuery}
            onChange={(val) => dispatch({ type: 'SET_SEARCH_QUERY', payload: val })}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <ChatList
            chats={filteredChats}
            activeChatId={state.activeChatId}
            onSelectChat={handleSelectChat}
            onRenameChat={handleRenameChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>
      </aside>
    </>
  );
};
