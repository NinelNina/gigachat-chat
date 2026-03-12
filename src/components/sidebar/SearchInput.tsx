import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
                                                            value,
                                                            onChange,
                                                            placeholder = 'Поиск чатов...',
                                                        }) => {
    return (
        <div className="relative">
            <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]"
                size={18}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 text-[var(--color-text)] placeholder-[var(--color-text-muted)] transition-colors"
            />
        </div>
    );
};