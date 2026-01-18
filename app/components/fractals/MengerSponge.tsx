'use client';

import React, { useRef, useEffect } from 'react';
import type { Vector3D } from '../../lib/types';

interface MengerSpongeProps {
  isDark: boolean;
  depth: number;
}

const MengerSponge: React.FC<MengerSpongeProps> = ({ isDark, depth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: 0.5, y: 0.3 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Cube {
      x: number;
      y: number;
      z: number;
      size: number;
    }

    const generateMenger = (x: number, y: number, z: number, size: number, d: number): Cube[] => {
      if (d === 0) {
        return [{ x, y, z, size }];
      }

      const cubes: Cube[] = [];
      const newSize = size / 3;

      for (let dx = 0; dx < 3; dx++) {
        for (let dy = 0; dy < 3; dy++) {
          for (let dz = 0; dz < 3; dz++) {
            // Skip cubes that would be removed (center of each face and the very center)
            const zeros = (dx === 1 ? 1 : 0) + (dy === 1 ? 1 : 0) + (dz === 1 ? 1 : 0);
            if (zeros >= 2) continue;

            const nx = x + (dx - 1) * newSize;
            const ny = y + (dy - 1) * newSize;
            const nz = z + (dz - 1) * newSize;

            cubes.push(...generateMenger(nx, ny, nz, newSize, d - 1));
          }
        }
      }

      return cubes;
    };

    const rotateY = (v: Vector3D, angle: number): Vector3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: v.x * cos - v.z * sin,
        y: v.y,
        z: v.x * sin + v.z * cos
      };
    };

    const rotateX = (v: Vector3D, angle: number): Vector3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: v.x,
        y: v.y * cos - v.z * sin,
        z: v.y * sin + v.z * cos
      };
    };

    const project = (v: Vector3D, w: number, h: number): { x: number; y: number; z: number } => {
      const rotated = rotateX(rotateY(v, rotationRef.current.y), rotationRef.current.x);
      const fov = 300;
      const distance = 400;
      const scale = fov / (distance + rotated.z);
      return {
        x: w / 2 + rotated.x * scale,
        y: h / 2 + rotated.y * scale,
        z: rotated.z
      };
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

      rotationRef.current.y += 0.008;
      rotationRef.current.x += 0.003;

      const baseSize = Math.min(w, h) * 0.35;
      const cubes = generateMenger(0, 0, 0, baseSize, depth);

      // Sort by z-depth for proper rendering
      cubes.sort((a, b) => {
        const az = rotateX(rotateY({ x: a.x, y: a.y, z: a.z }, rotationRef.current.y), rotationRef.current.x).z;
        const bz = rotateX(rotateY({ x: b.x, y: b.y, z: b.z }, rotationRef.current.y), rotationRef.current.x).z;
        return az - bz;
      });

      cubes.forEach(cube => {
        const half = cube.size / 2;
        const center = project({ x: cube.x, y: cube.y, z: cube.z }, w, h);
        
        // Calculate apparent size based on depth
        const scaleFactor = 300 / (400 + center.z);
        const projSize = cube.size * scaleFactor;

        if (projSize < 1) return; // Skip tiny cubes

        // Draw as filled square with shading based on depth
        const brightness = Math.max(0.3, Math.min(1, 0.7 - center.z / 400));
        
        if (isDark) {
          ctx.fillStyle = `rgba(168, 85, 247, ${brightness})`;
          ctx.strokeStyle = `rgba(192, 132, 252, ${brightness * 0.8})`;
        } else {
          ctx.fillStyle = `rgba(126, 34, 206, ${brightness})`;
          ctx.strokeStyle = `rgba(168, 85, 247, ${brightness * 0.8})`;
        }

        ctx.fillRect(center.x - projSize / 2, center.y - projSize / 2, projSize, projSize);
        ctx.strokeRect(center.x - projSize / 2, center.y - projSize / 2, projSize, projSize);
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, depth]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default MengerSponge;
