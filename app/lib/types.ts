// --- SHARED TYPES ---

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface CircleData {
  cx: number;
  cy: number;
  key: string;
}

export interface Particle {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  life?: number;
  rotation?: number;
}

export interface LineData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface TreeData {
  lines: LineData[];
  spawns: { x: number; y: number }[];
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export interface WindyParticle extends Particle {
  vx: number;
  vy: number;
  life: number;
  rotation: number;
}

export interface FractalInfo {
  id: string;
  titleKey: string;
  subtitleKey: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  descKey: string;
}

export type Language = 'es' | 'en';
