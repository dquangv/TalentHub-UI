import { createContext, useContext, useState, ReactNode } from 'react';
import { TranslationType } from '../locales/types';

// Import language files
import { vi } from '../locales/vi';
import { en } from '../locales/en';
import { ko } from '../locales/ko';
import { ja } from '../locales/ja';
import { zhcn } from '../locales/zhcn';

type Language = 'vi' | 'en' | 'ko' | 'ja' | 'zhcn';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof TranslationType) => string;
}

const translations: Record<Language, TranslationType> = {
    vi,
    en,
    ko,
    ja,
    zhcn,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('language') as Language;
            return savedLanguage || 'vi';
        }
        return 'vi';
    });

    const handleSetLanguage = (newLanguage: Language) => {
        setLanguage(newLanguage);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', newLanguage);
        }
    };

    const t = (key: keyof TranslationType): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}