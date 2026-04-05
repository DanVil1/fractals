'use client';

import React, { useRef, useEffect } from 'react';

interface PeanoCurveProps {
  isDark: boolean;
  order: number;
}

const PeanoCurve: React.FC<PeanoCurveProps> = ({ isDark, order }) => {
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

    // Generate Peano curve points using L-system approach
    // Axiom: L
    // L → LFRFL-F-RFLFR+F+LFRFL
    // R → RFLFR+F+LFRFL-F-RFLFR
    let instructions = 'L';
    for (let i = 0; i < order; i++) {
      let next = '';
      for (const ch of instructions) {
        if (ch === 'L') next += 'LFRFL-F-RFLFR+F+LFRFL';
        else if (ch === 'R') next += 'RFLFR+F+LFRFL-F-RFLFR';
        else next += ch;
      }
      instructions = next;
    }

    // Generate points at unit scale, then fit to canvas
    let x = 0;
    let y = 0;
    let angle = Math.PI / 2;

    const points: [number, number][] = [[x, y]];

    for (const ch of instructions) {
      if (ch === 'F') {
        x += Math.cos(angle);
        y -= Math.sin(angle);
        points.push([x, y]);
      } else if (ch === '+') {
        angle += Math.PI / 2;
      } else if (ch === '-') {
        angle -= Math.PI / 2;
      }
    }

    if (points.length < 2) return;

    // Compute bounding box
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [px, py] of points) {
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const padding = 0.05;
    const scale = Math.min(w / (rangeX * (1 + padding * 2)), h / (rangeY * (1 + padding * 2)));
    const offX = w / 2 - (minX + rangeX / 2) * scale;
    const offY = h / 2 - (minY + rangeY / 2) * scale;

    ctx.beginPath();
    ctx.moveTo(points[0][0] * scale + offX, points[0][1] * scale + offY);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0] * scale + offX, points[i][1] * scale + offY);
    }

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, 'hsl(30, 90%, 55%)');
    gradient.addColorStop(0.5, 'hsl(0, 85%, 55%)');
    gradient.addColorStop(1, 'hsl(330, 80%, 55%)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1, 3 - order * 0.5);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [isDark, order]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default PeanoCurve;
