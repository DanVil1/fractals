'use client';

import React, { useRef, useEffect } from 'react';

interface MandelbrotSetProps {
  isDark: boolean;
  maxIterations: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
}

const MandelbrotSet: React.FC<MandelbrotSetProps> = ({ 
  isDark, 
  maxIterations = 100, 
  zoom = 1,
  offsetX = -0.5,
  offsetY = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderW = 400;
    const renderH = 400;
    canvas.width = renderW;
    canvas.height = renderH;

    const imgData = ctx.createImageData(renderW, renderH);
    const data = imgData.data;

    const scale = 3.5 / zoom;

    for (let py = 0; py < renderH; py++) {
      for (let px = 0; px < renderW; px++) {
        // Map pixel to complex plane
        const x0 = (px - renderW / 2) * (scale / renderW) + offsetX;
        const y0 = (py - renderH / 2) * (scale / renderH) + offsetY;

        let x = 0;
        let y = 0;
        let iteration = 0;

        // Mandelbrot iteration: z = z² + c
        while (x * x + y * y <= 4 && iteration < maxIterations) {
          const xtemp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xtemp;
          iteration++;
        }

        const pIndex = (py * renderW + px) * 4;

        if (iteration === maxIterations) {
          // Inside the set - black
          data[pIndex] = 0;
          data[pIndex + 1] = 0;
          data[pIndex + 2] = 0;
        } else {
          // Outside - color based on escape time
          const t = iteration / maxIterations;
          const hue = 360 * t;
          
          // Convert HSL to RGB
          const h = hue / 60;
          const c = 1;
          const x = c * (1 - Math.abs((h % 2) - 1));
          
          let r = 0, g = 0, b = 0;
          if (h < 1) { r = c; g = x; }
          else if (h < 2) { r = x; g = c; }
          else if (h < 3) { g = c; b = x; }
          else if (h < 4) { g = x; b = c; }
          else if (h < 5) { r = x; b = c; }
          else { r = c; b = x; }

          if (isDark) {
            data[pIndex] = Math.floor(r * 255);
            data[pIndex + 1] = Math.floor(g * 255);
            data[pIndex + 2] = Math.floor(b * 255);
          } else {
            // Lighter palette for light mode
            data[pIndex] = Math.floor((r * 0.7 + 0.3) * 255);
            data[pIndex + 1] = Math.floor((g * 0.7 + 0.3) * 255);
            data[pIndex + 2] = Math.floor((b * 0.7 + 0.3) * 255);
          }
        }
        data[pIndex + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [isDark, maxIterations, zoom, offsetX, offsetY]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full object-contain" 
      style={{ imageRendering: 'pixelated' }} 
    />
  );
};

export default MandelbrotSet;
