import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import type {AuthCredentials} from '../../types';

interface AuthFormProps {
    onLogin: (credentials: AuthCredentials) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
    const [credentials, setCredentials] = useState('');
    const [scope, setScope] = useState<AuthCredentials['scope']>('GIGACHAT_API_PERS');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!credentials.trim()) {
            setError('Пожалуйста, введите credentials');
            return;
        }

        // Basic Base64 validation
        try {
            atob(credentials.trim());
        } catch {
            setError('Неверный формат Base64');
            return;
        }

        setIsLoading(true);

        // Mock login (in real app, this would validate with API)
        setTimeout(() => {
            onLogin({ credentials: credentials.trim(), scope });
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <Lock size={32} className="text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-center mb-2 dark:text-white">
                    Авторизация
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                    Введите credentials для доступа к GigaChat API
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Credentials Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-white">
                            Credentials (Base64)
                        </label>
                        <input
                            type="password"
                            value={credentials}
                            onChange={(e) => setCredentials(e.target.value)}
                            placeholder="Введите Base64 строку..."
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Scope Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium dark:text-white">
                            Scope
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: 'GIGACHAT_API_PERS', label: 'Персональный (GIGACHAT_API_PERS)' },
                                { value: 'GIGACHAT_API_B2B', label: 'B2B (GIGACHAT_API_B2B)' },
                                { value: 'GIGACHAT_API_CORP', label: 'Корпоративный (GIGACHAT_API_CORP)' },
                            ].map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <input
                                        type="radio"
                                        name="scope"
                                        value={option.value}
                                        checked={scope === option.value}
                                        onChange={(e) => setScope(e.target.value as AuthCredentials['scope'])}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <ErrorMessage message={error} />}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
                    Получите credentials в личном кабинете SberDevices
                </p>
            </div>
        </div>
    );
};