import { 
  Layers, 
  Activity, 
  Sprout, 
  Aperture, 
  Flower, 
  Infinity, 
  GitBranch, 
  Shapes, 
  Triangle, 
  CloudFog, 
  Zap, 
  Snowflake, 
  Eye, 
  Hourglass,
  Atom,
  Box,
  Circle,
  TreeDeciduous,
  Fingerprint,
  Locate,
  Radio
} from 'lucide-react';
import type { FractalInfo } from '../lib/types';

export const fractals: FractalInfo[] = [
  { 
    id: 'flower', 
    titleKey: 'fractals.flower.title', 
    subtitleKey: 'fractals.flower.subtitle', 
    icon: Layers, 
    color: "text-pink-500", 
    descKey: "fractals.flower.desc" 
  },
  { 
    id: 'bronchial', 
    titleKey: 'fractals.bronchial.title', 
    subtitleKey: 'fractals.bronchial.subtitle', 
    icon: Activity, 
    color: "text-teal-500", 
    descKey: "fractals.bronchial.desc" 
  },
  { 
    id: 'lsystem', 
    titleKey: 'fractals.lsystem.title', 
    subtitleKey: 'fractals.lsystem.subtitle', 
    icon: GitBranch, 
    color: "text-emerald-500", 
    descKey: "fractals.lsystem.desc" 
  },
  { 
    id: 'windy', 
    titleKey: 'fractals.windy.title', 
    subtitleKey: 'fractals.windy.subtitle', 
    icon: CloudFog, 
    color: "text-lime-500", 
    descKey: "fractals.windy.desc" 
  },
  { 
    id: 'dragon', 
    titleKey: 'fractals.dragon.title', 
    subtitleKey: 'fractals.dragon.subtitle', 
    icon: Zap, 
    color: "text-red-500", 
    descKey: "fractals.dragon.desc" 
  },
  { 
    id: 'koch', 
    titleKey: 'fractals.koch.title', 
    subtitleKey: 'fractals.koch.subtitle', 
    icon: Snowflake, 
    color: "text-blue-500", 
    descKey: "fractals.koch.desc" 
  },
  { 
    id: 'julia', 
    titleKey: 'fractals.julia.title', 
    subtitleKey: 'fractals.julia.subtitle', 
    icon: Eye, 
    color: "text-indigo-400", 
    descKey: "fractals.julia.desc" 
  },
  { 
    id: 'lifecycle', 
    titleKey: 'fractals.lifecycle.title', 
    subtitleKey: 'fractals.lifecycle.subtitle', 
    icon: Hourglass, 
    color: "text-rose-400", 
    descKey: "fractals.lifecycle.desc" 
  },
  { 
    id: 'sierpinski', 
    titleKey: 'fractals.sierpinski.title', 
    subtitleKey: 'fractals.sierpinski.subtitle', 
    icon: Triangle, 
    color: "text-purple-500", 
    descKey: "fractals.sierpinski.desc" 
  },
  { 
    id: 'superformula', 
    titleKey: 'fractals.superformula.title', 
    subtitleKey: 'fractals.superformula.subtitle', 
    icon: Shapes, 
    color: "text-sky-500", 
    descKey: "fractals.superformula.desc" 
  },
  { 
    id: 'chladni', 
    titleKey: 'fractals.chladni.title', 
    subtitleKey: 'fractals.chladni.subtitle', 
    icon: Activity, 
    color: "text-amber-500", 
    descKey: "fractals.chladni.desc" 
  },
  { 
    id: 'barnsley', 
    titleKey: 'fractals.barnsley.title', 
    subtitleKey: 'fractals.barnsley.subtitle', 
    icon: Sprout, 
    color: "text-green-500", 
    descKey: "fractals.barnsley.desc" 
  },
  { 
    id: 'phyllo', 
    titleKey: 'fractals.phyllo.title', 
    subtitleKey: 'fractals.phyllo.subtitle', 
    icon: Aperture, 
    color: "text-indigo-500", 
    descKey: "fractals.phyllo.desc" 
  },
  { 
    id: 'maurer', 
    titleKey: 'fractals.maurer.title', 
    subtitleKey: 'fractals.maurer.subtitle', 
    icon: Flower, 
    color: "text-rose-500", 
    descKey: "fractals.maurer.desc" 
  },
  { 
    id: 'lorenz', 
    titleKey: 'fractals.lorenz.title', 
    subtitleKey: 'fractals.lorenz.subtitle', 
    icon: Infinity, 
    color: "text-fuchsia-500", 
    descKey: "fractals.lorenz.desc" 
  },
  { 
    id: 'mandelbrot', 
    titleKey: 'fractals.mandelbrot.title', 
    subtitleKey: 'fractals.mandelbrot.subtitle', 
    icon: Atom, 
    color: "text-cyan-500", 
    descKey: "fractals.mandelbrot.desc" 
  },
  { 
    id: 'sierpinskiTri', 
    titleKey: 'fractals.sierpinskiTri.title', 
    subtitleKey: 'fractals.sierpinskiTri.subtitle', 
    icon: Triangle, 
    color: "text-emerald-400", 
    descKey: "fractals.sierpinskiTri.desc" 
  },
  { 
    id: 'menger', 
    titleKey: 'fractals.menger.title', 
    subtitleKey: 'fractals.menger.subtitle', 
    icon: Box, 
    color: "text-violet-500", 
    descKey: "fractals.menger.desc" 
  },
  { 
    id: 'apollonian', 
    titleKey: 'fractals.apollonian.title', 
    subtitleKey: 'fractals.apollonian.subtitle', 
    icon: Circle, 
    color: "text-orange-500", 
    descKey: "fractals.apollonian.desc" 
  },
  { 
    id: 'dla', 
    titleKey: 'fractals.dla.title', 
    subtitleKey: 'fractals.dla.subtitle', 
    icon: TreeDeciduous, 
    color: "text-teal-400", 
    descKey: "fractals.dla.desc" 
  },
  { 
    id: 'reactionDiffusion', 
    titleKey: 'fractals.reactionDiffusion.title', 
    subtitleKey: 'fractals.reactionDiffusion.subtitle', 
    icon: Fingerprint, 
    color: "text-amber-400", 
    descKey: "fractals.reactionDiffusion.desc" 
  },
  { 
    id: 'doublePendulum', 
    titleKey: 'fractals.doublePendulum.title', 
    subtitleKey: 'fractals.doublePendulum.subtitle', 
    icon: Locate, 
    color: "text-pink-400", 
    descKey: "fractals.doublePendulum.desc" 
  },
  { 
    id: 'waveInterference', 
    titleKey: 'fractals.waveInterference.title', 
    subtitleKey: 'fractals.waveInterference.subtitle', 
    icon: Radio, 
    color: "text-sky-400", 
    descKey: "fractals.waveInterference.desc" 
  }
];
