'use client';

import React, { useState } from 'react';
import { Download, ArrowLeft, Rotate3D } from 'lucide-react';
import { LanguageProvider, useLanguage } from './i18n';
import { Header, FractalCard } from './components/ui';
import { fractals } from './data/fractals';
import {
  FlowerOfLife,
  BronchialTree,
  ChladniPlate,
  BarnsleyFern,
  Phyllotaxis,
  MaurerRose,
  LorenzAttractor,
  LSystemTree,
  WindyPlant,
  SuperformulaShape,
  SierpinskiTetrahedron,
  DragonCurve,
  KochSnowflake,
  JuliaSet,
  LifecycleFlower,
  MandelbrotSet,
  SierpinskiTriangle,
  MengerSponge,
  ApollonianGasket,
  DLA,
  ReactionDiffusion,
  DoublePendulum,
  WaveInterference
} from './components/fractals';

function FractalGalleryContent() {
  const { t } = useLanguage();
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
  const [lifeSpeed, setLifeSpeed] = useState(1);

  // New fractal states
  const [mandelbrotIter, setMandelbrotIter] = useState(100);
  const [mandelbrotZoom, setMandelbrotZoom] = useState(1);
  const [mandelbrotX, setMandelbrotX] = useState(-0.5);
  const [mandelbrotY, setMandelbrotY] = useState(0);
  const [sierpinskiTriDepth, setSierpinskiTriDepth] = useState(6);
  const [mengerDepth, setMengerDepth] = useState(2);
  const [apollonianDepth, setApollonianDepth] = useState(4);

  // DLA, Reaction-Diffusion, Double Pendulum, Wave Interference
  const [dlaSpeed, setDlaSpeed] = useState(2);
  const [dlaStickiness, setDlaStickiness] = useState(1);
  const [rdFeed, setRdFeed] = useState(0.055);
  const [rdKill, setRdKill] = useState(0.062);
  const [pendulumGravity, setPendulumGravity] = useState(1);
  const [pendulumTrail, setPendulumTrail] = useState(500);
  const [waveSources, setWaveSources] = useState(2);
  const [waveFrequency, setWaveFrequency] = useState(0.1);
  const [waveSpeed, setWaveSpeed] = useState(1);

  const themeClasses = isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900";
  const controlPanelClasses = isDark ? "bg-slate-800 border-l border-slate-700" : "bg-white border-l border-slate-200";

  const handleExport = (): void => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `fractal-${activeFractal}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const renderFractal = () => {
    switch (activeFractal) {
      case 'flower': return <FlowerOfLife layers={flowerLayers} zoom={flowerZoom} isDark={isDark} />;
      case 'bronchial': return <BronchialTree depth={bronchialDepth} isBreathing={bronchialBreathe} isDark={isDark} />;
      case 'chladni': return <ChladniPlate frequency={chladniFreq} isDark={isDark} />;
      case 'barnsley': return <BarnsleyFern isDark={isDark} density={barnsleyDensity} />;
      case 'phyllo': return <Phyllotaxis isDark={isDark} spacing={phylloSpacing} size={phylloSize} />;
      case 'maurer': return <MaurerRose isDark={isDark} n={maurerN} d={maurerD} />;
      case 'mandelbrot': return <MandelbrotSet isDark={isDark} maxIterations={mandelbrotIter} zoom={mandelbrotZoom} offsetX={mandelbrotX} offsetY={mandelbrotY} />;
      case 'sierpinskiTri': return <SierpinskiTriangle isDark={isDark} depth={sierpinskiTriDepth} />;
      case 'menger': return <MengerSponge isDark={isDark} depth={mengerDepth} />;
      case 'apollonian': return <ApollonianGasket isDark={isDark} depth={apollonianDepth} />;
      case 'dla': return <DLA isDark={isDark} particleSpeed={dlaSpeed} stickiness={dlaStickiness} />;
      case 'reactionDiffusion': return <ReactionDiffusion isDark={isDark} feedRate={rdFeed} killRate={rdKill} />;
      case 'doublePendulum': return <DoublePendulum isDark={isDark} gravity={pendulumGravity} trailLength={pendulumTrail} />;
      case 'waveInterference': return <WaveInterference isDark={isDark} sources={waveSources} frequency={waveFrequency} speed={waveSpeed} />;
      case 'lorenz': return <LorenzAttractor isDark={isDark} speed={lorenzSpeed} />;
      case 'lsystem': return <LSystemTree isDark={isDark} iterations={lsystemIter} angleDeg={lsystemAngle} />;
      case 'windy': return <WindyPlant isDark={isDark} iterations={windyIter} angleDeg={windyAngle} />;
      case 'dragon': return <DragonCurve isDark={isDark} iterations={dragonIter} />;
      case 'koch': return <KochSnowflake isDark={isDark} iterations={kochIter} />;
      case 'julia': return <JuliaSet isDark={isDark} cRe={juliaCre} cIm={juliaCim} />;
      case 'lifecycle': return <LifecycleFlower isDark={isDark} speed={lifeSpeed} />;
      case 'superformula': return <SuperformulaShape isDark={isDark} m={superM} n1={superN1} n2={superN2} n3={superN3} />;
      case 'sierpinski': return <SierpinskiTetrahedron isDark={isDark} depth={sierpinskiDepth} axisX={axisX} axisY={axisY} axisZ={axisZ} />;
      default: return null;
    }
  };

  const renderControls = () => {
    switch (activeFractal) {
      case 'flower':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.layers')}</label>
                <span className="text-xs opacity-70">{flowerLayers}</span>
              </div>
              <input type="range" min="1" max="7" step="1" value={flowerLayers} onChange={(e) => setFlowerLayers(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-pink-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.zoom')}</label>
              </div>
              <input type="range" min="0.5" max="2.5" step="0.1" value={flowerZoom} onChange={(e) => setFlowerZoom(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-pink-500" />
            </div>
          </>
        );
      case 'bronchial':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.depth')}</label>
                <span className="text-xs opacity-70">{bronchialDepth}</span>
              </div>
              <input type="range" min="1" max="6" step="1" value={bronchialDepth} onChange={(e) => setBronchialDepth(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-teal-500" />
            </div>
            <div className="flex items-center justify-between pt-4">
              <label className="text-sm font-medium">{t('common.breathingAnimation')}</label>
              <button onClick={() => setBronchialBreathe(!bronchialBreathe)} className={`w-12 h-6 rounded-full transition-colors relative ${bronchialBreathe ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${bronchialBreathe ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </>
        );
      case 'lsystem':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.iterations')}</label>
                <span className="text-xs opacity-70">{lsystemIter}</span>
              </div>
              <input type="range" min="1" max="5" step="1" value={lsystemIter} onChange={(e) => setLsystemIter(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-emerald-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.angle')}</label>
                <span className="text-xs opacity-70">{lsystemAngle}°</span>
              </div>
              <input type="range" min="10" max="60" step="1" value={lsystemAngle} onChange={(e) => setLsystemAngle(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-emerald-500" />
            </div>
          </>
        );
      case 'windy':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.iterations')}</label>
                <span className="text-xs opacity-70">{windyIter}</span>
              </div>
              <input type="range" min="1" max="6" step="1" value={windyIter} onChange={(e) => setWindyIter(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-lime-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.windAngle')}</label>
                <span className="text-xs opacity-70">{windyAngle}°</span>
              </div>
              <input type="range" min="10" max="45" step="1" value={windyAngle} onChange={(e) => setWindyAngle(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-lime-500" />
            </div>
            <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">
              {t('fractals.windy.ruleNote')}
            </div>
          </>
        );
      case 'dragon':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.iterations')}</label>
                <span className="text-xs opacity-70">{dragonIter}</span>
              </div>
              <input type="range" min="1" max="14" step="1" value={dragonIter} onChange={(e) => setDragonIter(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-red-500" />
            </div>
            <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">
              {t('fractals.dragon.note')}
            </div>
          </>
        );
      case 'koch':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.iterations')}</label>
                <span className="text-xs opacity-70">{kochIter}</span>
              </div>
              <input type="range" min="0" max="6" step="1" value={kochIter} onChange={(e) => setKochIter(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-500" />
            </div>
            <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">
              {t('fractals.koch.note')}
            </div>
          </>
        );
      case 'julia':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.real')}</label>
                <span className="text-xs opacity-70">{juliaCre.toFixed(3)}</span>
              </div>
              <input type="range" min="-1.5" max="1.5" step="0.01" value={juliaCre} onChange={(e) => setJuliaCre(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.imaginary')}</label>
                <span className="text-xs opacity-70">{juliaCim.toFixed(3)}</span>
              </div>
              <input type="range" min="-1.5" max="1.5" step="0.01" value={juliaCim} onChange={(e) => setJuliaCim(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-400" />
            </div>
            <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">
              {t('fractals.julia.note')}<br/>
              -0.4 + 0.6i ({t('fractals.julia.dendrite')})<br/>
              -0.8 + 0.156i ({t('fractals.julia.spiral')})
            </div>
          </>
        );
      case 'lifecycle':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.cycleSpeed')}</label>
                <span className="text-xs opacity-70">{lifeSpeed}x</span>
              </div>
              <input type="range" min="0.5" max="3" step="0.5" value={lifeSpeed} onChange={(e) => setLifeSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-rose-400" />
            </div>
            <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">
              {t('fractals.lifecycle.note')}
            </div>
          </>
        );
      case 'sierpinski':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.depth')}</label>
                <span className="text-xs opacity-70">{sierpinskiDepth}</span>
              </div>
              <input type="range" min="1" max="5" step="1" value={sierpinskiDepth} onChange={(e) => setSierpinskiDepth(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-purple-500" />
            </div>
            <div className="p-4 bg-black/5 rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Rotate3D size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{t('common.rotationAxis')}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span>X</span><span>{axisX}</span></div>
                <input type="range" min="-1" max="1" step="0.1" value={axisX} onChange={e => setAxisX(parseFloat(e.target.value))} className="w-full h-1 bg-slate-300 rounded-lg cursor-pointer" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span>Y</span><span>{axisY}</span></div>
                <input type="range" min="-1" max="1" step="0.1" value={axisY} onChange={e => setAxisY(parseFloat(e.target.value))} className="w-full h-1 bg-slate-300 rounded-lg cursor-pointer" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span>Z</span><span>{axisZ}</span></div>
                <input type="range" min="-1" max="1" step="0.1" value={axisZ} onChange={e => setAxisZ(parseFloat(e.target.value))} className="w-full h-1 bg-slate-300 rounded-lg cursor-pointer" />
              </div>
            </div>
          </>
        );
      case 'superformula':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.tips')} (m)</label>
                <span className="text-xs opacity-70">{superM}</span>
              </div>
              <input type="range" min="0" max="20" step="1" value={superM} onChange={(e) => setSuperM(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-sky-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.factor')} n1</label>
                <span className="text-xs opacity-70">{superN1.toFixed(1)}</span>
              </div>
              <input type="range" min="0.1" max="10" step="0.1" value={superN1} onChange={(e) => setSuperN1(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-sky-500" />
            </div>
          </>
        );
      case 'chladni':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{t('common.frequency')}</label>
              <span className="text-xs opacity-70">{chladniFreq} Hz</span>
            </div>
            <input type="range" min="100" max="1000" step="10" value={chladniFreq} onChange={(e) => setChladniFreq(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-amber-500" />
          </div>
        );
      case 'barnsley':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{t('common.speed')}</label>
              <span className="text-xs opacity-70">{barnsleyDensity}x</span>
            </div>
            <input type="range" min="1" max="100" step="1" value={barnsleyDensity} onChange={(e) => setBarnsleyDensity(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-green-500" />
          </div>
        );
      case 'phyllo':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{t('common.spacing')}</label>
              <span className="text-xs opacity-70">{phylloSpacing}</span>
            </div>
            <input type="range" min="3" max="15" step="0.5" value={phylloSpacing} onChange={(e) => setPhylloSpacing(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-500" />
          </div>
        );
      case 'maurer':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{t('common.petals')} (n)</label>
              <span className="text-xs opacity-70">{maurerN}</span>
            </div>
            <input type="range" min="1" max="20" step="1" value={maurerN} onChange={(e) => setMaurerN(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-rose-500" />
          </div>
        );
      case 'lorenz':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{t('common.speed')}</label>
              <span className="text-xs opacity-70">{lorenzSpeed}x</span>
            </div>
            <input type="range" min="0.5" max="5" step="0.5" value={lorenzSpeed} onChange={(e) => setLorenzSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-fuchsia-500" />
          </div>
        );
      case 'mandelbrot':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.iterations')}</label>
                <span className="text-xs opacity-70">{mandelbrotIter}</span>
              </div>
              <input type="range" min="20" max="200" step="10" value={mandelbrotIter} onChange={(e) => setMandelbrotIter(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-cyan-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.zoom')}</label>
                <span className="text-xs opacity-70">{mandelbrotZoom.toFixed(1)}x</span>
              </div>
              <input type="range" min="1" max="50" step="1" value={mandelbrotZoom} onChange={(e) => setMandelbrotZoom(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-cyan-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">X Offset</label>
                <span className="text-xs opacity-70">{mandelbrotX.toFixed(2)}</span>
              </div>
              <input type="range" min="-2" max="1" step="0.01" value={mandelbrotX} onChange={(e) => setMandelbrotX(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-cyan-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Y Offset</label>
                <span className="text-xs opacity-70">{mandelbrotY.toFixed(2)}</span>
              </div>
              <input type="range" min="-1.5" max="1.5" step="0.01" value={mandelbrotY} onChange={(e) => setMandelbrotY(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-cyan-500" />
            </div>
            <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">
              {t('fractals.mandelbrot.note')}<br/>
              {t('fractals.mandelbrot.seahorse')}<br/>
              {t('fractals.mandelbrot.spiral')}
            </div>
          </>
        );
      case 'sierpinskiTri':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{t('common.depth')}</label>
              <span className="text-xs opacity-70">{sierpinskiTriDepth}</span>
            </div>
            <input type="range" min="1" max="8" step="1" value={sierpinskiTriDepth} onChange={(e) => setSierpinskiTriDepth(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-emerald-400" />
          </div>
        );
      case 'menger':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{t('common.depth')}</label>
              <span className="text-xs opacity-70">{mengerDepth}</span>
            </div>
            <input type="range" min="1" max="3" step="1" value={mengerDepth} onChange={(e) => setMengerDepth(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-violet-500" />
            <p className="text-xs opacity-50 mt-2">⚠️ Higher depths may slow performance</p>
          </div>
        );
      case 'apollonian':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{t('common.depth')}</label>
              <span className="text-xs opacity-70">{apollonianDepth}</span>
            </div>
            <input type="range" min="1" max="6" step="1" value={apollonianDepth} onChange={(e) => setApollonianDepth(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-orange-500" />
          </div>
        );
      case 'dla':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.speed')}</label>
                <span className="text-xs opacity-70">{dlaSpeed}x</span>
              </div>
              <input type="range" min="1" max="5" step="1" value={dlaSpeed} onChange={(e) => setDlaSpeed(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-teal-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Stickiness</label>
                <span className="text-xs opacity-70">{dlaStickiness.toFixed(1)}</span>
              </div>
              <input type="range" min="0.1" max="1.5" step="0.1" value={dlaStickiness} onChange={(e) => setDlaStickiness(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-teal-400" />
            </div>
          </>
        );
      case 'reactionDiffusion':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('fractals.reactionDiffusion.feedRate')}</label>
                <span className="text-xs opacity-70">{rdFeed.toFixed(3)}</span>
              </div>
              <input type="range" min="0.01" max="0.1" step="0.001" value={rdFeed} onChange={(e) => setRdFeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-amber-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('fractals.reactionDiffusion.killRate')}</label>
                <span className="text-xs opacity-70">{rdKill.toFixed(3)}</span>
              </div>
              <input type="range" min="0.045" max="0.075" step="0.001" value={rdKill} onChange={(e) => setRdKill(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-amber-400" />
            </div>
            <div className="p-4 bg-black/5 rounded text-xs opacity-70 mt-4">
              Try: f=0.055 k=0.062 (spots), f=0.04 k=0.06 (stripes)
            </div>
          </>
        );
      case 'doublePendulum':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('fractals.doublePendulum.gravity')}</label>
                <span className="text-xs opacity-70">{pendulumGravity.toFixed(1)}</span>
              </div>
              <input type="range" min="0.1" max="3" step="0.1" value={pendulumGravity} onChange={(e) => setPendulumGravity(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-pink-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('fractals.doublePendulum.trailLength')}</label>
                <span className="text-xs opacity-70">{pendulumTrail}</span>
              </div>
              <input type="range" min="100" max="1000" step="100" value={pendulumTrail} onChange={(e) => setPendulumTrail(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-pink-400" />
            </div>
          </>
        );
      case 'waveInterference':
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('fractals.waveInterference.sources')}</label>
                <span className="text-xs opacity-70">{waveSources}</span>
              </div>
              <input type="range" min="2" max="8" step="1" value={waveSources} onChange={(e) => setWaveSources(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-sky-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.frequency')}</label>
                <span className="text-xs opacity-70">{waveFrequency.toFixed(2)}</span>
              </div>
              <input type="range" min="0.05" max="0.3" step="0.01" value={waveFrequency} onChange={(e) => setWaveFrequency(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-sky-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('common.speed')}</label>
                <span className="text-xs opacity-70">{waveSpeed.toFixed(1)}x</span>
              </div>
              <input type="range" min="0.5" max="3" step="0.1" value={waveSpeed} onChange={(e) => setWaveSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-sky-400" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const currentFractal = fractals.find(f => f.id === activeFractal);

  return (
    <div className={`w-full h-screen flex flex-col transition-colors duration-300 ${themeClasses} font-sans overflow-hidden`}>
      <Header 
        isDark={isDark} 
        onToggleTheme={() => setIsDark(!isDark)} 
        onGoHome={() => setActiveFractal(null)} 
      />
      <main className="flex-1 flex overflow-hidden relative">
        {!activeFractal && (
          <div className="w-full p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">{t('common.collection')}</h2>
                <p className="opacity-60">{t('common.explore')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                {fractals.map((f) => (
                  <FractalCard 
                    key={f.id} 
                    fractal={f} 
                    isDark={isDark} 
                    onClick={() => setActiveFractal(f.id)} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {activeFractal && (
          <>
            <div className="flex-1 relative bg-black/5 overflow-hidden flex items-center justify-center">
              {renderFractal()}
              <button 
                onClick={() => setActiveFractal(null)} 
                className="absolute top-6 left-6 p-3 rounded-full bg-black/10 backdrop-blur hover:bg-black/20 transition-all border border-white/10 text-inherit"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            <div className={`w-80 flex flex-col z-10 ${controlPanelClasses} shadow-xl`}>
              <div className="p-6 border-b border-inherit">
                <h2 className="text-xl font-bold mb-1">
                  {currentFractal ? t(currentFractal.titleKey) : ''}
                </h2>
                <p className="text-xs opacity-50 uppercase tracking-widest">
                  {t('common.configuration')}
                </p>
              </div>
              <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                {renderControls()}
              </div>
              <div className="p-6 border-t border-inherit">
                <button 
                  onClick={handleExport} 
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  <Download size={18} />
                  <span>{t('common.saveImage')}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function FractalGallery() {
  return (
    <LanguageProvider defaultLanguage="en">
      <FractalGalleryContent />
    </LanguageProvider>
  );
}
