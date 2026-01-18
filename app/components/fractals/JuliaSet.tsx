'use client';

import React, { useRef, useEffect } from 'react';

interface JuliaSetProps {
  isDark: boolean;
  cRe: number;
  cIm: number;
}

const JuliaSet: React.FC<JuliaSetProps> = ({ isDark, cRe, cIm }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderW = 300;
    const renderH = 300;
    canvas.width = renderW;
    canvas.height = renderH;

    const imgData = ctx.createImageData(renderW, renderH);
    const data = imgData.data;
    const maxIter = 50;
    const zoom = 1;

    for (let y = 0; y < renderH; y++) {
      for (let x = 0; x < renderW; x++) {
        let zx = 1.5 * (x - renderW / 2) / (0.5 * zoom * renderW);
        let zy = (y - renderH / 2) / (0.5 * zoom * renderH);
        let i = 0;

        while (zx * zx + zy * zy < 4 && i < maxIter) {
          const xtemp = zx * zx - zy * zy + cRe;
          zy = 2 * zx * zy + cIm;
          zx = xtemp;
          i++;
        }

        const pIndex = (y * renderW + x) * 4;

        if (i === maxIter) {
          data[pIndex] = 0;
          data[pIndex + 1] = 0;
          data[pIndex + 2] = 0;
          data[pIndex + 3] = 255;
        } else {
          const t = i / maxIter;
          const r = 9 * (1 - t) * t * t * 255;
          const g = 15 * (1 - t) * (1 - t) * t * 255;
          const b = 8.5 * (1 - t) * (1 - t) * (1 - t) * 255;

          if (isDark) {
            data[pIndex] = r * 2 + 50;
            data[pIndex + 1] = g * 4 + 20;
            data[pIndex + 2] = b * 10 + 100;
          } else {
            data[pIndex] = r * 3;
            data[pIndex + 1] = g * 3;
            data[pIndex + 2] = b * 6 + 50;
          }
          data[pIndex + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [isDark, cRe, cIm]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: 'pixelated' }} />;
};

export default JuliaSet;
