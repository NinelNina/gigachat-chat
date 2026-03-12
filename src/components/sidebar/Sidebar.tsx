import React from 'react';
import {Plus, Menu, Bot} from 'lucide-react';
import { SearchInput } from './SearchInput';
import { ChatList } from './ChatList';
import type {Chat} from '../../types';
import { Button } from '../ui/Button';

interface SidebarProps {
    chats: Chat[];
    activeChatId: string | null;
    searchQuery: string;
    onNewChat: () => void;
    onSearchChange: (query: string) => void;
    onSelectChat: (id: string) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    chats,
                                                    activeChatId,
                                                    searchQuery,
                                                    onNewChat,
                                                    onSearchChange,
                                                    onSelectChat,
                                                    isOpen = true,
                                                    onClose,
                                                }) => {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
        fixed lg:static inset-y-0 left-0 z-50 
        w-80 
        bg-[var(--color-sidebar-bg)]
        border-r border-[var(--color-border)]
        flex flex-col 
        transform transition-transform duration-300 
        shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}
            >
                {/* Header */}
                <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-sidebar-bg)]/50 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Bot size={24} className="text-white" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                GigaChat
                            </h1>
                        </div>

                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 hover:bg-[var(--color-hover)] rounded-xl text-[var(--color-text-secondary)]"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="mt-5">
                        <Button
                            onClick={onNewChat}
                            className="w-full shadow-lg hover:shadow-xl transition-shadow"
                            /*style={{
                                backgroundColor: 'var(--color-accent)',
                                color: 'white'
                            }}*/
                        >
                            <Plus size={20} />
                            Новый чат
                        </Button>
                    </div>
                </div>

                {/* Search */}
                <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)]">
                    <SearchInput
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder="Поиск чатов..."
                    />
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto p-3">
                    <ChatList
                        chats={chats}
                        activeChatId={activeChatId}
                        onSelectChat={onSelectChat}
                    />
                </div>
            </aside>
        </>
    );
};