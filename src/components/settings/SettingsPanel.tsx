import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import type { Settings } from '../../types';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onSave: (settings: Settings) => void;
    onReset: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                settings,
                                                                onSave,
                                                                onReset,
                                                            }) => {
    const [localSettings, setLocalSettings] = useState<Settings>(settings);

    // Sync with parent settings when panel opens
    React.useEffect(() => {
        setLocalSettings(settings);
    }, [settings, isOpen]);

    if (!isOpen) return null;

    const handleChange = <K extends keyof Settings>(
        key: K,
        value: Settings[K]
    ) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(localSettings);
        onClose();
    };

    const handleReset = () => {
        onReset();
        setLocalSettings(settings);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-full w-96 bg-[var(--color-sidebar-bg)] border-l border-[var(--color-border)] shadow-2xl z-50 overflow-y-auto animate-slide-left">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-sidebar-bg)]/80 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-[var(--color-text)]">
                        Настройки
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-hover)] rounded-xl transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                        aria-label="Закрыть"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Model Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                            Модель
                        </label>
                        <select
                            value={localSettings.model}
                            onChange={(e) => handleChange('model', e.target.value)}
                            className="w-full p-2.5 border border-[var(--color-border)] rounded-xl bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition-colors"
                        >
                            <option value="GigaChat">GigaChat</option>
                            <option value="GigaChat-Plus">GigaChat-Plus</option>
                            <option value="GigaChat-Pro">GigaChat-Pro</option>
                            <option value="GigaChat-Max">GigaChat-Max</option>
                        </select>
                    </div>

                    {/* Temperature - используем компонент Slider */}
                    <Slider
                        label="Temperature"
                        value={localSettings.temperature}
                        onChange={(value) => handleChange('temperature', value)}
                        min={0}
                        max={2}
                        step={0.1}
                    />

                    {/* Top-P - используем компонент Slider */}
                    <Slider
                        label="Top-P"
                        value={localSettings.topP}
                        onChange={(value) => handleChange('topP', value)}
                        min={0}
                        max={1}
                        step={0.05}
                    />

                    {/* Max Tokens */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                            Max Tokens
                        </label>
                        <input
                            type="number"
                            value={localSettings.maxTokens}
                            onChange={(e) => handleChange('maxTokens', parseInt(e.target.value) || 0)}
                            min={1}
                            max={4000}
                            className="w-full p-2.5 border border-[var(--color-border)] rounded-xl bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition-colors"
                            placeholder="Введите количество токенов"
                        />
                    </div>

                    {/* System Prompt */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                            System Prompt
                        </label>
                        <textarea
                            value={localSettings.systemPrompt}
                            onChange={(e) => handleChange('systemPrompt', e.target.value)}
                            rows={4}
                            className="w-full p-2.5 border border-[var(--color-border)] rounded-xl bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 resize-none placeholder-[var(--color-text-muted)] transition-colors"
                            placeholder="Введите системный промпт..."
                        />
                    </div>

                    {/* Theme Toggle - используем компонент Toggle */}
                    <Toggle
                        label="Тёмная тема"
                        checked={localSettings.theme === 'dark'}
                        onChange={(checked) => handleChange('theme', checked ? 'dark' : 'light')}
                    />
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 p-5 border-t border-[var(--color-border)] bg-[var(--color-sidebar-bg)]/80 backdrop-blur-md flex gap-3">
                    <Button
                        onClick={handleReset}
                        variant="secondary"
                        className="flex-1"
                    >
                        Сбросить
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="primary"
                        className="flex-1"
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        </>
    );
};