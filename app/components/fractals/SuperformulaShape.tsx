'use client';

import React, { useRef, useEffect } from 'react';

interface SuperformulaShapeProps {
  isDark: boolean;
  m: number;
  n1: number;
  n2: number;
  n3: number;
}

const SuperformulaShape: React.FC<SuperformulaShapeProps> = ({ isDark, m, n1, n2, n3 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (): void => {
      const parent = canvas.parentElement;
      if (parent && canvas.width !== parent.clientWidth) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      const scale = Math.min(w, h) / 2.5;

      ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = 2;

      timeRef.current += 0.005;
      ctx.rotate(timeRef.current);

      ctx.beginPath();

      const a = 1;
      const b = 1;
      const totalPoints = 360 * 2;

      for (let i = 0; i <= totalPoints; i++) {
        const phi = (i / 360) * Math.PI * 2;
        const part1 = Math.pow(Math.abs(Math.cos(m * phi / 4) / a), n2);
        const part2 = Math.pow(Math.abs(Math.sin(m * phi / 4) / b), n3);
        const r = Math.pow(part1 + part2, -1 / n1);

        if (isFinite(r)) {
          const x = r * Math.cos(phi) * scale;
          const y = r * Math.sin(phi) * scale;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(2, 132, 199, 0.1)';
      ctx.fill();
      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, m, n1, n2, n3]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default SuperformulaShape;
