'use client';

import React, { useRef, useEffect } from 'react';

interface ApollonianGasketProps {
  isDark: boolean;
  depth: number;
}

interface Circle {
  x: number;
  y: number;
  r: number;
  curvature: number;
}

const ApollonianGasket: React.FC<ApollonianGasketProps> = ({ isDark, depth }) => {
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

    const centerX = w / 2;
    const centerY = h / 2;
    const mainRadius = Math.min(w, h) * 0.4;

    // Store all circles to draw
    const circles: Circle[] = [];

    // Descartes' Circle Theorem: Given three mutually tangent circles with curvatures k1, k2, k3,
    // the fourth circle has curvature: k4 = k1 + k2 + k3 ± 2*sqrt(k1*k2 + k2*k3 + k3*k1)

    const descartes = (k1: number, k2: number, k3: number): [number, number] => {
      const sum = k1 + k2 + k3;
      const prod = Math.sqrt(Math.abs(k1 * k2 + k2 * k3 + k3 * k1));
      return [sum + 2 * prod, sum - 2 * prod];
    };

    // Complex Descartes to find center of new circle
    const complexDescartes = (
      c1: Circle, c2: Circle, c3: Circle, k4: number
    ): { x: number; y: number } | null => {
      // Using the complex version of Descartes' theorem
      // z4 = (z1*k1 + z2*k2 + z3*k3 ± 2*sqrt(k1*k2*z1*z2 + k2*k3*z2*z3 + k3*k1*z3*z1)) / k4
      
      const z1 = { re: c1.x * c1.curvature, im: c1.y * c1.curvature };
      const z2 = { re: c2.x * c2.curvature, im: c2.y * c2.curvature };
      const z3 = { re: c3.x * c3.curvature, im: c3.y * c3.curvature };

      const sumZ = {
        re: z1.re + z2.re + z3.re,
        im: z1.im + z2.im + z3.im
      };

      // Simplified: calculate center based on weighted average
      if (Math.abs(k4) < 0.0001) return null;

      return {
        x: sumZ.re / k4,
        y: sumZ.im / k4
      };
    };

    // Initial configuration: one large outer circle and two inner circles
    const outerCircle: Circle = {
      x: centerX,
      y: centerY,
      r: mainRadius,
      curvature: -1 / mainRadius // Negative because it contains others
    };

    // Two inner circles tangent to outer and each other
    const r2 = mainRadius / 2;
    const circle2: Circle = {
      x: centerX - mainRadius / 2,
      y: centerY,
      r: r2,
      curvature: 1 / r2
    };

    const circle3: Circle = {
      x: centerX + mainRadius / 2,
      y: centerY,
      r: r2,
      curvature: 1 / r2
    };

    // Third inner circle using Descartes
    const [k4] = descartes(outerCircle.curvature, circle2.curvature, circle3.curvature);
    const r4 = Math.abs(1 / k4);
    const circle4: Circle = {
      x: centerX,
      y: centerY - mainRadius + r4,
      r: r4,
      curvature: k4
    };

    const circle5: Circle = {
      x: centerX,
      y: centerY + mainRadius - r4,
      r: r4,
      curvature: k4
    };

    circles.push(outerCircle, circle2, circle3, circle4, circle5);

    // Recursive gasket generation
    const generateGasket = (
      c1: Circle, c2: Circle, c3: Circle, 
      currentDepth: number
    ): void => {
      if (currentDepth >= depth) return;

      const [k4a, k4b] = descartes(c1.curvature, c2.curvature, c3.curvature);

      for (const k4 of [k4a, k4b]) {
        if (!isFinite(k4)) continue;
        
        const r = Math.abs(1 / k4);
        if (r < 2 || r > mainRadius * 2) continue;

        // Find center using geometric approach
        const center = complexDescartes(c1, c2, c3, k4);
        if (!center) continue;

        // Check if this circle is valid (inside outer, not overlapping existing)
        const distFromCenter = Math.sqrt(
          (center.x - centerX) ** 2 + (center.y - centerY) ** 2
        );

        if (distFromCenter + r > mainRadius * 1.1) continue;
        if (distFromCenter - r < -mainRadius * 0.1 && k4 > 0) continue;

        // Check for duplicates
        const isDuplicate = circles.some(c => 
          Math.abs(c.x - center.x) < 1 && 
          Math.abs(c.y - center.y) < 1 &&
          Math.abs(c.r - r) < 1
        );

        if (isDuplicate) continue;

        const newCircle: Circle = {
          x: center.x,
          y: center.y,
          r,
          curvature: k4
        };

        circles.push(newCircle);

        // Recurse with new circle combinations
        generateGasket(c1, c2, newCircle, currentDepth + 1);
        generateGasket(c1, c3, newCircle, currentDepth + 1);
        generateGasket(c2, c3, newCircle, currentDepth + 1);
      }
    };

    // Generate the gasket
    generateGasket(outerCircle, circle2, circle3, 0);
    generateGasket(outerCircle, circle2, circle4, 0);
    generateGasket(outerCircle, circle3, circle4, 0);
    generateGasket(circle2, circle3, circle4, 0);
    generateGasket(outerCircle, circle2, circle5, 0);
    generateGasket(outerCircle, circle3, circle5, 0);
    generateGasket(circle2, circle3, circle5, 0);

    // Draw all circles
    circles.forEach((circle, i) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, Math.max(1, circle.r), 0, Math.PI * 2);
      
      const hue = (i * 37) % 360;
      if (isDark) {
        ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.1)`;
      } else {
        ctx.strokeStyle = `hsl(${hue}, 60%, 40%)`;
        ctx.fillStyle = `hsla(${hue}, 60%, 40%, 0.05)`;
      }
      
      ctx.lineWidth = circle.r > 10 ? 2 : 1;
      ctx.fill();
      ctx.stroke();
    });

  }, [isDark, depth]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default ApollonianGasket;
