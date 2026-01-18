'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Language } from '../lib/types';
import esTranslations from './translations/es.json';
import enTranslations from './translations/en.json';

type Translations = typeof esTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
  translations: Translations;
}

const translations: Record<Language, Translations> = {
  es: esTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'es' }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const t = useCallback((path: string): string => {
    const keys = path.split('.');
    let result: unknown = translations[language];
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = (result as Record<string, unknown>)[key];
      } else {
        return path; // Return the path if translation not found
      }
    }
    
    return typeof result === 'string' ? result : path;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    translations: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { LanguageContext };
