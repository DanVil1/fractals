'use client';

import React, { useRef, useEffect } from 'react';

interface CliffordAttractorProps {
  isDark: boolean;
  a: number;
  b: number;
  c: number;
  d: number;
}

const CliffordAttractor: React.FC<CliffordAttractorProps> = ({ isDark, a, b, c, d }) => {
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

    // Use offscreen buffer for density
    const density = new Float64Array(w * h);
    const iterations = 500000;

    let x = 0.1;
    let y = 0.1;

    // First pass: find bounds
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    const xs: number[] = [];
    const ys: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const xn = Math.sin(a * y) + c * Math.cos(a * x);
      const yn = Math.sin(b * x) + d * Math.cos(b * y);
      x = xn;
      y = yn;
      xs.push(x);
      ys.push(y);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const scale = Math.min((w - 40) / rangeX, (h - 40) / rangeY);
    const offX = (w - rangeX * scale) / 2;
    const offY = (h - rangeY * scale) / 2;

    for (let i = 0; i < iterations; i++) {
      const px = Math.floor((xs[i] - minX) * scale + offX);
      const py = Math.floor((ys[i] - minY) * scale + offY);
      if (px >= 0 && px < w && py >= 0 && py < h) {
        density[py * w + px]++;
      }
    }

    let maxDensity = 0;
    for (let i = 0; i < density.length; i++) {
      if (density[i] > maxDensity) maxDensity = density[i];
    }

    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    const logMax = Math.log(maxDensity + 1);

    for (let i = 0; i < density.length; i++) {
      const t = Math.log(density[i] + 1) / logMax;
      const idx = i * 4;
      // Warm colormap
      data[idx] = Math.floor(t * 255);
      data[idx + 1] = Math.floor(t * t * 200);
      data[idx + 2] = Math.floor(t * t * t * 255);
      data[idx + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }, [isDark, a, b, c, d]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default CliffordAttractor;
