'use client';

import React, { useRef, useEffect } from 'react';

interface BarnsleyFernProps {
  isDark: boolean;
  density?: number;
}

const BarnsleyFern: React.FC<BarnsleyFernProps> = ({ isDark, density = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const pointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    pointRef.current = { x: 0, y: 0 };
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const renderBatch = (): void => {
      const w = canvas.width;
      const h = canvas.height;
      const scale = Math.min(w, h) / 12;

      ctx.fillStyle = isDark ? '#4ade80' : '#15803d';
      const pointsPerFrame = 50 * density;

      for (let i = 0; i < pointsPerFrame; i++) {
        const { x, y } = pointRef.current;
        let nextX: number;
        let nextY: number;
        const r = Math.random();

        if (r < 0.01) {
          nextX = 0;
          nextY = 0.16 * y;
        } else if (r < 0.86) {
          nextX = 0.85 * x + 0.04 * y;
          nextY = -0.04 * x + 0.85 * y + 1.6;
        } else if (r < 0.93) {
          nextX = 0.2 * x - 0.26 * y;
          nextY = 0.23 * x + 0.22 * y + 1.6;
        } else {
          nextX = -0.15 * x + 0.28 * y;
          nextY = 0.26 * x + 0.24 * y + 0.44;
        }

        pointRef.current = { x: nextX, y: nextY };
        const plotX = w / 2 + nextX * scale;
        const plotY = h - nextY * scale;
        ctx.fillRect(plotX, plotY, 1, 1);
      }

      animationRef.current = requestAnimationFrame(renderBatch);
    };

    renderBatch();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, density]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default BarnsleyFern;
