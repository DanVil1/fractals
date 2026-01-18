'use client';

import React, { useRef } from 'react';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';

interface DoublePendulumProps {
  isDark: boolean;
  gravity: number;
  trailLength: number;
}

const DoublePendulum: React.FC<DoublePendulumProps> = ({ 
  isDark, 
  gravity = 1, 
  trailLength = 500 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Pendulum state
  const stateRef = useRef({
    a1: Math.PI / 2,      // Angle 1
    a2: Math.PI / 2,      // Angle 2
    a1_v: 0,              // Angular velocity 1
    a2_v: 0,              // Angular velocity 2
    trail: [] as { x: number; y: number }[]
  });

  // Constants
  const m1 = 10;  // Mass 1
  const m2 = 10;  // Mass 2
  const l1 = 100; // Length 1
  const l2 = 100; // Length 2

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
    const cx = w / 2;
    const cy = h / 3;

    const g = gravity * 0.5;
    const state = stateRef.current;

    // Physics simulation (Lagrangian mechanics)
    const { a1, a2, a1_v, a2_v } = state;

    // Calculate angular accelerations using equations of motion
    const num1 = -g * (2 * m1 + m2) * Math.sin(a1);
    const num2 = -m2 * g * Math.sin(a1 - 2 * a2);
    const num3 = -2 * Math.sin(a1 - a2) * m2;
    const num4 = a2_v * a2_v * l2 + a1_v * a1_v * l1 * Math.cos(a1 - a2);
    const den = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    const a1_a = (num1 + num2 + num3 * num4) / den;

    const num5 = 2 * Math.sin(a1 - a2);
    const num6 = a1_v * a1_v * l1 * (m1 + m2);
    const num7 = g * (m1 + m2) * Math.cos(a1);
    const num8 = a2_v * a2_v * l2 * m2 * Math.cos(a1 - a2);
    const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    const a2_a = (num5 * (num6 + num7 + num8)) / den2;

    // Update velocities and angles
    state.a1_v += a1_a;
    state.a2_v += a2_a;
    state.a1 += state.a1_v;
    state.a2 += state.a2_v;

    // Apply small damping
    state.a1_v *= 0.9999;
    state.a2_v *= 0.9999;

    // Calculate positions
    const x1 = cx + l1 * Math.sin(state.a1);
    const y1 = cy + l1 * Math.cos(state.a1);
    const x2 = x1 + l2 * Math.sin(state.a2);
    const y2 = y1 + l2 * Math.cos(state.a2);

    // Add to trail
    state.trail.push({ x: x2, y: y2 });
    if (state.trail.length > trailLength) {
      state.trail.shift();
    }

    // Clear canvas
    ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.1)' : 'rgba(248, 250, 252, 0.1)';
    ctx.fillRect(0, 0, w, h);

    // Draw trail
    if (state.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(state.trail[0].x, state.trail[0].y);
      
      for (let i = 1; i < state.trail.length; i++) {
        ctx.lineTo(state.trail[i].x, state.trail[i].y);
      }
      
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      if (isDark) {
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#ec4899');
      } else {
        gradient.addColorStop(0, '#2563eb');
        gradient.addColorStop(0.5, '#7c3aed');
        gradient.addColorStop(1, '#db2777');
      }
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw arms
    ctx.strokeStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw pivot
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw masses
    ctx.fillStyle = isDark ? '#f472b6' : '#db2777';
    ctx.beginPath();
    ctx.arc(x1, y1, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isDark ? '#60a5fa' : '#2563eb';
    ctx.beginPath();
    ctx.arc(x2, y2, 12, 0, Math.PI * 2);
    ctx.fill();
  });

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default DoublePendulum;
