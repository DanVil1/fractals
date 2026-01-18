'use client';

import React from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { useLanguage } from '../../i18n';
import type { Language } from '../../lib/types';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme, onGoHome }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <header className={`h-16 flex items-center justify-between px-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
      <div className="flex items-center gap-2 cursor-pointer" onClick={onGoHome}>
        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">F</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          Fractal<span className="opacity-50">Gallery</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleLanguage} 
          className="p-2 rounded-full hover:bg-slate-700/20 transition-colors flex items-center gap-1"
          title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <Globe size={20} />
          <span className="text-sm font-medium uppercase">{language}</span>
        </button>
        <button 
          onClick={onToggleTheme} 
          className="p-2 rounded-full hover:bg-slate-700/20 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
