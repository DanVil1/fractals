'use client';

import React, { useRef, useEffect } from 'react';
import type { Particle } from '../../lib/types';

interface ChladniPlateProps {
  frequency: number;
  isDark: boolean;
}

const ChladniPlate: React.FC<ChladniPlateProps> = ({ frequency, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    particlesRef.current = Array.from({ length: 3000 }, () => ({
      x: Math.random(),
      y: Math.random()
    }));
  }, []);

  const getChladniValue = (x: number, y: number, n: number, m: number): number =>
    Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) -
    Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const n = 1 + Math.floor(frequency / 100);
    const m = 2 + Math.floor(frequency / 150);
    const stochasticAmplitude = 0.01;

    const render = (): void => {
      const parent = canvas.parentElement;
      if (parent && canvas.width !== parent.clientWidth) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = isDark ? 'rgba(20,20,25, 0.2)' : 'rgba(255,255,255, 0.2)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = isDark ? '#fbbf24' : '#1e3a8a';

      particlesRef.current.forEach(p => {
        const val = getChladniValue(p.x, p.y, n, m);
        const shake = Math.abs(val) * stochasticAmplitude;
        p.x += (Math.random() - 0.5) * shake;
        p.y += (Math.random() - 0.5) * shake;

        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        ctx.fillRect(p.x * w, p.y * h, 1.5, 1.5);
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [frequency, isDark]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 font-mono text-xs bg-black/20 p-1 rounded">
        n={1 + Math.floor(frequency / 100)}, m={2 + Math.floor(frequency / 150)}
      </div>
    </div>
  );
};

export default ChladniPlate;
