'use client';

import React from 'react';
import type { FractalInfo } from '../../lib/types';
import { useLanguage } from '../../i18n';

interface FractalCardProps {
  fractal: FractalInfo;
  isDark: boolean;
  onClick: () => void;
}

const FractalCard: React.FC<FractalCardProps> = ({ fractal, isDark, onClick }) => {
  const { t } = useLanguage();
  const IconComponent = fractal.icon;
  
  const cardClasses = isDark 
    ? "bg-slate-800 hover:bg-slate-700 border-slate-700" 
    : "bg-white hover:bg-slate-100 border-slate-200 shadow-sm";

  return (
    <div 
      onClick={onClick} 
      className={`aspect-square rounded-2xl border p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02] group ${cardClasses}`}
    >
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="group-hover:scale-110 transition-transform duration-300">
          <IconComponent size={40} className={`mb-4 ${fractal.color}`} />
        </div>
      </div>
      <div className="w-full">
        <h3 className="text-xl font-bold">{t(fractal.titleKey)}</h3>
        <p className="text-sm opacity-50 uppercase tracking-wider mb-2">
          {t(fractal.subtitleKey)}
        </p>
        <p className="text-sm opacity-70 line-clamp-3">
          {t(fractal.descKey)}
        </p>
      </div>
    </div>
  );
};

export default FractalCard;
