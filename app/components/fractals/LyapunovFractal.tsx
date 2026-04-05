'use client';

import React, { useRef, useEffect } from 'react';

interface LyapunovFractalProps {
  isDark: boolean;
  maxIterations: number;
  sequence: string;
}

const LyapunovFractal: React.FC<LyapunovFractalProps> = ({ isDark, maxIterations, sequence }) => {
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

    const seqChars = sequence.toUpperCase().split('').filter(c => c === 'A' || c === 'B');
    if (seqChars.length === 0) return;

    // Render at reduced resolution for performance, then scale up
    const maxDim = 300;
    const aspect = w / h;
    const rw = aspect >= 1 ? maxDim : Math.floor(maxDim * aspect);
    const rh = aspect >= 1 ? Math.floor(maxDim / aspect) : maxDim;

    const buffer = new Float64Array(rw * rh);

    const aMin = 2, aMax = 4;
    const bMin = 2, bMax = 4;
    let globalMin = Infinity, globalMax = -Infinity;

    for (let px = 0; px < rw; px++) {
      for (let py = 0; py < rh; py++) {
        const a = aMin + (px / rw) * (aMax - aMin);
        const b = bMin + (py / rh) * (bMax - bMin);

        let x = 0.5;
        let lyapunov = 0;
        const n = maxIterations;

        for (let i = 0; i < n; i++) {
          const r = seqChars[i % seqChars.length] === 'A' ? a : b;
          x = r * x * (1 - x);
          if (x <= 0 || x >= 1) { x = 0.5; continue; }
          lyapunov += Math.log(Math.abs(r * (1 - 2 * x)));
        }

        const val = lyapunov / n;
        buffer[py * rw + px] = val;
        if (val < globalMin) globalMin = val;
        if (val > globalMax) globalMax = val;
      }
    }

    // Scale up to full canvas with nearest-neighbor
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let py = 0; py < h; py++) {
      const sy = Math.floor((py / h) * rh);
      for (let px = 0; px < w; px++) {
        const sx = Math.floor((px / w) * rw);
        const lyapunov = buffer[sy * rw + sx];
        const idx = (py * w + px) * 4;

        if (lyapunov < 0) {
          const t = Math.min(1, -lyapunov / 2);
          data[idx] = Math.floor(20 * (1 - t));
          data[idx + 1] = Math.floor(60 * t);
          data[idx + 2] = Math.floor(200 * t);
        } else {
          const t = Math.min(1, lyapunov / 2);
          data[idx] = Math.floor(200 * t + 50);
          data[idx + 1] = Math.floor(120 * (1 - t));
          data[idx + 2] = Math.floor(20 * (1 - t));
        }
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [isDark, maxIterations, sequence]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default LyapunovFractal;
