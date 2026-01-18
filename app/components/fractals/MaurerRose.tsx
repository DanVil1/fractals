'use client';

import React, { useRef, useEffect } from 'react';

interface MaurerRoseProps {
  isDark: boolean;
  n?: number;
  d?: number;
}

const MaurerRose: React.FC<MaurerRoseProps> = ({ isDark, n = 6, d = 71 }) => {
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
    ctx.translate(w / 2, h / 2);

    const scale = Math.min(w, h) / 2.5;

    // Draw Maurer rose lines
    ctx.strokeStyle = isDark ? 'rgba(236, 72, 153, 0.6)' : 'rgba(219, 39, 119, 0.6)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    for (let i = 0; i <= 360; i++) {
      const k = i * d * Math.PI / 180;
      const r = Math.sin(n * k) * scale;
      const x = r * Math.cos(k);
      const y = r * Math.sin(k);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw rose curve
    ctx.strokeStyle = isDark ? '#fff' : '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i <= 360; i++) {
      const k = i * Math.PI / 180;
      const r = Math.sin(n * k) * scale;
      const x = r * Math.cos(k);
      const y = r * Math.sin(k);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [isDark, n, d]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default MaurerRose;
