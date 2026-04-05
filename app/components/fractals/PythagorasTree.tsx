'use client';

import React, { useRef, useEffect } from 'react';

interface PythagorasTreeProps {
  isDark: boolean;
  depth: number;
  lean: number;
}

const PythagorasTree: React.FC<PythagorasTreeProps> = ({ isDark, depth, lean }) => {
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

    const maxDepth = depth;
    const angle = (lean + 45) * Math.PI / 180;

    // Collect all squares first to compute bounding box
    const squares: { x1: number; y1: number; x2: number; y2: number; x3: number; y3: number; x4: number; y4: number; d: number }[] = [];

    const collectSquare = (
      x1: number, y1: number,
      x2: number, y2: number,
      d: number
    ) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const x3 = x2 - dy;
      const y3 = y2 + dx;
      const x4 = x1 - dy;
      const y4 = y1 + dx;

      squares.push({ x1, y1, x2, y2, x3, y3, x4, y4, d });

      if (d >= maxDepth) return;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const px = x4 + (x3 - x4) * cos * cos + (y4 - y3) * cos * sin;
      const py = y4 + (x3 - x4) * cos * sin - (y4 - y3) * cos * cos;

      collectSquare(x4, y4, px, py, d + 1);
      collectSquare(px, py, x3, y3, d + 1);
    };

    // Generate at unit scale, base at (0, 0)
    collectSquare(-0.5, 0, 0.5, 0, 0);

    // Compute bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const sq of squares) {
      for (const x of [sq.x1, sq.x2, sq.x3, sq.x4]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
      for (const y of [sq.y1, sq.y2, sq.y3, sq.y4]) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const padding = 0.05;
    const scale = Math.min(w / (rangeX * (1 + padding * 2)), h / (rangeY * (1 + padding * 2)));
    const offX = w / 2 - (minX + rangeX / 2) * scale;
    const offY = h / 2 - (minY + rangeY / 2) * scale;

    // Draw all squares
    for (const sq of squares) {
      const hue = 120 - (sq.d / maxDepth) * 120;
      const lightness = 30 + (sq.d / maxDepth) * 30;

      ctx.beginPath();
      ctx.moveTo(sq.x1 * scale + offX, sq.y1 * scale + offY);
      ctx.lineTo(sq.x2 * scale + offX, sq.y2 * scale + offY);
      ctx.lineTo(sq.x3 * scale + offX, sq.y3 * scale + offY);
      ctx.lineTo(sq.x4 * scale + offX, sq.y4 * scale + offY);
      ctx.closePath();
      ctx.fillStyle = `hsl(${hue}, 70%, ${lightness}%)`;
      ctx.fill();
      ctx.strokeStyle = `hsla(${hue}, 70%, ${lightness + 20}%, 0.5)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }, [isDark, depth, lean]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default PythagorasTree;
