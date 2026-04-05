'use client';

import React, { useRef, useEffect } from 'react';

interface HilbertCurveProps {
  isDark: boolean;
  order: number;
}

const HilbertCurve: React.FC<HilbertCurveProps> = ({ isDark, order }) => {
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

    const n = Math.pow(2, order);
    const totalPoints = n * n;
    const size = Math.min(w, h) * 0.9;
    const cellSize = size / n;
    const offsetX = (w - size) / 2 + cellSize / 2;
    const offsetY = (h - size) / 2 + cellSize / 2;

    // Convert index d to (x,y) in Hilbert curve
    const d2xy = (n: number, d: number): [number, number] => {
      let x = 0, y = 0;
      let rx: number, ry: number, s: number;
      let t = d;
      for (s = 1; s < n; s *= 2) {
        rx = (t & 2) > 0 ? 1 : 0;
        ry = ((t & 1) ^ rx) > 0 ? 0 : 1;
        // Rotate
        if (ry === 0) {
          if (rx === 1) {
            x = s - 1 - x;
            y = s - 1 - y;
          }
          [x, y] = [y, x];
        }
        x += s * rx;
        y += s * ry;
        t = Math.floor(t / 4);
      }
      return [x, y];
    };

    const points: [number, number][] = [];
    for (let i = 0; i < totalPoints; i++) {
      const [hx, hy] = d2xy(n, i);
      points.push([offsetX + hx * cellSize, offsetY + hy * cellSize]);
    }

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, 'hsl(280, 80%, 60%)');
    gradient.addColorStop(0.5, 'hsl(200, 80%, 60%)');
    gradient.addColorStop(1, 'hsl(120, 80%, 60%)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1, 3 - order * 0.3);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [isDark, order]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default HilbertCurve;
