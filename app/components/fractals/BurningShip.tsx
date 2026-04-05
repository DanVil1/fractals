'use client';

import React, { useRef, useEffect } from 'react';

interface BurningShipProps {
  isDark: boolean;
  maxIterations: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
}

const BurningShip: React.FC<BurningShipProps> = ({ isDark, maxIterations, zoom, offsetX, offsetY }) => {
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

    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    const scale = 3.5 / (zoom * Math.min(w, h));

    for (let px = 0; px < w; px++) {
      for (let py = 0; py < h; py++) {
        const x0 = (px - w / 2) * scale + offsetX;
        const y0 = (py - h / 2) * scale + offsetY;

        let x = 0;
        let y = 0;
        let iter = 0;

        while (x * x + y * y <= 4 && iter < maxIterations) {
          const xNew = x * x - y * y + x0;
          // Key difference from Mandelbrot: take absolute values
          y = Math.abs(2 * x * y) + y0;
          x = xNew;
          iter++;
        }

        const idx = (py * w + px) * 4;
        if (iter === maxIterations) {
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
        } else {
          const t = iter / maxIterations;
          // Fire-like color scheme
          data[idx] = Math.floor(255 * Math.min(1, t * 3));
          data[idx + 1] = Math.floor(255 * Math.min(1, Math.max(0, t * 3 - 1)));
          data[idx + 2] = Math.floor(255 * Math.min(1, Math.max(0, t * 3 - 2)));
        }
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [isDark, maxIterations, zoom, offsetX, offsetY]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default BurningShip;
