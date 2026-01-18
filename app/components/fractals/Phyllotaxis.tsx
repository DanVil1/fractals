'use client';

import React, { useRef, useEffect } from 'react';

interface PhyllotaxisProps {
  isDark: boolean;
  spacing?: number;
  size?: number;
}

const Phyllotaxis: React.FC<PhyllotaxisProps> = ({ spacing = 4, size = 2 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (): void => {
      const parent = canvas.parentElement;
      if (parent && canvas.width !== parent.clientWidth) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      const count = 1500;
      const goldenAngle = 137.5 * (Math.PI / 180);

      for (let n = 0; n < count; n++) {
        const r = spacing * Math.sqrt(n);
        const theta = n * goldenAngle;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const hue = (n * 0.5 + frameRef.current) % 360;

        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      frameRef.current += 1;
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [spacing, size]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Phyllotaxis;
