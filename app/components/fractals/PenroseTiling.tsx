'use client';

import React, { useRef, useEffect } from 'react';

interface PenroseTilingProps {
  isDark: boolean;
  depth: number;
}

type Triangle = {
  type: 0 | 1; // 0 = thin, 1 = thick
  a: [number, number];
  b: [number, number];
  c: [number, number];
};

const PenroseTiling: React.FC<PenroseTilingProps> = ({ isDark, depth }) => {
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

    ctx.clearRect(0, 0, w, h);

    const phi = (1 + Math.sqrt(5)) / 2; // golden ratio

    // Start with a wheel of 10 triangles
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.45;

    let triangles: Triangle[] = [];

    for (let i = 0; i < 10; i++) {
      const angle1 = (2 * Math.PI * i) / 10 - Math.PI / 2;
      const angle2 = (2 * Math.PI * (i + 1)) / 10 - Math.PI / 2;

      const b: [number, number] = [cx + radius * Math.cos(angle1), cy + radius * Math.sin(angle1)];
      const c: [number, number] = [cx + radius * Math.cos(angle2), cy + radius * Math.sin(angle2)];

      if (i % 2 === 0) {
        triangles.push({ type: 0, a: [cx, cy], b, c });
      } else {
        triangles.push({ type: 0, a: [cx, cy], b: c, c: b });
      }
    }

    // Subdivide using Robinson triangle decomposition
    const subdivide = (tris: Triangle[]): Triangle[] => {
      const result: Triangle[] = [];

      for (const tri of tris) {
        const { type, a, b, c } = tri;

        if (type === 0) {
          // Thin triangle → subdivide
          const p: [number, number] = [
            b[0] + (c[0] - b[0]) / phi,
            b[1] + (c[1] - b[1]) / phi,
          ];
          result.push({ type: 0, a: c, b: p, c: a });
          result.push({ type: 1, a: p, b: b, c: a });
        } else {
          // Thick triangle → subdivide
          const q: [number, number] = [
            a[0] + (b[0] - a[0]) / phi,
            a[1] + (b[1] - a[1]) / phi,
          ];
          const r: [number, number] = [
            b[0] + (c[0] - b[0]) / phi,
            b[1] + (c[1] - b[1]) / phi,
          ];
          result.push({ type: 1, a: r, b: c, c: a });
          result.push({ type: 1, a: q, b: r, c: b });
          result.push({ type: 0, a: r, b: q, c: a });
        }
      }

      return result;
    };

    for (let i = 0; i < depth; i++) {
      triangles = subdivide(triangles);
    }

    // Draw triangles
    const colors0 = ['hsla(200, 70%, 45%, 0.6)', 'hsla(200, 50%, 35%, 0.4)'];
    const colors1 = ['hsla(330, 70%, 50%, 0.6)', 'hsla(330, 50%, 40%, 0.4)'];

    for (const tri of triangles) {
      ctx.beginPath();
      ctx.moveTo(tri.a[0], tri.a[1]);
      ctx.lineTo(tri.b[0], tri.b[1]);
      ctx.lineTo(tri.c[0], tri.c[1]);
      ctx.closePath();

      const colors = tri.type === 0 ? colors0 : colors1;
      ctx.fillStyle = colors[0];
      ctx.fill();
      ctx.strokeStyle = colors[1];
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }, [isDark, depth]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default PenroseTiling;
