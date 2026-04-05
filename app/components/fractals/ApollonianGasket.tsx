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
  k: number; // curvature = 1/r, negative for the outer bounding circle
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

    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.4;

    const allCircles: Circle[] = [];

    // Initial configuration: outer bounding circle + 2 equal inner circles
    const outer: Circle = { x: cx, y: cy, r: R, k: -1 / R };
    const c2: Circle = { x: cx - R / 2, y: cy, r: R / 2, k: 2 / R };
    const c3: Circle = { x: cx + R / 2, y: cy, r: R / 2, k: 2 / R };

    // Descartes theorem for curvature of the two circles filling the top/bottom gaps
    const k4 = outer.k + c2.k + c3.k + 2 * Math.sqrt(
      outer.k * c2.k + c2.k * c3.k + outer.k * c3.k
    );
    const r4 = Math.abs(1 / k4);

    const c4: Circle = { x: cx, y: cy - 2 * R / 3, r: r4, k: k4 };
    const c5: Circle = { x: cx, y: cy + 2 * R / 3, r: r4, k: k4 };

    allCircles.push(outer, c2, c3, c4, c5);

    // Dual Descartes: given four mutually tangent circles (ca, cb, cc, cOld),
    // find the OTHER circle tangent to ca, cb, cc (that is not cOld).
    // k_new = 2*(ka + kb + kc) - k_old
    // center via complex Descartes: w = z * k, then w_new = 2*(wa+wb+wc) - w_old
    const fillGap = (
      ca: Circle, cb: Circle, cc: Circle, cOld: Circle,
      currentDepth: number
    ): void => {
      if (currentDepth >= depth) return;

      const kNew = 2 * (ca.k + cb.k + cc.k) - cOld.k;
      if (!isFinite(kNew) || kNew <= 0) return;

      const rNew = 1 / kNew;
      if (rNew < 0.5) return;

      const wNewRe = 2 * (ca.x * ca.k + cb.x * cb.k + cc.x * cc.k) - cOld.x * cOld.k;
      const wNewIm = 2 * (ca.y * ca.k + cb.y * cb.k + cc.y * cc.k) - cOld.y * cOld.k;

      const xNew = wNewRe / kNew;
      const yNew = wNewIm / kNew;

      if (!isFinite(xNew) || !isFinite(yNew)) return;

      const cNew: Circle = { x: xNew, y: yNew, r: rNew, k: kNew };
      allCircles.push(cNew);

      // Each new circle creates 3 new gaps
      fillGap(cb, cc, cNew, ca, currentDepth + 1);
      fillGap(ca, cc, cNew, cb, currentDepth + 1);
      fillGap(ca, cb, cNew, cc, currentDepth + 1);
    };

    // Top half: {outer, c2, c3, c4} are mutually tangent → 3 gaps
    fillGap(outer, c2, c4, c3, 0);
    fillGap(outer, c3, c4, c2, 0);
    fillGap(c2, c3, c4, outer, 0);

    // Bottom half: {outer, c2, c3, c5} are mutually tangent → 3 gaps
    fillGap(outer, c2, c5, c3, 0);
    fillGap(outer, c3, c5, c2, 0);
    fillGap(c2, c3, c5, outer, 0);

    // Draw all circles
    allCircles.forEach((circle, i) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, Math.max(0.5, circle.r), 0, Math.PI * 2);

      const hue = (i * 37) % 360;
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.1)`;
      ctx.lineWidth = circle.r > 10 ? 2 : 1;
      ctx.fill();
      ctx.stroke();
    });

  }, [isDark, depth]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default ApollonianGasket;
