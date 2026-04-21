import React, { useState } from 'react';
import { Key, Bot, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface AuthFormProps {
  onLogin: (apiKey: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    if (!apiKey.trim()) {
      setError('Пожалуйста, введите Gemini API Key');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(apiKey.trim());
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="w-full max-w-md bg-[var(--color-sidebar-bg)] rounded-2xl shadow-xl border border-[var(--color-border)] p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot size={32} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-[var(--color-text)]">
          Доступ к Gemini
        </h1>
        <p className="text-center text-[var(--color-text-muted)] mb-8">
          Введите ваш Gemini API Key для начала работы
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                API Key
              </label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-blue-500 hover:underline flex items-center gap-1"
              >
                Получить ключ <ShieldCheck size={10} />
              </a>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <Key size={18} />
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Вставьте ваш API ключ здесь..."
                className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-input-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-start gap-2">
               <span className="mt-0.5">⚠️</span>
               <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-3 h-12 shadow-lg shadow-blue-500/20"
            size="lg"
            isLoading={isSubmitting}
          >
            Войти в систему
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
          <p className="text-xs text-center text-[var(--color-text-muted)] leading-relaxed">
            Ваш ключ сохраняется только локально в браузере и используется исключительно для запросов к Google Gemini API.
          </p>
        </div>
      </div>
    </div>
  );
};
