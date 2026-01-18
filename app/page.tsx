'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, Moon, Sun, ArrowLeft, Layers, Activity, Sprout, Aperture, Flower, Infinity, GitBranch, Shapes, Triangle, Rotate3D, CloudFog, Zap, Snowflake, Eye, Hourglass } from 'lucide-react';

// --- TYPES ---

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

interface CircleData {
  cx: number;
  cy: number;
  key: string;
}

interface Particle {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  life?: number;
  rotation?: number;
}

interface LineData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface TreeData {
  lines: LineData[];
  spawns: { x: number; y: number }[];
  minX: number;
  minY: number;
  width: number;
  height: number;
}

interface FractalInfo {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  desc: string;
}

// --- UTILS & HOOKS ---

const useAnimationFrame = (callback: (deltaTime: number) => void): void => {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);

  const animate = (time: number): void => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);
};

// --- MATH HELPERS ---

const rodriguesRotate = (v: Vector3D, k: Vector3D, theta: number): Vector3D => {
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const dot = k.x * v.x + k.y * v.y + k.z * v.z;
  const crossX = k.y * v.z - k.z * v.y;
  const crossY = k.z * v.x - k.x * v.z;
  const crossZ = k.x * v.y - k.y * v.x;
  return {
    x: v.x * cosT + crossX * sinT + k.x * dot * (1 - cosT),
    y: v.y * cosT + crossY * sinT + k.y * dot * (1 - cosT),
    z: v.z * cosT + crossZ * sinT + k.z * dot * (1 - cosT)
  };
};

// --- FRACTAL COMPONENTS ---

interface FlowerOfLifeProps {
  layers: number;
  zoom: number;
  isDark: boolean;
}

const FlowerOfLife: React.FC<FlowerOfLifeProps> = ({ layers, zoom, isDark }) => {
  const radius = 30;

  const generateCircles = (): CircleData[] => {
    const results: CircleData[] = [];
    results.push({ cx: 0, cy: 0, key: 'center' });

    if (layers >= 1) {
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * (Math.PI / 180);
        results.push({
          cx: Math.cos(angle) * radius,
          cy: Math.sin(angle) * radius,
          key: `l1-${i}`
        });
      }
    }

    if (layers >= 2) {
      for (let ring = 2; ring <= layers; ring++) {
        for (let i = 0; i < 6; i++) {
          const angle = (i * 60) * (Math.PI / 180);
          results.push({
            cx: Math.cos(angle) * radius * ring,
            cy: Math.sin(angle) * radius * ring,
            key: `r${ring}-tip-${i}`
          });

          for (let j = 1; j < ring; j++) {
            const angleNext = ((i + 1) * 60) * (Math.PI / 180);
            const ratio = j / ring;
            const startX = Math.cos(angle) * radius * ring;
            const startY = Math.sin(angle) * radius * ring;
            const endX = Math.cos(angleNext) * radius * ring;
            const endY = Math.sin(angleNext) * radius * ring;
            results.push({
              cx: startX + (endX - startX) * ratio,
              cy: startY + (endY - startY) * ratio,
              key: `r${ring}-edge-${i}-${j}`
            });
          }
        }
      }
    }

    return results;
  };

  const data = generateCircles();

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden cursor-move">
      <svg
        viewBox="-200 -200 400 400"
        className="w-full h-full transition-transform duration-100 ease-linear"
        style={{ transform: `scale(${zoom})` }}
      >
        <g>
          {data.map((c) => (
            <circle
              key={c.key}
              cx={c.cx}
              cy={c.cy}
              r={radius}
              fill="none"
              stroke={isDark ? "cyan" : "#e11d48"}
              strokeWidth="1.5"
              className="opacity-60 mix-blend-screen transition-all duration-500"
            />
          ))}
          <circle
            cx={0}
            cy={0}
            r={radius * (layers + 1)}
            fill="none"
            stroke={isDark ? "white" : "black"}
            strokeWidth="2"
            strokeDasharray="5,5"
            className="opacity-30"
          />
        </g>
      </svg>
    </div>
  );
};

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

interface ChladniPlateProps {
  frequency: number;
  isDark: boolean;
}

