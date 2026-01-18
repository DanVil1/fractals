'use client';

import React, { useRef, useEffect } from 'react';
import type { Vector3D } from '../../lib/types';
import { rodriguesRotate } from '../../lib/math';

interface SierpinskiTetrahedronProps {
  isDark: boolean;
  depth: number;
  axisX: number;
  axisY: number;
  axisZ: number;
}

const SierpinskiTetrahedron: React.FC<SierpinskiTetrahedronProps> = ({ isDark, depth, axisX, axisY, axisZ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const r = 200;
    const initialVertices: Vector3D[] = [
      { x: r, y: r, z: r },
      { x: -r, y: -r, z: r },
      { x: -r, y: r, z: -r },
      { x: r, y: -r, z: -r }
    ];

    const project = (v: Vector3D): { x: number; y: number } => {
      const fov = 400;
      const distance = 500;
      let len = Math.sqrt(axisX * axisX + axisY * axisY + axisZ * axisZ);
      if (len === 0) len = 1;
      const k = { x: axisX / len, y: axisY / len, z: axisZ / len };
      const rv = rodriguesRotate(v, k, rotationRef.current);
      const scale = fov / (distance + rv.z);
      return { x: canvas.width / 2 + rv.x * scale, y: canvas.height / 2 + rv.y * scale };
    };

    const drawTetra = (vertices: Vector3D[]): void => {
      const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
      const p2d = vertices.map(project);
      ctx.beginPath();
      edges.forEach(([i, j]) => {
        ctx.moveTo(p2d[i].x, p2d[i].y);
        ctx.lineTo(p2d[j].x, p2d[j].y);
      });
      ctx.stroke();
    };

    const mid = (p1: Vector3D, p2: Vector3D): Vector3D => ({
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
      z: (p1.z + p2.z) / 2
    });

    const generate = (v: Vector3D[], d: number): void => {
      if (d === 0) {
        drawTetra(v);
        return;
      }
      const m01 = mid(v[0], v[1]);
      const m02 = mid(v[0], v[2]);
      const m03 = mid(v[0], v[3]);
      const m12 = mid(v[1], v[2]);
      const m13 = mid(v[1], v[3]);
      const m23 = mid(v[2], v[3]);

      generate([v[0], m01, m02, m03], d - 1);
      generate([m01, v[1], m12, m13], d - 1);
      generate([m02, m12, v[2], m23], d - 1);
      generate([m03, m13, m23, v[3]], d - 1);
    };

    const render = (): void => {
      const parent = canvas.parentElement;
      if (parent && canvas.width !== parent.clientWidth) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = isDark ? '#a855f7' : '#7e22ce';
      ctx.lineWidth = 1;

      rotationRef.current += 0.01;
      generate(initialVertices, depth);

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, depth, axisX, axisY, axisZ]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default SierpinskiTetrahedron;
