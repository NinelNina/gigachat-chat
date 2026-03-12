import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import type {Settings} from '../../types';

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
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold dark:text-white">Настройки</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Model Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-white">
                            Модель
                        </label>
                        <select
                            value={localSettings.model}
                            onChange={(e) => handleChange('model', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                        >
                            <option value="GigaChat">GigaChat</option>
                            <option value="GigaChat-Plus">GigaChat-Plus</option>
                            <option value="GigaChat-Pro">GigaChat-Pro</option>
                            <option value="GigaChat-Max">GigaChat-Max</option>
                        </select>
                    </div>

                    {/* Temperature */}
                    <Slider
                        label="Temperature"
                        value={localSettings.temperature}
                        onChange={(value) => handleChange('temperature', value)}
                        min={0}
                        max={2}
                        step={0.1}
                    />

                    {/* Top-P */}
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
                        <label className="text-sm font-medium dark:text-white">
                            Max Tokens
                        </label>
                        <input
                            type="number"
                            value={localSettings.maxTokens}
                            onChange={(e) => handleChange('maxTokens', parseInt(e.target.value) || 0)}
                            min={1}
                            max={4000}
                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {/* System Prompt */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-white">
                            System Prompt
                        </label>
                        <textarea
                            value={localSettings.systemPrompt}
                            onChange={(e) => handleChange('systemPrompt', e.target.value)}
                            rows={4}
                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white resize-none"
                            placeholder="Введите системный промпт..."
                        />
                    </div>

                    {/* Theme Toggle */}
                    <Toggle
                        label="Тёмная тема"
                        checked={localSettings.theme === 'dark'}
                        onChange={(checked) => handleChange('theme', checked ? 'dark' : 'light')}
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-3">
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