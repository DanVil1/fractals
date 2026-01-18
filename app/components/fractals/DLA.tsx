'use client';

import React, { useRef, useEffect, useState } from 'react';

interface DLAProps {
  isDark: boolean;
  particleSpeed: number;
  stickiness: number;
}

const DLA: React.FC<DLAProps> = ({ isDark, particleSpeed = 2, stickiness = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [particleCount, setParticleCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const w = canvas.width;
    const h = canvas.height;
    const cellSize = 2;
    const cols = Math.floor(w / cellSize);
    const rows = Math.floor(h / cellSize);

    // Clear canvas
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Initialize grid
    const grid: boolean[][] = Array(cols).fill(null).map(() => Array(rows).fill(false));

    // Seed: center point and a small cluster
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);
    
    // Create initial seed cluster
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        const sx = centerX + dx;
        const sy = centerY + dy;
        if (sx >= 0 && sx < cols && sy >= 0 && sy < rows) {
          grid[sx][sy] = true;
          ctx.fillStyle = isDark ? '#22d3ee' : '#0891b2';
          ctx.fillRect(sx * cellSize, sy * cellSize, cellSize, cellSize);
        }
      }
    }

    let count = 25;
    let maxRadius = 5; // Track how far the structure has grown

    const hasNeighbor = (x: number, y: number): boolean => {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[nx][ny]) {
            return true;
          }
        }
      }
      return false;
    };

    // Spawn walker near the current growth front
    const spawnWalker = (): { x: number; y: number } => {
      const spawnRadius = maxRadius + 20;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.floor(centerX + Math.cos(angle) * spawnRadius),
        y: Math.floor(centerY + Math.sin(angle) * spawnRadius)
      };
    };

    // Multiple walkers for faster growth
    const walkers: { x: number; y: number }[] = [];
    const numWalkers = 100;
    for (let i = 0; i < numWalkers; i++) {
      walkers.push(spawnWalker());
    }

    const render = (): void => {
      // Process multiple steps per frame for speed
      const stepsPerFrame = Math.floor(particleSpeed * 50);
      
      for (let step = 0; step < stepsPerFrame; step++) {
        for (let i = 0; i < walkers.length; i++) {
          const walker = walkers[i];
          
          // Random walk
          const dx = Math.floor(Math.random() * 3) - 1;
          const dy = Math.floor(Math.random() * 3) - 1;
          
          walker.x += dx;
          walker.y += dy;

          // Keep in bounds
          walker.x = Math.max(0, Math.min(cols - 1, walker.x));
          walker.y = Math.max(0, Math.min(rows - 1, walker.y));

          // Check if too far from structure - respawn closer
          const distFromCenter = Math.sqrt(
            Math.pow(walker.x - centerX, 2) + 
            Math.pow(walker.y - centerY, 2)
          );
          
          if (distFromCenter > maxRadius + 50) {
            walkers[i] = spawnWalker();
            continue;
          }

          // Check if should stick
          if (hasNeighbor(walker.x, walker.y) && Math.random() < stickiness) {
            if (!grid[walker.x][walker.y]) {
              grid[walker.x][walker.y] = true;
              
              // Update max radius
              const newDist = Math.sqrt(
                Math.pow(walker.x - centerX, 2) + 
                Math.pow(walker.y - centerY, 2)
              );
              maxRadius = Math.max(maxRadius, newDist);
              
              // Color based on distance from center
              const hue = isDark ? 180 + newDist * 0.8 : 150 + newDist * 0.5;
              const lightness = isDark ? 50 + (newDist * 0.2) : 35 + (newDist * 0.15);
              ctx.fillStyle = `hsl(${hue}, 75%, ${Math.min(lightness, 70)}%)`;
              ctx.fillRect(walker.x * cellSize, walker.y * cellSize, cellSize, cellSize);
              
              count++;
              
              // Respawn walker
              walkers[i] = spawnWalker();
            }
          }
        }
      }
      
      setParticleCount(count);

      // Stop when we've grown enough or reached edges
      if (count < 8000 && maxRadius < Math.min(cols, rows) / 2 - 10) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    render();
    
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, particleSpeed, stickiness]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-4 right-4 font-mono text-xs bg-black/20 backdrop-blur p-2 rounded">
        Particles: {particleCount}
      </div>
    </div>
  );
};

export default DLA;
