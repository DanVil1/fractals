'use client';

import React from 'react';
import type { FractalInfo } from '../../lib/types';
import { useLanguage } from '../../i18n';

interface FractalCardProps {
  fractal: FractalInfo;
  onClick: () => void;
}

const FractalCard: React.FC<FractalCardProps> = ({ fractal, onClick }) => {
  const { t } = useLanguage();
  const IconComponent = fractal.icon;

  return (
    <div 
      onClick={onClick} 
      className="aspect-square rounded-lg border border-neutral-800 bg-neutral-900 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-neutral-700 hover:shadow-sm group"
    >
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="group-hover:scale-110 transition-transform duration-300">
          <IconComponent size={36} className={`mb-4 ${fractal.color}`} />
        </div>
      </div>
      <div className="w-full">
        <h3 className="text-lg font-semibold text-white">{t(fractal.titleKey)}</h3>
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
          {t(fractal.subtitleKey)}
        </p>
      </div>
    </div>
  );
};

export default FractalCard;
