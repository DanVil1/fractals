'use client';

import React from 'react';
import type { CircleData } from '../../lib/types';

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

export default FlowerOfLife;
