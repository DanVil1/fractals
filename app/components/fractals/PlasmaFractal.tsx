'use client';

import React, { useRef, useEffect } from 'react';

interface PlasmaFractalProps {
  isDark: boolean;
  roughness: number;
  seed: number;
}

const PlasmaFractal: React.FC<PlasmaFractalProps> = ({ isDark, roughness, seed }) => {
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

    // Diamond-square algorithm
    const size = 257; // 2^n + 1
    const grid = new Float64Array(size * size);

    // Seeded PRNG
    let s = seed;
    const rand = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return (s / 0x7fffffff) * 2 - 1;
    };

    // Initialize corners
    grid[0] = rand();
    grid[size - 1] = rand();
    grid[(size - 1) * size] = rand();
    grid[(size - 1) * size + size - 1] = rand();

    let stepSize = size - 1;
    let scale = roughness;

    while (stepSize > 1) {
      const half = stepSize / 2;

      // Diamond step
      for (let y = 0; y < size - 1; y += stepSize) {
        for (let x = 0; x < size - 1; x += stepSize) {
          const avg = (
            grid[y * size + x] +
            grid[y * size + x + stepSize] +
            grid[(y + stepSize) * size + x] +
            grid[(y + stepSize) * size + x + stepSize]
          ) / 4;
          grid[(y + half) * size + x + half] = avg + rand() * scale;
        }
      }

      // Square step
      for (let y = 0; y < size; y += half) {
        for (let x = ((y / half) % 2 === 0 ? half : 0); x < size; x += stepSize) {
          let sum = 0;
          let count = 0;
          if (y - half >= 0) { sum += grid[(y - half) * size + x]; count++; }
          if (y + half < size) { sum += grid[(y + half) * size + x]; count++; }
          if (x - half >= 0) { sum += grid[y * size + x - half]; count++; }
          if (x + half < size) { sum += grid[y * size + x + half]; count++; }
          grid[y * size + x] = sum / count + rand() * scale;
        }
      }

      stepSize = half;
      scale *= 0.5;
    }

    // Normalize
    let minVal = Infinity, maxVal = -Infinity;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] < minVal) minVal = grid[i];
      if (grid[i] > maxVal) maxVal = grid[i];
    }
    const range = maxVal - minVal || 1;

    // Render
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const gx = (px / w) * (size - 1);
        const gy = (py / h) * (size - 1);

        // Bilinear interpolation
        const x0 = Math.floor(gx);
        const y0 = Math.floor(gy);
        const x1 = Math.min(x0 + 1, size - 1);
        const y1 = Math.min(y0 + 1, size - 1);
        const fx = gx - x0;
        const fy = gy - y0;

        const v = (
          grid[y0 * size + x0] * (1 - fx) * (1 - fy) +
          grid[y0 * size + x1] * fx * (1 - fy) +
          grid[y1 * size + x0] * (1 - fx) * fy +
          grid[y1 * size + x1] * fx * fy
        );

        const t = (v - minVal) / range;
        const idx = (py * w + px) * 4;

        // Plasma colormap
        data[idx] = Math.floor(128 + 127 * Math.sin(t * Math.PI * 2));
        data[idx + 1] = Math.floor(128 + 127 * Math.sin(t * Math.PI * 2 + 2.094));
        data[idx + 2] = Math.floor(128 + 127 * Math.sin(t * Math.PI * 2 + 4.189));
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [isDark, roughness, seed]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default PlasmaFractal;
