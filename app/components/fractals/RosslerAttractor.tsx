'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface RosslerAttractorProps {
  isDark: boolean;
  speed: number;
}

const RosslerAttractor: React.FC<RosslerAttractorProps> = ({ isDark, speed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== canvas.parentElement.clientWidth || canvas.height !== canvas.parentElement.clientHeight) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }

    const w = canvas.width;
    const h = canvas.height;

    const points: [number, number, number][] = [];
    const a = 0.2, b = 0.2, c = 5.7;
    const dt = 0.005 * speed;

    let x = 0.1, y = 0, z = 0;
    const steps = 20000;

    for (let i = 0; i < steps; i++) {
      const dx = -y - z;
      const dy = x + a * y;
      const dz = b + z * (x - c);
      x += dx * dt;
      y += dy * dt;
      z += dz * dt;
      points.push([x, y, z]);
    }

    // Find bounds
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    for (const [px, py] of points) {
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const scale = Math.min((w - 60) / rangeX, (h - 60) / rangeY);
    const offX = w / 2 - (minX + rangeX / 2) * scale;
    const offY = h / 2 - (minY + rangeY / 2) * scale;

    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const sx = points[i][0] * scale + offX;
      const sy = points[i][1] * scale + offY;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, 'hsl(160, 80%, 50%)');
    gradient.addColorStop(0.5, 'hsl(200, 80%, 60%)');
    gradient.addColorStop(1, 'hsl(260, 80%, 50%)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.8;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [isDark, speed]);

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default RosslerAttractor;