const ChladniPlate: React.FC<ChladniPlateProps> = ({ frequency, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    particlesRef.current = Array.from({ length: 3000 }, () => ({
      x: Math.random(),
      y: Math.random()
    }));
  }, []);

  const getChladniValue = (x: number, y: number, n: number, m: number): number =>
    Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) -
    Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const n = 1 + Math.floor(frequency / 100);
    const m = 2 + Math.floor(frequency / 150);
    const stochasticAmplitude = 0.01;

    const render = (): void => {
      const parent = canvas.parentElement;
      if (parent && canvas.width !== parent.clientWidth) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = isDark ? 'rgba(20,20,25, 0.2)' : 'rgba(255,255,255, 0.2)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = isDark ? '#fbbf24' : '#1e3a8a';

      particlesRef.current.forEach(p => {
        const val = getChladniValue(p.x, p.y, n, m);
        const shake = Math.abs(val) * stochasticAmplitude;
        p.x += (Math.random() - 0.5) * shake;
        p.y += (Math.random() - 0.5) * shake;

        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        ctx.fillRect(p.x * w, p.y * h, 1.5, 1.5);
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [frequency, isDark]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 font-mono text-xs bg-black/20 p-1 rounded">
        n={1 + Math.floor(frequency / 100)}, m={2 + Math.floor(frequency / 150)}
      </div>
    </div>
  );
};

interface BarnsleyFernProps {
  isDark: boolean;
  density?: number;
}

const BarnsleyFern: React.FC<BarnsleyFernProps> = ({ isDark, density = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const pointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    pointRef.current = { x: 0, y: 0 };
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const renderBatch = (): void => {
      const w = canvas.width;
      const h = canvas.height;
      const scale = Math.min(w, h) / 12;

      ctx.fillStyle = isDark ? '#4ade80' : '#15803d';
      const pointsPerFrame = 50 * density;

      for (let i = 0; i < pointsPerFrame; i++) {
        const { x, y } = pointRef.current;
        let nextX: number;
        let nextY: number;
        const r = Math.random();

        if (r < 0.01) {
          nextX = 0;
          nextY = 0.16 * y;
        } else if (r < 0.86) {
          nextX = 0.85 * x + 0.04 * y;
          nextY = -0.04 * x + 0.85 * y + 1.6;
        } else if (r < 0.93) {
          nextX = 0.2 * x - 0.26 * y;
          nextY = 0.23 * x + 0.22 * y + 1.6;
        } else {
          nextX = -0.15 * x + 0.28 * y;
          nextY = 0.26 * x + 0.24 * y + 0.44;
        }

        pointRef.current = { x: nextX, y: nextY };
        const plotX = w / 2 + nextX * scale;
        const plotY = h - nextY * scale;
        ctx.fillRect(plotX, plotY, 1, 1);
      }

      animationRef.current = requestAnimationFrame(renderBatch);
    };

    renderBatch();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, density]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

interface PhyllotaxisProps {
  isDark: boolean;
  spacing?: number;
  size?: number;
}

const Phyllotaxis: React.FC<PhyllotaxisProps> = ({ spacing = 4, size = 2 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (): void => {
      const parent = canvas.parentElement;
      if (parent && canvas.width !== parent.clientWidth) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      const count = 1500;
      const goldenAngle = 137.5 * (Math.PI / 180);

      for (let n = 0; n < count; n++) {
        const r = spacing * Math.sqrt(n);
        const theta = n * goldenAngle;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const hue = (n * 0.5 + frameRef.current) % 360;

        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      frameRef.current += 1;
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [spacing, size]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

interface MaurerRoseProps {
  isDark: boolean;
  n?: number;
  d?: number;
}

const MaurerRose: React.FC<MaurerRoseProps> = ({ isDark, n = 6, d = 71 }) => {
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
    ctx.translate(w / 2, h / 2);

    const scale = Math.min(w, h) / 2.5;

    // Draw Maurer rose lines
    ctx.strokeStyle = isDark ? 'rgba(236, 72, 153, 0.6)' : 'rgba(219, 39, 119, 0.6)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    for (let i = 0; i <= 360; i++) {
      const k = i * d * Math.PI / 180;
      const r = Math.sin(n * k) * scale;
      const x = r * Math.cos(k);
      const y = r * Math.sin(k);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw rose curve
    ctx.strokeStyle = isDark ? '#fff' : '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i <= 360; i++) {
      const k = i * Math.PI / 180;
      const r = Math.sin(n * k) * scale;
      const x = r * Math.cos(k);
      const y = r * Math.sin(k);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [isDark, n, d]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

interface LorenzAttractorProps {
  isDark: boolean;
  speed?: number;
}

const LorenzAttractor: React.FC<LorenzAttractorProps> = ({ isDark, speed = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const posRef = useRef({ x: 0.1, y: 0, z: 0 });
  const pointsRef = useRef<Vector3D[]>([]);

  useEffect(() => {
    posRef.current = { x: 0.1, y: 0, z: 0 };
    pointsRef.current = [];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sigma = 10;
    const rho = 28;
    const beta = 8 / 3;

    const render = (): void => {
      const parent = canvas.parentElement;
      if (parent && canvas.width !== parent.clientWidth) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;
      const scale = 8;
      const dt = 0.01 * speed;

      let { x, y, z } = posRef.current;

      for (let i = 0; i < 5; i++) {
        const dx = (sigma * (y - x)) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx;
        y += dy;
        z += dz;
        pointsRef.current.push({ x, y, z });
      }

      posRef.current = { x, y, z };

      if (pointsRef.current.length > 2000) {
        pointsRef.current.splice(0, 10);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.beginPath();

      pointsRef.current.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * scale, -p.z * scale + 200);
        else ctx.lineTo(p.x * scale, -p.z * scale + 200);
      });

      ctx.strokeStyle = isDark ? '#f472b6' : '#db2777';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, speed]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

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

interface WindyPlantProps {
  isDark: boolean;
  iterations: number;
  angleDeg: number;
}

interface WindyParticle extends Particle {
  vx: number;
  vy: number;
  life: number;
  rotation: number;
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

interface SuperformulaShapeProps {
  isDark: boolean;
  m: number;
  n1: number;
  n2: number;
  n3: number;
}

const SuperformulaShape: React.FC<SuperformulaShapeProps> = ({ isDark, m, n1, n2, n3 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (): void => {
      const parent = canvas.parentElement;
      if (parent && canvas.width !== parent.clientWidth) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      const scale = Math.min(w, h) / 2.5;

      ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = 2;

      timeRef.current += 0.005;
      ctx.rotate(timeRef.current);

      ctx.beginPath();

      const a = 1;
      const b = 1;
      const totalPoints = 360 * 2;

      for (let i = 0; i <= totalPoints; i++) {
        const phi = (i / 360) * Math.PI * 2;
        const part1 = Math.pow(Math.abs(Math.cos(m * phi / 4) / a), n2);
        const part2 = Math.pow(Math.abs(Math.sin(m * phi / 4) / b), n3);
        const r = Math.pow(part1 + part2, -1 / n1);

        if (isFinite(r)) {
          const x = r * Math.cos(phi) * scale;
          const y = r * Math.sin(phi) * scale;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(2, 132, 199, 0.1)';
      ctx.fill();
      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, m, n1, n2, n3]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

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

interface DragonCurveProps {
  isDark: boolean;
  iterations: number;
}

const DragonCurve: React.FC<DragonCurveProps> = ({ isDark, iterations }) => {
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

    const axiom = "FX";
    const rules: Record<string, string> = { "X": "X+YF+", "Y": "-FX-Y" };

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

    for (const char of sentence) {
      if (char === "F") {
        cx += Math.cos(angle) * unit;
        cy += Math.sin(angle) * unit;
        minX = Math.min(minX, cx);
        maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy);
        maxY = Math.max(maxY, cy);
      } else if (char === "+") {
        angle += Math.PI / 2;
      } else if (char === "-") {
        angle -= Math.PI / 2;
      }
    }

    const treeW = maxX - minX;
    const treeH = maxY - minY;
    const padding = 40;
    const scale = Math.min((w - padding * 2) / treeW, (h - padding * 2) / treeH);
    const offsetX = (w - treeW * scale) / 2 - minX * scale;
    const offsetY = (h - treeH * scale) / 2 - minY * scale;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = isDark ? '#ef4444' : '#dc2626';
    ctx.lineWidth = iterations > 12 ? 1 : 2;
    ctx.lineCap = "round";
    ctx.translate(offsetX, offsetY);

    for (const char of sentence) {
      if (char === "F") {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(scale, 0);
        ctx.stroke();
        ctx.translate(scale, 0);
      } else if (char === "+") {
        ctx.rotate(Math.PI / 2);
      } else if (char === "-") {
        ctx.rotate(-Math.PI / 2);
      }
    }
  }, [isDark, iterations]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

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

interface JuliaSetProps {
  isDark: boolean;
  cRe: number;
  cIm: number;
}

const JuliaSet: React.FC<JuliaSetProps> = ({ isDark, cRe, cIm }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderW = 300;
    const renderH = 300;
    canvas.width = renderW;
    canvas.height = renderH;

    const imgData = ctx.createImageData(renderW, renderH);
    const data = imgData.data;
    const maxIter = 50;
    const zoom = 1;

    for (let y = 0; y < renderH; y++) {
      for (let x = 0; x < renderW; x++) {
        let zx = 1.5 * (x - renderW / 2) / (0.5 * zoom * renderW);
        let zy = (y - renderH / 2) / (0.5 * zoom * renderH);
        let i = 0;

        while (zx * zx + zy * zy < 4 && i < maxIter) {
          const xtemp = zx * zx - zy * zy + cRe;
          zy = 2 * zx * zy + cIm;
          zx = xtemp;
          i++;
        }

        const pIndex = (y * renderW + x) * 4;

        if (i === maxIter) {
          data[pIndex] = 0;
          data[pIndex + 1] = 0;
          data[pIndex + 2] = 0;
          data[pIndex + 3] = 255;
        } else {
          const t = i / maxIter;
          const r = 9 * (1 - t) * t * t * 255;
          const g = 15 * (1 - t) * (1 - t) * t * 255;
          const b = 8.5 * (1 - t) * (1 - t) * (1 - t) * 255;

          if (isDark) {
            data[pIndex] = r * 2 + 50;
            data[pIndex + 1] = g * 4 + 20;
            data[pIndex + 2] = b * 10 + 100;
          } else {
            data[pIndex] = r * 3;
            data[pIndex + 1] = g * 3;
            data[pIndex + 2] = b * 6 + 50;
          }
          data[pIndex + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [isDark, cRe, cIm]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: 'pixelated' }} />;
};

// --- LIFECYCLE FLOWER COMPONENT ---

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


// --- MAIN APP ---

export default function FractalGallery() {
  const [activeFractal, setActiveFractal] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  // Controls State
  const [flowerLayers, setFlowerLayers] = useState(3);
  const [flowerZoom, setFlowerZoom] = useState(1);
  const [bronchialDepth, setBronchialDepth] = useState(4);
  const [bronchialBreathe, setBronchialBreathe] = useState(true);
  const [chladniFreq, setChladniFreq] = useState(250);
  const [barnsleyDensity, setBarnsleyDensity] = useState(20);
  const [phylloSpacing, setPhylloSpacing] = useState(6);
  const [phylloSize, setPhylloSize] = useState(2);
  const [maurerN, setMaurerN] = useState(6);
  const [maurerD, setMaurerD] = useState(71);
  const [lorenzSpeed, setLorenzSpeed] = useState(1);
  const [lsystemIter, setLsystemIter] = useState(4);
  const [lsystemAngle, setLsystemAngle] = useState(25);
  const [superM, setSuperM] = useState(6);
  const [superN1, setSuperN1] = useState(1);
  const [superN2, setSuperN2] = useState(1);
  const [superN3, setSuperN3] = useState(1);
  const [sierpinskiDepth, setSierpinskiDepth] = useState(3);
  const [axisX, setAxisX] = useState(1);
  const [axisY, setAxisY] = useState(1);
  const [axisZ, setAxisZ] = useState(0);
  const [windyIter, setWindyIter] = useState(5);
  const [windyAngle, setWindyAngle] = useState(22);
  const [dragonIter, setDragonIter] = useState(10);
  const [kochIter, setKochIter] = useState(4);
  const [juliaCre, setJuliaCre] = useState(-0.7);
  const [juliaCim, setJuliaCim] = useState(0.27015);

  // Lifecycle State
  const [lifeSpeed, setLifeSpeed] = useState(1);

  const themeClasses = isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900";
  const cardClasses = isDark ? "bg-slate-800 hover:bg-slate-700 border-slate-700" : "bg-white hover:bg-slate-100 border-slate-200 shadow-sm";
  const controlPanelClasses = isDark ? "bg-slate-800 border-l border-slate-700" : "bg-white border-l border-slate-200";

  const fractals: FractalInfo[] = [
    { id: 'flower', title: 'Flor de la Vida', subtitle: 'Geometría Sagrada', icon: Layers, color: "text-pink-500", desc: "Patrón de círculos superpuestos que representa las formas fundamentales del espacio." },
    { id: 'bronchial', title: 'Bronquios', subtitle: 'Biomímesis', icon: Activity, color: "text-teal-500", desc: "Estructuras ramificadas recursivas similares a los pulmones." },
    { id: 'lsystem', title: 'Sistema-L', subtitle: 'Árbol Algorítmico', icon: GitBranch, color: "text-emerald-500", desc: "Reglas básicas de reescritura de texto para simular árboles simples." },
    { id: 'windy', title: 'Planta de Viento', subtitle: 'Simulación Avanzada', icon: CloudFog, color: "text-lime-500", desc: "Un sistema-L complejo donde las reglas crean la ilusión de follaje denso arrastrado por el viento." },
    { id: 'dragon', title: 'Curva del Dragón', subtitle: 'Fractal de Heighway', icon: Zap, color: "text-red-500", desc: "Famoso fractal de auto-similitud que rellena el espacio mediante pliegues de 90 grados." },
    { id: 'koch', title: 'Copo de Nieve', subtitle: 'Fractal de Koch', icon: Snowflake, color: "text-blue-500", desc: "Una de las primeras curvas fractales descritas. Se construye iterativamente añadiendo triángulos equiláteros." },
    { id: 'julia', title: 'Conjunto de Julia', subtitle: 'Dinámica Compleja', icon: Eye, color: "text-indigo-400", desc: "Fractal generado iterando números complejos. Cada punto representa un comportamiento caótico o estable." },
    { id: 'lifecycle', title: 'Ciclo de Vida', subtitle: 'Simulación Paramétrica', icon: Hourglass, color: "text-rose-400", desc: "Modelo abstracto del ciclo vital usando ecuaciones polares para los pétalos y filotaxis para el centro, afectadas por entropía simulada." },
    { id: 'sierpinski', title: 'Tetraedro Sierpinski', subtitle: 'Rotación 3D Rodrigues', icon: Triangle, color: "text-purple-500", desc: "Fractal 3D que demuestra rotación alrededor de ejes arbitrarios." },
    { id: 'superformula', title: 'Superfórmula', subtitle: 'Formas de Gielis', icon: Shapes, color: "text-sky-500", desc: "Ecuación polar que describe formas biológicas complejas." },
    { id: 'chladni', title: 'Figuras Chladni', subtitle: 'Cimática', icon: Activity, color: "text-amber-500", desc: "Patrones modales en una placa vibratoria." },
    { id: 'barnsley', title: 'Helecho Barnsley', subtitle: 'Naturaleza Matemática', icon: Sprout, color: "text-green-500", desc: "Fractal IFS que replica un helecho." },
    { id: 'phyllo', title: 'Filotaxis', subtitle: 'Ángulo Dorado', icon: Aperture, color: "text-indigo-500", desc: "Disposición espiral basada en el ángulo áureo." },
    { id: 'maurer', title: 'Rosa de Maurer', subtitle: 'Geometría Floral', icon: Flower, color: "text-rose-500", desc: "Curvas polares matemáticas." },
    { id: 'lorenz', title: 'Atractor de Lorenz', subtitle: 'Teoría del Caos', icon: Infinity, color: "text-fuchsia-500", desc: "El famoso Efecto Mariposa." }
  ];

  const handleExport = (): void => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `fractal-${activeFractal}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className={`w-full h-screen flex flex-col transition-colors duration-300 ${themeClasses} font-sans overflow-hidden`}>
      <header className={`h-16 flex items-center justify-between px-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveFractal(null)}>
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">F</span></div>
            <h1 className="text-xl font-bold tracking-tight">Fractal<span className="opacity-50">Gallery</span></h1>
        </div>
        <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-slate-700/20 transition-colors">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
      </header>
      <main className="flex-1 flex overflow-hidden relative">
        {!activeFractal && (
          <div className="w-full p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8"><h2 className="text-3xl font-bold mb-2">Colección</h2><p className="opacity-60">Explora la belleza matemática.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                    {fractals.map((f) => {
                        const IconComponent = f.icon;
                        return (
                            <div key={f.id} onClick={() => setActiveFractal(f.id)} className={`aspect-square rounded-2xl border p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02] group ${cardClasses}`}>
                                <div className="flex-1 flex items-center justify-center w-full">
                                    <div className="group-hover:scale-110 transition-transform duration-300">
                                        <IconComponent size={40} className={`mb-4 ${f.color}`} />
                                    </div>
                                </div>
                                <div className="w-full"><h3 className="text-xl font-bold">{f.title}</h3><p className="text-sm opacity-50 uppercase tracking-wider mb-2">{f.subtitle}</p><p className="text-sm opacity-70 line-clamp-3">{f.desc}</p></div>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>
        )}
        {activeFractal && (
            <>
                <div className="flex-1 relative bg-black/5 overflow-hidden flex items-center justify-center">
                     {activeFractal === 'flower' && <FlowerOfLife layers={flowerLayers} zoom={flowerZoom} isDark={isDark} />}
                     {activeFractal === 'bronchial' && <BronchialTree depth={bronchialDepth} isBreathing={bronchialBreathe} isDark={isDark} />}
                     {activeFractal === 'chladni' && <ChladniPlate frequency={chladniFreq} isDark={isDark} />}
                     {activeFractal === 'barnsley' && <BarnsleyFern isDark={isDark} density={barnsleyDensity} />}
                     {activeFractal === 'phyllo' && <Phyllotaxis isDark={isDark} spacing={phylloSpacing} size={phylloSize} />}
                     {activeFractal === 'maurer' && <MaurerRose isDark={isDark} n={maurerN} d={maurerD} />}
                     {activeFractal === 'lorenz' && <LorenzAttractor isDark={isDark} speed={lorenzSpeed} />}
                     {activeFractal === 'lsystem' && <LSystemTree isDark={isDark} iterations={lsystemIter} angleDeg={lsystemAngle} />}
                     {activeFractal === 'windy' && <WindyPlant isDark={isDark} iterations={windyIter} angleDeg={windyAngle} />}
                     {activeFractal === 'dragon' && <DragonCurve isDark={isDark} iterations={dragonIter} />}
                     {activeFractal === 'koch' && <KochSnowflake isDark={isDark} iterations={kochIter} />}
                     {activeFractal === 'julia' && <JuliaSet isDark={isDark} cRe={juliaCre} cIm={juliaCim} />}
                     {activeFractal === 'lifecycle' && <LifecycleFlower isDark={isDark} speed={lifeSpeed} />}
                     {activeFractal === 'superformula' && <SuperformulaShape isDark={isDark} m={superM} n1={superN1} n2={superN2} n3={superN3} />}
                     {activeFractal === 'sierpinski' && <SierpinskiTetrahedron isDark={isDark} depth={sierpinskiDepth} axisX={axisX} axisY={axisY} axisZ={axisZ} />}
                     <button onClick={() => setActiveFractal(null)} className="absolute top-6 left-6 p-3 rounded-full bg-black/10 backdrop-blur hover:bg-black/20 transition-all border border-white/10 text-inherit"><ArrowLeft size={20} /></button>
                </div>
                <div className={`w-80 flex flex-col z-10 ${controlPanelClasses} shadow-xl`}>
                    <div className="p-6 border-b border-inherit"><h2 className="text-xl font-bold mb-1">{fractals.find(f => f.id === activeFractal)?.title}</h2><p className="text-xs opacity-50 uppercase tracking-widest">Configuración</p></div>
                    <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                        {activeFractal === 'flower' && ( <>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Capas</label><span className="text-xs opacity-70">{flowerLayers}</span></div><input type="range" min="1" max="7" step="1" value={flowerLayers} onChange={(e) => setFlowerLayers(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-pink-500" /></div>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Zoom</label></div><input type="range" min="0.5" max="2.5" step="0.1" value={flowerZoom} onChange={(e) => setFlowerZoom(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-pink-500" /></div> </> )}
                        {activeFractal === 'bronchial' && ( <>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Profundidad</label><span className="text-xs opacity-70">{bronchialDepth}</span></div><input type="range" min="1" max="6" step="1" value={bronchialDepth} onChange={(e) => setBronchialDepth(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-teal-500" /></div>
                                <div className="flex items-center justify-between pt-4"><label className="text-sm font-medium">Animación Respiración</label><button onClick={() => setBronchialBreathe(!bronchialBreathe)} className={`w-12 h-6 rounded-full transition-colors relative ${bronchialBreathe ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${bronchialBreathe ? 'left-7' : 'left-1'}`} /></button></div> </> )}
                        {activeFractal === 'lsystem' && ( <>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Iteraciones</label><span className="text-xs opacity-70">{lsystemIter}</span></div><input type="range" min="1" max="5" step="1" value={lsystemIter} onChange={(e) => setLsystemIter(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-emerald-500" /></div>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Ángulo</label><span className="text-xs opacity-70">{lsystemAngle}°</span></div><input type="range" min="10" max="60" step="1" value={lsystemAngle} onChange={(e) => setLsystemAngle(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-emerald-500" /></div> </> )}
                        {activeFractal === 'windy' && ( <>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Iteraciones</label><span className="text-xs opacity-70">{windyIter}</span></div><input type="range" min="1" max="6" step="1" value={windyIter} onChange={(e) => setWindyIter(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-lime-500" /></div>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Ángulo de Viento</label><span className="text-xs opacity-70">{windyAngle}°</span></div><input type="range" min="10" max="45" step="1" value={windyAngle} onChange={(e) => setWindyAngle(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-lime-500" /></div>
                                <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">Regla Compleja: X → F+[[X]-X]-F[-FX]+X. Esta regla genera la auto-similitud "doblada".</div> </> )}
                        {activeFractal === 'dragon' && ( <>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Iteraciones</label><span className="text-xs opacity-70">{dragonIter}</span></div><input type="range" min="1" max="14" step="1" value={dragonIter} onChange={(e) => setDragonIter(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-red-500" /></div>
                                <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">La curva del dragón es un fractal de relleno de espacio que utiliza reglas de pliegue recursivas.</div> </> )}
                        {activeFractal === 'koch' && ( <>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Iteraciones</label><span className="text-xs opacity-70">{kochIter}</span></div><input type="range" min="0" max="6" step="1" value={kochIter} onChange={(e) => setKochIter(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-500" /></div>
                                <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">El copo de nieve se forma empezando con un triángulo y añadiendo triángulos más pequeños en cada lado recursivamente.</div> </> )}
                        {activeFractal === 'julia' && ( <>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Real (Re)</label><span className="text-xs opacity-70">{juliaCre.toFixed(3)}</span></div><input type="range" min="-1.5" max="1.5" step="0.01" value={juliaCre} onChange={(e) => setJuliaCre(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-400" /></div>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Imaginario (Im)</label><span className="text-xs opacity-70">{juliaCim.toFixed(3)}</span></div><input type="range" min="-1.5" max="1.5" step="0.01" value={juliaCim} onChange={(e) => setJuliaCim(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-400" /></div>
                                <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">Explora valores interesantes: <br/>-0.4 + 0.6i (Dendrita)<br/>-0.8 + 0.156i (Espiral)</div> </> )}
                        {activeFractal === 'lifecycle' && ( <>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Velocidad del Ciclo</label><span className="text-xs opacity-70">{lifeSpeed}x</span></div><input type="range" min="0.5" max="3" step="0.5" value={lifeSpeed} onChange={(e) => setLifeSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-rose-400" /></div>
                                <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">Simulación matemática usando curvas logísticas para el crecimiento y funciones de decaimiento para el marchitamiento.</div> </> )}
                        {activeFractal === 'sierpinski' && ( <>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Profundidad</label><span className="text-xs opacity-70">{sierpinskiDepth}</span></div><input type="range" min="1" max="5" step="1" value={sierpinskiDepth} onChange={(e) => setSierpinskiDepth(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-purple-500" /></div>
                                <div className="p-4 bg-black/5 rounded-lg space-y-3"><div className="flex items-center gap-2 mb-2"><Rotate3D size={16} /><span className="text-xs font-bold uppercase tracking-wider">Eje de Rotación</span></div>
                                <div className="space-y-1"><div className="flex justify-between text-xs"><span>X</span><span>{axisX}</span></div><input type="range" min="-1" max="1" step="0.1" value={axisX} onChange={e => setAxisX(parseFloat(e.target.value))} className="w-full h-1 bg-slate-300 rounded-lg cursor-pointer" /></div>
                                <div className="space-y-1"><div className="flex justify-between text-xs"><span>Y</span><span>{axisY}</span></div><input type="range" min="-1" max="1" step="0.1" value={axisY} onChange={e => setAxisY(parseFloat(e.target.value))} className="w-full h-1 bg-slate-300 rounded-lg cursor-pointer" /></div>
                                <div className="space-y-1"><div className="flex justify-between text-xs"><span>Z</span><span>{axisZ}</span></div><input type="range" min="-1" max="1" step="0.1" value={axisZ} onChange={e => setAxisZ(parseFloat(e.target.value))} className="w-full h-1 bg-slate-300 rounded-lg cursor-pointer" /></div></div> </> )}
                        {activeFractal === 'superformula' && ( <>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Puntas (m)</label><span className="text-xs opacity-70">{superM}</span></div><input type="range" min="0" max="20" step="1" value={superM} onChange={(e) => setSuperM(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-sky-500" /></div>
                                <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Factor n1</label><span className="text-xs opacity-70">{superN1.toFixed(1)}</span></div><input type="range" min="0.1" max="10" step="0.1" value={superN1} onChange={(e) => setSuperN1(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-sky-500" /></div> </> )}
                        {activeFractal === 'chladni' && ( <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Frecuencia</label><span className="text-xs opacity-70">{chladniFreq} Hz</span></div><input type="range" min="100" max="1000" step="10" value={chladniFreq} onChange={(e) => setChladniFreq(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-amber-500" /></div> )}
                        {activeFractal === 'barnsley' && ( <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Velocidad</label><span className="text-xs opacity-70">{barnsleyDensity}x</span></div><input type="range" min="1" max="100" step="1" value={barnsleyDensity} onChange={(e) => setBarnsleyDensity(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-green-500" /></div> )}
                        {activeFractal === 'phyllo' && ( <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Espaciado</label><span className="text-xs opacity-70">{phylloSpacing}</span></div><input type="range" min="3" max="15" step="0.5" value={phylloSpacing} onChange={(e) => setPhylloSpacing(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-500" /></div> )}
                        {activeFractal === 'maurer' && ( <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Pétalos (n)</label><span className="text-xs opacity-70">{maurerN}</span></div><input type="range" min="1" max="20" step="1" value={maurerN} onChange={(e) => setMaurerN(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-rose-500" /></div> )}
                        {activeFractal === 'lorenz' && ( <div className="space-y-3"><div className="flex justify-between"><label className="text-sm font-medium">Velocidad</label><span className="text-xs opacity-70">{lorenzSpeed}x</span></div><input type="range" min="0.5" max="5" step="0.5" value={lorenzSpeed} onChange={(e) => setLorenzSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-fuchsia-500" /></div> )}
                    </div>
                    <div className="p-6 border-t border-inherit"><button onClick={handleExport} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-90 transition-opacity"><Download size={18} /><span>Guardar Imagen</span></button></div>
                </div>
            </>
        )}
      </main>
    </div>
  );
}