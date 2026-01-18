'use client';

import React, { useRef, useEffect } from 'react';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import type { LineData, TreeData, WindyParticle } from '../../lib/types';

interface WindyPlantProps {
  isDark: boolean;
  iterations: number;
  angleDeg: number;
}

const WindyPlant: React.FC<WindyPlantProps> = ({ isDark, iterations, angleDeg }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<WindyParticle[]>([]);
  const treeDataRef = useRef<TreeData>({
    lines: [],
    spawns: [],
    minX: 0,
    minY: 0,
    width: 0,
    height: 0
  });

  useEffect(() => {
    const axiom = "X";
    const rules: Record<string, string> = { "F": "FF", "X": "F+[[X]-X]-F[-FX]+X" };

    let sentence = axiom;
    for (let i = 0; i < iterations; i++) {
      let nextSentence = "";
      for (const char of sentence) {
        if (rules[char]) nextSentence += rules[char];
        else nextSentence += char;
      }
      sentence = nextSentence;
    }

    const rad = angleDeg * Math.PI / 180;
    const stack: { x: number; y: number; a: number }[] = [];
    let cx = 0, cy = 0, angle = -Math.PI / 2 + (-10 * Math.PI / 180);
    const unitLen = 1;

    const lines: LineData[] = [];
    const spawns: { x: number; y: number }[] = [];

    let minX = 0, maxX = 0, minY = 0, maxY = 0;

    for (const char of sentence) {
      if (char === "F") {
        const nx = cx + Math.cos(angle) * unitLen;
        const ny = cy + Math.sin(angle) * unitLen;
        lines.push({ x1: cx, y1: cy, x2: nx, y2: ny });
        if (Math.random() > 0.7) spawns.push({ x: nx, y: ny });
        cx = nx;
        cy = ny;
        minX = Math.min(minX, cx);
        maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy);
        maxY = Math.max(maxY, cy);
      } else if (char === "+") {
        angle += rad;
      } else if (char === "-") {
        angle -= rad;
      } else if (char === "[") {
        stack.push({ x: cx, y: cy, a: angle });
      } else if (char === "]") {
        const s = stack.pop();
        if (s) {
          cx = s.x;
          cy = s.y;
          angle = s.a;
        }
      }
    }

    treeDataRef.current = {
      lines,
      spawns,
      width: maxX - minX,
      height: maxY - minY,
      minX,
      minY
    };
    particlesRef.current = [];
  }, [iterations, angleDeg]);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (parent && canvas.width !== parent.clientWidth) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const { lines, spawns, width: tW, height: tH, minX, minY } = treeDataRef.current;
    const padding = 40;
    const scale = Math.min((w - padding * 2) / tW, (h - padding * 2) / tH);
    const offsetX = (w - tW * scale) / 2 - minX * scale;
    const offsetY = (h - tH * scale) / 2 - minY * scale;

    ctx.strokeStyle = isDark ? '#bef264' : '#65a30d';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (const l of lines) {
      ctx.moveTo(l.x1 * scale + offsetX, l.y1 * scale + offsetY);
      ctx.lineTo(l.x2 * scale + offsetX, l.y2 * scale + offsetY);
    }
    ctx.stroke();

    if (spawns.length > 0 && Math.random() < 0.2) {
      const spawn = spawns[Math.floor(Math.random() * spawns.length)];
      particlesRef.current.push({
        x: spawn.x * scale + offsetX,
        y: spawn.y * scale + offsetY,
        vx: (Math.random() - 0.2) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1.0,
        rotation: Math.random() * Math.PI
      });
    }

    const windAngleRad = (angleDeg - 90) * Math.PI / 180;
    const windForceX = Math.cos(windAngleRad) * 0.15;
    const windForceY = Math.sin(windAngleRad) * 0.15 + 0.05;

    ctx.fillStyle = isDark ? 'rgba(190, 242, 100, 0.8)' : 'rgba(101, 163, 13, 0.8)';

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.vx += windForceX + (Math.random() - 0.5) * 0.05;
      p.vy += windForceY;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.005;
      p.rotation += 0.1;

      if (p.life > 0 && p.x > -50 && p.x < w + 50 && p.y < h + 50) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        particlesRef.current.splice(i, 1);
      }
    }
  });

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default WindyPlant;
