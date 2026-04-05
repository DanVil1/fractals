'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../i18n';
import type { FractalFormula } from '../../data/formulas';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  description: string;
  formula?: FractalFormula;
}

const InfoModal: React.FC<InfoModalProps> = ({ 
  isOpen, onClose, title, subtitle, description, formula 
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-xs text-neutral-500 uppercase tracking-widest mt-0.5">{subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>

          {/* Formulas */}
          {formula && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                  {t('common.equations')}
                </h4>
                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-1.5">
                  {formula.equations.map((eq, i) => (
                    <p key={i} className="font-mono text-sm text-neutral-300 leading-relaxed">
                      {eq}
                    </p>
                  ))}
                </div>
              </div>

              {formula.variables && formula.variables.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                    {t('common.parameters')}
                  </h4>
                  <div className="grid gap-1.5">
                    {formula.variables.map((v, i) => (
                      <div key={i} className="flex items-baseline gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 shrink-0 mt-1.5" />
                        <span className="font-mono text-xs text-neutral-400">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
