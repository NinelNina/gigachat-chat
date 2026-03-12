import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
//import { AuthForm } from './components/auth/AuthForm';
import { mockChats, mockMessages, defaultSettings } from './mocks/data';
import type {Chat, Message, Settings, /*AuthCredentials*/} from './types';

function App() {
    // Auth state
    //const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Chat state
    const [chats, setChats] = useState<Chat[]>(mockChats);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [activeChatId, setActiveChatId] = useState<string | null>('1');
    const [searchQuery, setSearchQuery] = useState('');

    // UI state
    const [isTyping, setIsTyping] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Settings state
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    // Filter chats by search
    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Auth handlers
    // const handleLogin = (credentials: AuthCredentials) => {
    //     console.log('Login with:', credentials);
    //     setIsAuthenticated(true);
    // };

    // Chat handlers
    const handleNewChat = () => {
        const newChat: Chat = {
            id: Date.now().toString(),
            title: 'Новый чат',
            lastMessage: '',
            lastMessageTime: new Date(),
            isActive: true,
        };
        setChats([newChat, ...chats]);
        setActiveChatId(newChat.id);
        setMessages([]);
    };

    const handleSelectChat = (id: string) => {
        setActiveChatId(id);
        setIsSidebarOpen(false);
        // In real app, load messages for this chat
    };

    const handleSendMessage = (content: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            content,
            role: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsGenerating(true);
        setIsTyping(true);

        // Mock AI response after delay
        setTimeout(() => {
            setIsTyping(false);

            setTimeout(() => {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: 'Это моковый ответ от GigaChat. В реальной версии здесь будет ответ от API.',
                    role: 'assistant',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, aiMessage]);
                setIsGenerating(false);
            }, 1000);
        }, 1500);
    };

    const handleStopGeneration = () => {
        setIsGenerating(false);
        setIsTyping(false);
    };

    // Settings handlers
    const handleSaveSettings = (newSettings: Settings) => {
        setSettings(newSettings);
    };

    const handleResetSettings = () => {
        setSettings(defaultSettings);
    };

    //TODO: форма авторизации
    // Show auth form if not authenticated
/*    if (!isAuthenticated) {
        return <AuthForm onLogin={handleLogin} />;
    }*/

    // Show main app
    return (
        <AppLayout
            chats={filteredChats}
            messages={messages}
            activeChatId={activeChatId}
            searchQuery={searchQuery}
            settings={settings}
            isTyping={isTyping}
            isGenerating={isGenerating}
            isSettingsOpen={isSettingsOpen}
            isSidebarOpen={isSidebarOpen}
            onNewChat={handleNewChat}
            onSearchChange={setSearchQuery}
            onSelectChat={handleSelectChat}
            onSendMessage={handleSendMessage}
            onStopGeneration={handleStopGeneration}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onCloseSettings={() => setIsSettingsOpen(false)}
            onSaveSettings={handleSaveSettings}
            onResetSettings={handleResetSettings}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
    );
}

export default App;