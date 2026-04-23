/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { SettingsPanel } from '../settings/SettingsPanel';
import { useChat } from '../../app/providers/ChatProvider';
import { Settings } from '../../types';
import { saveThemeToStorage, loadThemeFromStorage, saveSettingsToStorage, loadSettingsFromStorage } from '../../utils/storage';

const DEFAULT_SETTINGS: Settings = {
    model: 'gemini-3-flash-preview',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2000,
    systemPrompt: 'Вы — полезный ассистент.',
    theme: 'light',
};

interface AppLayoutProps {
    apiKey: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ apiKey }) => {
    const { state, dispatch } = useChat();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<Settings>(() => {
        const savedSettings = loadSettingsFromStorage();
        const savedTheme = loadThemeFromStorage();

        if (savedSettings) {
            return { ...DEFAULT_SETTINGS, ...savedSettings, theme: savedTheme || savedSettings.theme || DEFAULT_SETTINGS.theme };
        }
        return { ...DEFAULT_SETTINGS, theme: savedTheme || DEFAULT_SETTINGS.theme };
    });

    useEffect(() => {
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        saveThemeToStorage(settings.theme);
        saveSettingsToStorage(settings);
    }, [settings]);

    const handleSaveSettings = (newSettings: Settings) => {
        setSettings(newSettings);
    };

    const handleResetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    return (
        <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <ChatWindow
                apiKey={apiKey}
                settings={settings}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
            />

            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onSave={handleSaveSettings}
                onReset={handleResetSettings}
            />
        </div>
    );
};
