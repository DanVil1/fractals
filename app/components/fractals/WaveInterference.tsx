'use client';

import React, { useRef, useEffect } from 'react';

interface WaveInterferenceProps {
  isDark: boolean;
  sources: number;
  frequency: number;
  speed: number;
}

const WaveInterference: React.FC<WaveInterferenceProps> = ({ 
  isDark, 
  sources = 2, 
  frequency = 0.1,
  speed = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Lower resolution for performance
    const scale = 3;
    const w = Math.floor(canvas.parentElement.clientWidth / scale);
    const h = Math.floor(canvas.parentElement.clientHeight / scale);
    canvas.width = w;
    canvas.height = h;

    // Generate source positions
    const sourcePositions: { x: number; y: number }[] = [];
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.3;
    
    for (let i = 0; i < sources; i++) {
      const angle = (i / sources) * Math.PI * 2;
      sourcePositions.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      });
    }

    const imgData = ctx.createImageData(w, h);

    const render = (): void => {
      timeRef.current += 0.05 * speed;
      const t = timeRef.current;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let amplitude = 0;

          // Sum waves from all sources
          for (const source of sourcePositions) {
            const dx = x - source.x;
            const dy = y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Wave equation: sin(distance * frequency - time)
            const wave = Math.sin(distance * frequency - t);
            
            // Decay with distance
            const decay = Math.max(0, 1 - distance / (Math.max(w, h) * 0.7));
            amplitude += wave * decay;
          }

          // Normalize amplitude
          amplitude = (amplitude / sources + 1) / 2;

          const idx = (y * w + x) * 4;
          
          if (isDark) {
            // Blue-cyan color scheme
            const r = Math.floor(amplitude * 80);
            const g = Math.floor(amplitude * 180 + 40);
            const b = Math.floor(amplitude * 220 + 35);
            imgData.data[idx] = r;
            imgData.data[idx + 1] = g;
            imgData.data[idx + 2] = b;
          } else {
            // Purple-pink color scheme
            const r = Math.floor(amplitude * 200 + 55);
            const g = Math.floor(amplitude * 100 + 20);
            const b = Math.floor(amplitude * 180 + 75);
            imgData.data[idx] = r;
            imgData.data[idx + 1] = g;
            imgData.data[idx + 2] = b;
          }
          imgData.data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Draw source markers
      ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
      for (const source of sourcePositions) {
        ctx.beginPath();
        ctx.arc(source.x, source.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, sources, frequency, speed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full" 
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default WaveInterference;
