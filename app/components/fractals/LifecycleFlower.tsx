'use client';

import React, { useRef } from 'react';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';

interface LifecycleFlowerProps {
  isDark: boolean;
  speed?: number;
}

const LifecycleFlower: React.FC<LifecycleFlowerProps> = ({ isDark, speed = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const noiseSeed = useRef<number[]>(Array.from({ length: 100 }, () => Math.random()));

  useAnimationFrame((deltaTime) => {
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
    const cx = w / 2;
    const cy = h / 2 + 100;

    // Time logic: Cycle 0 -> 100
    timeRef.current += deltaTime * 0.001 * speed;
    const cycleDuration = 10;
    const t = (timeRef.current % cycleDuration) / cycleDuration;

    ctx.clearRect(0, 0, w, h);

    // --- PHASE MATHEMATICS ---

    // 1. Stem Growth: Grows from 0 to 1
    const stemGrowth = 1 / (1 + Math.exp(-15 * (t - 0.25)));

    // 2. Bloom Growth: Starts a bit after stem has some height
    // Ensure bloom is 0 when stem is very small to avoid "ground blooms"
    let bloomGrowth = 1 / (1 + Math.exp(-20 * (t - 0.4)));
    if (stemGrowth < 0.2) bloomGrowth = 0; // Hard clamp for realism

    // 3. Decay Function
    const decay = t > 0.75 ? Math.max(0, 1 - (t - 0.75) * 3) : 1;

    // Chaos Factor
    const chaos = t > 0.75 ? (t - 0.75) * 30 : 0;

    // --- DRAW PARAMETRIC STEM FIRST (Bottom Layer) ---
    ctx.strokeStyle = isDark
      ? `rgba(163, 230, 53, ${decay})`
      : `rgba(101, 163, 13, ${decay})`;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const stemBase = h;
    const stemMaxHeight = h - (cy - 150);
    const currentStemHeight = stemMaxHeight * stemGrowth;
    const stemTopY = stemBase - currentStemHeight;
    const stemSteps = 50;

    // Draw stem segments up to current height
    for (let i = 0; i <= stemSteps; i++) {
      const progress = i / stemSteps;
      const y = stemBase - currentStemHeight * progress;

      // Wither bending equation applied to the whole stem structure
      const globalHeightRatio = progress * stemGrowth;
      const bend = t > 0.75 ? Math.pow(globalHeightRatio, 2) * chaos * 2 : 0;
      const sway = Math.sin(timeRef.current * 2 + globalHeightRatio * 3) * 2;
      const x = cx + Math.sin(globalHeightRatio * Math.PI) * 10 + bend + sway;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // --- CALCULATE TIP POSITION FOR FLOWER HEAD ---
    const tipGlobalHeightRatio = stemGrowth;
    const tipBend = t > 0.75 ? Math.pow(tipGlobalHeightRatio, 2) * chaos * 2 : 0;
    const tipSway = Math.sin(timeRef.current * 2 + tipGlobalHeightRatio * 3) * 2;
    const tipX = cx + Math.sin(tipGlobalHeightRatio * Math.PI) * 10 + tipBend + tipSway;
    const tipY = stemTopY;

    // --- DRAW FLOWER HEAD AT TIP ---
    const seedCount = 100 * bloomGrowth * decay;
    const centerSpread = 4 * bloomGrowth;
    const goldenAngle = 137.508 * (Math.PI / 180);

    if (seedCount > 1) {
      // Polar Petals
      const petalSize = 120 * bloomGrowth * decay;

      if (petalSize > 1) {
        ctx.strokeStyle = isDark
          ? `rgba(244, 114, 182, ${decay})`
          : `rgba(219, 39, 119, ${decay})`;
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let theta = 0; theta <= Math.PI * 2; theta += 0.05) {
          const rRaw = Math.cos(4 * theta);
          const r = Math.abs(rRaw) * petalSize;

          const noiseIdx = Math.floor((theta / (Math.PI * 2)) * 100) % 100;
          const nVal = noiseSeed.current[noiseIdx];
          const rNoisy = r * (1 - chaos * 0.05 * nVal);

          const px = tipX + rNoisy * Math.cos(theta);
          const py = tipY + rNoisy * Math.sin(theta);

          if (theta === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Seeds (Center)
      ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
      for (let i = 0; i < seedCount; i++) {
        const r = centerSpread * Math.sqrt(i);
        const theta = i * goldenAngle;

        const nx = (noiseSeed.current[i % 100] - 0.5) * chaos;
        const ny = (noiseSeed.current[(i + 50) % 100] - 0.5) * chaos;

        const x = tipX + r * Math.cos(theta) + nx;
        const y = tipY + r * Math.sin(theta) + ny;

        if (decay > 0.1) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5 * decay, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Data Overlay
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.font = "10px monospace";
    ctx.fillText(`t: ${t.toFixed(2)}`, w - 60, h - 20);
    ctx.fillText(`stem: ${stemGrowth.toFixed(2)}`, w - 100, h - 35);
    ctx.fillText(`bloom: ${bloomGrowth.toFixed(2)}`, w - 100, h - 50);
  });

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default LifecycleFlower;
