'use client';

import React, { useRef, useEffect } from 'react';

interface KochSnowflakeProps {
  isDark: boolean;
  iterations: number;
}

const KochSnowflake: React.FC<KochSnowflakeProps> = ({ isDark, iterations }) => {
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

    const axiom = "F++F++F";
    const rules: Record<string, string> = { "F": "F-F++F-F" };

    let sentence = axiom;
    for (let i = 0; i < iterations; i++) {
      let nextSentence = "";
      for (const char of sentence) {
        if (rules[char]) nextSentence += rules[char];
        else nextSentence += char;
      }
      sentence = nextSentence;
    }

    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    let cx = 0, cy = 0, angle = 0;
    const unit = 1;
    const rad = Math.PI / 3;

    for (const char of sentence) {
      if (char === "F") {
        cx += Math.cos(angle) * unit;
        cy += Math.sin(angle) * unit;
        minX = Math.min(minX, cx);
        maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy);
        maxY = Math.max(maxY, cy);
      } else if (char === "+") {
        angle += rad;
      } else if (char === "-") {
        angle -= rad;
      }
    }

    const treeW = maxX - minX;
    const treeH = maxY - minY;
    const padding = 40;
    const scale = Math.min((w - padding * 2) / treeW, (h - padding * 2) / treeH);
    const offsetX = (w - treeW * scale) / 2 - minX * scale;
    const offsetY = (h - treeH * scale) / 2 - minY * scale;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = isDark ? '#3b82f6' : '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.translate(offsetX, offsetY);

    for (const char of sentence) {
      if (char === "F") {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(scale, 0);
        ctx.stroke();
        ctx.translate(scale, 0);
      } else if (char === "+") {
        ctx.rotate(rad);
      } else if (char === "-") {
        ctx.rotate(-rad);
      }
    }
  }, [isDark, iterations]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default KochSnowflake;
