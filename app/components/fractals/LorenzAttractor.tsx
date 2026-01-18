'use client';

import React, { useRef, useEffect } from 'react';
import type { Vector3D } from '../../lib/types';

interface LorenzAttractorProps {
  isDark: boolean;
  speed?: number;
}

const LorenzAttractor: React.FC<LorenzAttractorProps> = ({ isDark, speed = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const posRef = useRef({ x: 0.1, y: 0, z: 0 });
  const pointsRef = useRef<Vector3D[]>([]);

  useEffect(() => {
    posRef.current = { x: 0.1, y: 0, z: 0 };
    pointsRef.current = [];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sigma = 10;
    const rho = 28;
    const beta = 8 / 3;

    const render = (): void => {
      const parent = canvas.parentElement;
      if (parent && canvas.width !== parent.clientWidth) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;
      const scale = 8;
      const dt = 0.01 * speed;

      let { x, y, z } = posRef.current;

      for (let i = 0; i < 5; i++) {
        const dx = (sigma * (y - x)) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx;
        y += dy;
        z += dz;
        pointsRef.current.push({ x, y, z });
      }

      posRef.current = { x, y, z };

      if (pointsRef.current.length > 2000) {
        pointsRef.current.splice(0, 10);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.beginPath();

      pointsRef.current.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * scale, -p.z * scale + 200);
        else ctx.lineTo(p.x * scale, -p.z * scale + 200);
      });

      ctx.strokeStyle = isDark ? '#f472b6' : '#db2777';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, speed]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default LorenzAttractor;
