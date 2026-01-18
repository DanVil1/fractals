import { Vector3D } from './types';

/**
 * Rodrigues' rotation formula
 * Rotates vector v around axis k by angle theta
 */
export const rodriguesRotate = (v: Vector3D, k: Vector3D, theta: number): Vector3D => {
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
