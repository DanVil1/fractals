'use client';

import React, { useRef, useEffect } from 'react';

interface LSystemTreeProps {
  isDark: boolean;
  iterations: number;
  angleDeg: number;
}

const LSystemTree: React.FC<LSystemTreeProps> = ({ isDark, iterations, angleDeg }) => {
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

    const axiom = "F";
    const rule: Record<string, string> = { "F": "FF+[+F-F-F]-[-F+F+F]" };

    let sentence = axiom;
    for (let i = 0; i < iterations; i++) {
      let nextSentence = "";
      for (const char of sentence) {
        if (rule[char]) nextSentence += rule[char];
        else nextSentence += char;
      }
      sentence = nextSentence;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = isDark ? '#a7f3d0' : '#064e3b';

    const len = (h / 4) / (Math.pow(2, iterations) * 0.5 + 1);
    const rad = angleDeg * Math.PI / 180;

    ctx.translate(w / 2, h);
    ctx.lineWidth = 1;

    const stack: { x: number; y: number; transform: DOMMatrix }[] = [];

    for (const char of sentence) {
      if (char === "F") {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len);
        ctx.stroke();
        ctx.translate(0, -len);
      } else if (char === "+") {
        ctx.rotate(rad);
      } else if (char === "-") {
        ctx.rotate(-rad);
      } else if (char === "[") {
        stack.push({ x: 0, y: 0, transform: ctx.getTransform() });
      } else if (char === "]") {
        const state = stack.pop();
        if (state) ctx.setTransform(state.transform);
      }
    }
  }, [isDark, iterations, angleDeg]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default LSystemTree;
