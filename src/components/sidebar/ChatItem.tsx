import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { Chat } from '../../types';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onClick,
  onRename,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newTitle.trim() && newTitle !== chat.title) {
      onRename(chat.id, newTitle);
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewTitle(chat.title);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить этот чат?')) {
      onDelete(chat.id);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      onClick={isEditing ? undefined : onClick}
      className={`group relative p-3 mb-1 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'hover:bg-[var(--color-hover)] text-[var(--color-text)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <input
                autoFocus
                className="w-full bg-white dark:bg-gray-800 text-black dark:text-white px-2 py-0.5 rounded text-sm outline-none"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (newTitle.trim() && newTitle !== chat.title) {
                      onRename(chat.id, newTitle);
                    }
                    setIsEditing(false);
                  } else if (e.key === 'Escape') {
                    setNewTitle(chat.title);
                    setIsEditing(false);
                  }
                }}
              />
              <button onClick={handleRename} className="p-1 hover:bg-black/10 rounded">
                <Check size={14} />
              </button>
              <button onClick={handleCancel} className="p-1 hover:bg-black/10 rounded">
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <h3 className={`font-medium text-sm truncate ${isActive ? 'text-white' : ''}`}>
                {chat.title}
              </h3>
              <p className={`text-xs truncate mt-0.5 opacity-70`}>
                {chat.lastMessage || 'Нет сообщений'}
              </p>
              <p className="text-[10px] mt-1 opacity-50 uppercase font-bold tracking-wider">
                {formatDate(chat.lastMessageTime)}
              </p>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isActive ? 'hover:bg-blue-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500'
              }`}
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={handleDelete}
              className={`p-1.5 rounded-lg transition-colors ${
                isActive ? 'hover:bg-blue-700 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500'
              }`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
