'use client';

import React, { useRef, useEffect } from 'react';

interface BuddhabrotProps {
  isDark: boolean;
  maxIterations: number;
  samples: number;
}

const Buddhabrot: React.FC<BuddhabrotProps> = ({ isDark, maxIterations, samples }) => {
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

    const density = new Float64Array(w * h);
    const xMin = -2, xMax = 1, yMin = -1.5, yMax = 1.5;

    const toPixelX = (x: number) => Math.floor(((x - xMin) / (xMax - xMin)) * w);
    const toPixelY = (y: number) => Math.floor(((y - yMin) / (yMax - yMin)) * h);

    const totalSamples = samples * 10000;

    // Use seeded random for reproducibility
    let seed = 42;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };

    for (let s = 0; s < totalSamples; s++) {
      const cr = rand() * 3 - 2;
      const ci = rand() * 3 - 1.5;

      // First pass: check if it escapes
      let zr = 0, zi = 0;
      let escaped = false;
      const trajectory: [number, number][] = [];

      for (let i = 0; i < maxIterations; i++) {
        const tr = zr * zr - zi * zi + cr;
        zi = 2 * zr * zi + ci;
        zr = tr;
        trajectory.push([zr, zi]);
        if (zr * zr + zi * zi > 4) {
          escaped = true;
          break;
        }
      }

      // Only plot trajectories that escape (anti-Buddhabrot would be non-escaping)
      if (escaped) {
        for (const [tx, ty] of trajectory) {
          const px = toPixelX(tx);
          const py = toPixelY(ty);
          if (px >= 0 && px < w && py >= 0 && py < h) {
            density[py * w + px]++;
          }
        }
      }
    }

    // Find max density for normalization
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
      // Ghostly blue-purple colormap
      data[idx] = Math.floor(t * 120);
      data[idx + 1] = Math.floor(t * 180);
      data[idx + 2] = Math.floor(t * 255);
      data[idx + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }, [isDark, maxIterations, samples]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Buddhabrot;
