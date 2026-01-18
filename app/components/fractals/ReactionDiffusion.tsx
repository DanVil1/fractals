'use client';

import React, { useRef, useEffect } from 'react';

interface ReactionDiffusionProps {
  isDark: boolean;
  feedRate: number;
  killRate: number;
}

const ReactionDiffusion: React.FC<ReactionDiffusionProps> = ({ 
  isDark, 
  feedRate = 0.055, 
  killRate = 0.062 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use smaller resolution for performance
    const scale = 2;
    const w = Math.floor(canvas.parentElement.clientWidth / scale);
    const h = Math.floor(canvas.parentElement.clientHeight / scale);
    canvas.width = w;
    canvas.height = h;

    // Gray-Scott model parameters
    const dA = 1.0;    // Diffusion rate of A
    const dB = 0.5;    // Diffusion rate of B
    const f = feedRate;   // Feed rate
    const k = killRate;   // Kill rate

    // Initialize grids
    let gridA: number[][] = Array(w).fill(null).map(() => Array(h).fill(1));
    let gridB: number[][] = Array(w).fill(null).map(() => Array(h).fill(0));
    let nextA: number[][] = Array(w).fill(null).map(() => Array(h).fill(1));
    let nextB: number[][] = Array(w).fill(null).map(() => Array(h).fill(0));

    // Seed with some B in the center
    const seedSize = 20;
    const cx = Math.floor(w / 2);
    const cy = Math.floor(h / 2);
    
    for (let x = cx - seedSize; x < cx + seedSize; x++) {
      for (let y = cy - seedSize; y < cy + seedSize; y++) {
        if (x >= 0 && x < w && y >= 0 && y < h) {
          if (Math.random() > 0.5) {
            gridB[x][y] = 1;
          }
        }
      }
    }

    // Add some random seeds
    for (let i = 0; i < 5; i++) {
      const rx = Math.floor(Math.random() * w);
      const ry = Math.floor(Math.random() * h);
      for (let dx = -5; dx <= 5; dx++) {
        for (let dy = -5; dy <= 5; dy++) {
          const nx = rx + dx;
          const ny = ry + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            gridB[nx][ny] = 1;
          }
        }
      }
    }

    const laplacian = (grid: number[][], x: number, y: number): number => {
      let sum = 0;
      sum += grid[x][y] * -1;
      sum += (grid[(x + 1) % w][y] || 0) * 0.2;
      sum += (grid[(x - 1 + w) % w][y] || 0) * 0.2;
      sum += (grid[x][(y + 1) % h] || 0) * 0.2;
      sum += (grid[x][(y - 1 + h) % h] || 0) * 0.2;
      sum += (grid[(x + 1) % w][(y + 1) % h] || 0) * 0.05;
      sum += (grid[(x - 1 + w) % w][(y + 1) % h] || 0) * 0.05;
      sum += (grid[(x + 1) % w][(y - 1 + h) % h] || 0) * 0.05;
      sum += (grid[(x - 1 + w) % w][(y - 1 + h) % h] || 0) * 0.05;
      return sum;
    };

    const imgData = ctx.createImageData(w, h);

    const render = (): void => {
      // Run simulation steps
      for (let step = 0; step < 5; step++) {
        for (let x = 0; x < w; x++) {
          for (let y = 0; y < h; y++) {
            const a = gridA[x][y];
            const b = gridB[x][y];
            const reaction = a * b * b;
            
            nextA[x][y] = a + (dA * laplacian(gridA, x, y) - reaction + f * (1 - a));
            nextB[x][y] = b + (dB * laplacian(gridB, x, y) + reaction - (k + f) * b);
            
            // Clamp values
            nextA[x][y] = Math.max(0, Math.min(1, nextA[x][y]));
            nextB[x][y] = Math.max(0, Math.min(1, nextB[x][y]));
          }
        }

        // Swap grids
        [gridA, nextA] = [nextA, gridA];
        [gridB, nextB] = [nextB, gridB];
      }

      // Render to canvas
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          const idx = (y * w + x) * 4;
          const val = gridA[x][y] - gridB[x][y];
          const c = Math.floor(Math.max(0, Math.min(1, val)) * 255);
          
          if (isDark) {
            imgData.data[idx] = 255 - c;
            imgData.data[idx + 1] = 100 + Math.floor(c * 0.5);
            imgData.data[idx + 2] = 180 + Math.floor(c * 0.3);
          } else {
            imgData.data[idx] = c;
            imgData.data[idx + 1] = Math.floor(c * 0.7);
            imgData.data[idx + 2] = Math.floor(c * 0.5);
          }
          imgData.data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, feedRate, killRate]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full" 
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default ReactionDiffusion;
