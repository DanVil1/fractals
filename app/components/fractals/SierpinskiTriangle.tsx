'use client';

import React, { useRef, useEffect } from 'react';

interface SierpinskiTriangleProps {
  isDark: boolean;
  depth: number;
}

const SierpinskiTriangle: React.FC<SierpinskiTriangleProps> = ({ isDark, depth }) => {
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

    const size = Math.min(w, h) * 0.9;
    const startX = (w - size) / 2;
    const startY = (h - size * Math.sqrt(3) / 2) / 2 + size * Math.sqrt(3) / 2;

    // Initial triangle vertices
    const p1 = { x: startX + size / 2, y: startY - size * Math.sqrt(3) / 2 };
    const p2 = { x: startX, y: startY };
    const p3 = { x: startX + size, y: startY };

    const drawTriangle = (
      x1: number, y1: number,
      x2: number, y2: number,
      x3: number, y3: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
      ctx.fill();
    };

    const sierpinski = (
      x1: number, y1: number,
      x2: number, y2: number,
      x3: number, y3: number,
      d: number
    ): void => {
      if (d === 0) {
        drawTriangle(x1, y1, x2, y2, x3, y3);
        return;
      }

      // Calculate midpoints
      const m12 = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
      const m23 = { x: (x2 + x3) / 2, y: (y2 + y3) / 2 };
      const m31 = { x: (x3 + x1) / 2, y: (y3 + y1) / 2 };

      // Recurse on three corner triangles (leaving center empty)
      sierpinski(x1, y1, m12.x, m12.y, m31.x, m31.y, d - 1);
      sierpinski(m12.x, m12.y, x2, y2, m23.x, m23.y, d - 1);
      sierpinski(m31.x, m31.y, m23.x, m23.y, x3, y3, d - 1);
    };

    ctx.fillStyle = isDark ? '#10b981' : '#059669';
    sierpinski(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, depth);

  }, [isDark, depth]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default SierpinskiTriangle;
