'use client';

import React, { useRef, useEffect } from 'react';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';

interface BronchialTreeProps {
  depth: number;
  isBreathing: boolean;
  isDark: boolean;
}

const BronchialTree: React.FC<BronchialTreeProps> = ({ depth, isBreathing, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const scaleRef = useRef(1);
  const timeRef = useRef(0);

  useAnimationFrame((deltaTime) => {
    timeRef.current += deltaTime * 0.001;
    rotationRef.current += 0.005;
    scaleRef.current = isBreathing ? 1 + Math.sin(timeRef.current * 2) * 0.1 : 1;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const project = (x: number, y: number, z: number) => {
      const cos = Math.cos(rotationRef.current);
      const sin = Math.sin(rotationRef.current);
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const scaleFactor = 300 / (400 + rz);
      return { x: width / 2 + rx * scaleFactor, y: height / 1.2 - y * scaleFactor, s: scaleFactor };
    };

    const drawBranch = (
      x: number,
      y: number,
      z: number,
      len: number,
      angleX: number,
      angleZ: number,
      branchWidth: number,
      level: number
    ): void => {
      const p1 = project(x, y, z);
      const endX = x + Math.sin(angleZ) * Math.cos(angleX) * len * scaleRef.current;
      const endY = y + Math.cos(angleZ) * len * scaleRef.current;
      const endZ = z + Math.sin(angleZ) * Math.sin(angleX) * len * scaleRef.current;
      const p2 = project(endX, endY, endZ);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      const hue = isDark ? 180 + level * 20 : 340 - level * 20;
      const light = isDark ? 50 + level * 5 : 40;
      ctx.strokeStyle = `hsla(${hue}, 70%, ${light}%, 0.8)`;
      ctx.lineWidth = branchWidth * p1.s;
      ctx.lineCap = 'round';
      ctx.stroke();

      if (level < depth) {
        const spread = 0.5;
        drawBranch(endX, endY, endZ, len * 0.7, angleX + spread, angleZ + spread, branchWidth * 0.7, level + 1);
        drawBranch(endX, endY, endZ, len * 0.7, angleX - spread, angleZ - spread, branchWidth * 0.7, level + 1);
      }
    };

    drawBranch(0, 0, 0, 120, 0, 0, 12, 0);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default BronchialTree;
