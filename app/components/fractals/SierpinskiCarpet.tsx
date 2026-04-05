'use client';

import React, { useRef, useEffect } from 'react';

interface SierpinskiCarpetProps {
  isDark: boolean;
  depth: number;
}

const SierpinskiCarpet: React.FC<SierpinskiCarpetProps> = ({ isDark, depth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const size = Math.min(w, h) * 0.85;
    const offsetX = (w - size) / 2;
    const offsetY = (h - size) / 2;

    // Draw full square first
    ctx.fillStyle = 'hsl(270, 60%, 50%)';
    ctx.fillRect(offsetX, offsetY, size, size);

    // Recursively remove center squares
    const cutSquare = (x: number, y: number, s: number, d: number) => {
      if (d >= depth) return;

      const third = s / 3;

      // Remove center
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(x + third, y + third, third, third);

      // Draw border on the cut
      ctx.strokeStyle = `hsla(270, 60%, 40%, 0.3)`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x + third, y + third, third, third);

      // Recurse into 8 remaining sub-squares
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) continue; // Skip center
          cutSquare(x + i * third, y + j * third, third, d + 1);
        }
      }
    };

    cutSquare(offsetX, offsetY, size, 0);

    // Draw outer border
    ctx.strokeStyle = 'hsl(270, 60%, 60%)';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, size, size);
  }, [isDark, depth]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default SierpinskiCarpet;
