'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../i18n';

interface HeaderProps {
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-neutral-800 bg-neutral-950">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onGoHome}>

        <h1 className="text-sm font-semibold tracking-tight text-white">
          Fractal<span className="text-neutral-500"> Gallery</span>
        </h1>
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={toggleLanguage} 
          className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-sm"
          title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <Globe size={16} />
          <span className="font-medium uppercase text-xs">{language}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
