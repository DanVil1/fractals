'use client';

import React, { useRef, useEffect } from 'react';

interface NewtonFractalProps {
  isDark: boolean;
  maxIterations: number;
  exponent: number;
}

const NewtonFractal: React.FC<NewtonFractalProps> = ({ isDark, maxIterations, exponent }) => {
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

    const n = exponent;
    const range = 2.5;
    const tolerance = 1e-6;

    // Roots of z^n - 1 = 0
    const roots: [number, number][] = [];
    for (let k = 0; k < n; k++) {
      roots.push([
        Math.cos((2 * Math.PI * k) / n),
        Math.sin((2 * Math.PI * k) / n),
      ]);
    }

    // Colors for each root — evenly spaced hues
    const rootColors = roots.map((_, i) => {
      const hue = (i * 360) / n;
      return hslToRgb(hue, 0.8, 0.6);
    });

    for (let px = 0; px < w; px++) {
      for (let py = 0; py < h; py++) {
        let zr = (px - w / 2) * (2 * range) / Math.min(w, h);
        let zi = (py - h / 2) * (2 * range) / Math.min(w, h);

        let iter = 0;
        let rootIdx = -1;

        for (iter = 0; iter < maxIterations; iter++) {
          // Compute z^n and z^(n-1) for Newton step: z_new = z - f(z)/f'(z) = z - (z^n - 1)/(n*z^(n-1))
          // z^(n-1)
          let pnm1r = 1, pnm1i = 0;
          for (let k = 0; k < n - 1; k++) {
            const tr = pnm1r * zr - pnm1i * zi;
            const ti = pnm1r * zi + pnm1i * zr;
            pnm1r = tr;
            pnm1i = ti;
          }
          // z^n = z^(n-1) * z
          const pnr = pnm1r * zr - pnm1i * zi;
          const pni = pnm1r * zi + pnm1i * zr;

          // f(z) = z^n - 1
          const fr = pnr - 1;
          const fi = pni;

          // f'(z) = n * z^(n-1)
          const denom = n * (pnm1r * pnm1r + pnm1i * pnm1i);
          if (denom < 1e-12) break;

          // f(z) / f'(z)
          const divR = (fr * n * pnm1r + fi * n * pnm1i) / (denom * n);
          const divI = (fi * n * pnm1r - fr * n * pnm1i) / (denom * n);

          // Simplified: division
          const dr2 = n * pnm1r;
          const di2 = n * pnm1i;
          const mag2 = dr2 * dr2 + di2 * di2;
          if (mag2 < 1e-12) break;
          const qr = (fr * dr2 + fi * di2) / mag2;
          const qi = (fi * dr2 - fr * di2) / mag2;

          zr -= qr;
          zi -= qi;

          // Check convergence to a root
          for (let r = 0; r < roots.length; r++) {
            const dx = zr - roots[r][0];
            const dy = zi - roots[r][1];
            if (dx * dx + dy * dy < tolerance) {
              rootIdx = r;
              break;
            }
          }
          if (rootIdx >= 0) break;
        }

        const idx = (py * w + px) * 4;
        if (rootIdx >= 0) {
          const shade = 1 - iter / maxIterations;
          const c = rootColors[rootIdx];
          data[idx] = Math.floor(c[0] * shade);
          data[idx + 1] = Math.floor(c[1] * shade);
          data[idx + 2] = Math.floor(c[2] * shade);
        } else {
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
        }
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [isDark, maxIterations, exponent]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [Math.floor((r + m) * 255), Math.floor((g + m) * 255), Math.floor((b + m) * 255)];
}

export default NewtonFractal;
