export interface FractalFormula {
  equations: string[];
  variables?: string[];
}

export const fractalFormulas: Record<string, FractalFormula> = {
  flower: {
    equations: [
      'x(θ) = r·cos(θ) + cₓ',
      'y(θ) = r·sin(θ) + cᵧ',
      'Centers placed at distance r from origin at 60° intervals',
    ],
    variables: ['r = circle radius', 'θ ∈ [0, 2π]', 'n = number of layers'],
  },
  bronchial: {
    equations: [
      'branch(depth, angle, length):',
      '  x₁ = x₀ + length·cos(angle)',
      '  y₁ = y₀ + length·sin(angle)',
      '  branch(depth-1, angle ± θ, length·ratio)',
    ],
    variables: ['θ = branching angle', 'ratio ≈ 0.7', 'depth = recursion level'],
  },
  lsystem: {
    equations: [
      'Axiom: F',
      'Rule: F → FF+[+F-F-F]-[-F+F+F]',
      'F = draw forward',
      '+ = turn left by angle',
      '- = turn right by angle',
    ],
    variables: ['angle = branch angle (°)', 'iterations = rule applications'],
  },
  windy: {
    equations: [
      'Axiom: X',
      'Rule: X → F+[[X]-X]-F[-FX]+X',
      'Rule: F → FF',
    ],
    variables: ['angle = wind deflection (°)', 'iterations = growth cycles'],
  },
  dragon: {
    equations: [
      'Axiom: F',
      'Rule: F → F+G',
      'Rule: G → F-G',
      'F, G = draw forward',
      '+ = turn left 90°, - = turn right 90°',
    ],
    variables: ['iterations = fold count', 'Each iteration doubles segment count'],
  },
  koch: {
    equations: [
      'For each line segment AB:',
      '  Divide into thirds: A, P, Q, B',
      '  Create equilateral triangle peak at R',
      '  R = rotate(P→Q, 60°)',
      'Perimeter: P = 3·s·(4/3)ⁿ',
      'Area: A = (2s²√3/5)·(1 - (4/9)ⁿ)',
    ],
    variables: ['s = initial side length', 'n = iteration depth'],
  },
  julia: {
    equations: [
      'zₙ₊₁ = zₙ² + c',
      'z₀ = pixel coordinate (x + yi)',
      'c = constant complex parameter',
      'Color = escape iteration count',
    ],
    variables: ['c ∈ ℂ (Re, Im)', 'Escape radius |z| > 2', 'Max iterations'],
  },
  lifecycle: {
    equations: [
      'Petals: r(θ) = a·cos(k·θ)',
      'Growth: g(t) = 1/(1 + e⁻ᵏ⁽ᵗ⁻ᵗ⁰⁾)',
      'Decay: d(t) = e⁻λᵗ',
      'Center: Phyllotaxis spiral',
    ],
    variables: ['k = petal count', 'λ = decay rate', 't = time parameter'],
  },
  sierpinski: {
    equations: [
      'Vertices: V = {v₁, v₂, v₃, v₄} (tetrahedron)',
      'Subdivide: midpoints of all edges',
      'Remove: central octahedron',
      'Rodrigues rotation:',
      "  v' = v·cos(θ) + (k×v)·sin(θ) + k·(k·v)·(1-cos(θ))",
    ],
    variables: ['k = rotation axis (x,y,z)', 'θ = rotation angle', 'depth = subdivisions'],
  },
  superformula: {
    equations: [
      'r(θ) = [ |cos(mθ/4)/a|ⁿ² + |sin(mθ/4)/b|ⁿ³ ]⁻¹ᐟⁿ¹',
    ],
    variables: ['m = symmetry order', 'n₁ = shape exponent', 'n₂, n₃ = curvature', 'a = b = 1'],
  },
  chladni: {
    equations: [
      'w(x,y) = a·sin(πnx/L)·sin(πmy/L) + b·sin(πmx/L)·sin(πny/L)',
      'Nodal lines where w(x,y) = 0',
    ],
    variables: ['n, m = mode numbers', 'L = plate size', 'f = frequency (Hz)'],
  },
  barnsley: {
    equations: [
      'f₁: [x,y] → [0.85x+0.04y, -0.04x+0.85y+1.6]  p=0.85',
      'f₂: [x,y] → [0.20x-0.26y, 0.23x+0.22y+1.6]  p=0.07',
      'f₃: [x,y] → [-0.15x+0.28y, 0.26x+0.24y+0.44]  p=0.07',
      'f₄: [x,y] → [0, 0.16y]  p=0.01',
    ],
    variables: ['p = probability of each transform', 'IFS = Iterated Function System'],
  },
  phyllo: {
    equations: [
      'θₙ = n · 137.508°',
      'rₙ = c · √n',
      'xₙ = rₙ · cos(θₙ)',
      'yₙ = rₙ · sin(θₙ)',
    ],
    variables: ['137.508° = golden angle', 'c = spacing constant', 'n = seed index'],
  },
  maurer: {
    equations: [
      'Rose: r(θ) = sin(n·θ)',
      'Maurer lines connect:',
      '  P(k·d°) → P((k+1)·d°)',
      '  for k = 0, 1, 2, ..., 360',
    ],
    variables: ['n = petals', 'd = angular step (°)'],
  },
  lorenz: {
    equations: [
      'dx/dt = σ(y - x)',
      'dy/dt = x(ρ - z) - y',
      'dz/dt = xy - βz',
    ],
    variables: ['σ = 10 (Prandtl)', 'ρ = 28 (Rayleigh)', 'β = 8/3'],
  },
  mandelbrot: {
    equations: [
      'zₙ₊₁ = zₙ² + c',
      'z₀ = 0',
      'c = pixel coordinate (x + yi)',
      'Point ∈ set if |zₙ| ≤ 2 for all n',
    ],
    variables: ['Escape radius = 2', 'Color mapped from escape iteration', 'Cardioid: r = ½ - ½cos(θ)'],
  },
  sierpinskiTri: {
    equations: [
      'Given triangle vertices A, B, C:',
      'Find midpoints: Mab, Mbc, Mac',
      'Recurse on: △(A,Mab,Mac), △(Mab,B,Mbc), △(Mac,Mbc,C)',
      'Remove central triangle △(Mab,Mbc,Mac)',
      'Triangles at depth n: 3ⁿ',
    ],
    variables: ['Hausdorff dimension = log(3)/log(2) ≈ 1.585', 'n = recursion depth'],
  },
  menger: {
    equations: [
      'Divide cube into 27 sub-cubes (3×3×3)',
      'Remove center of each face (6) + center (1) = 7 removed',
      'Keep 20 sub-cubes, recurse',
      'Sub-cubes at depth n: 20ⁿ',
    ],
    variables: ['Hausdorff dim = log(20)/log(3) ≈ 2.727', 'n = recursion depth'],
  },
  apollonian: {
    equations: [
      "Descartes' Circle Theorem:",
      '(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)',
      'k₄ = k₁+k₂+k₃ ± 2√(k₁k₂+k₂k₃+k₁k₃)',
      'k = 1/r  (curvature)',
    ],
    variables: ['r = circle radius', 'k = curvature', 'Tangent condition: d = r₁ + r₂'],
  },
  dla: {
    equations: [
      'Random walk: P(t+1) = P(t) + random([-1,0,1], [-1,0,1])',
      'Stick condition: ∃ neighbor ∈ aggregate',
      'Growth rate ∝ 1/√(N)',
    ],
    variables: ['Fractal dim ≈ 1.71 (2D)', 'N = particle count', 'Stickiness = P(attach)'],
  },
  reactionDiffusion: {
    equations: [
      '∂A/∂t = Dₐ∇²A - AB² + f(1-A)',
      '∂B/∂t = Dᵦ∇²B + AB² - (k+f)B',
    ],
    variables: ['Dₐ = 1.0, Dᵦ = 0.5', 'f = feed rate', 'k = kill rate', '∇² = Laplacian operator'],
  },
  doublePendulum: {
    equations: [
      'θ̈₁ = [-g(2m₁+m₂)sinθ₁ - m₂g·sin(θ₁-2θ₂) - 2sin(θ₁-θ₂)m₂(θ̇₂²l₂+θ̇₁²l₁cos(θ₁-θ₂))] / [l₁(2m₁+m₂-m₂cos(2θ₁-2θ₂))]',
      'θ̈₂ = [2sin(θ₁-θ₂)(θ̇₁²l₁(m₁+m₂)+g(m₁+m₂)cosθ₁+θ̇₂²l₂m₂cos(θ₁-θ₂))] / [l₂(2m₁+m₂-m₂cos(2θ₁-2θ₂))]',
    ],
    variables: ['θ₁, θ₂ = angles', 'm₁, m₂ = masses', 'l₁, l₂ = arm lengths', 'g = gravity'],
  },
  waveInterference: {
    equations: [
      'ψᵢ(r,t) = A·sin(k·|r-rᵢ| - ωt) / |r-rᵢ|',
      'ψ_total = Σ ψᵢ (superposition)',
      'Constructive: Δφ = 2nπ',
      'Destructive: Δφ = (2n+1)π',
    ],
    variables: ['k = 2π/λ (wave number)', 'ω = 2πf (angular frequency)', 'rᵢ = source position'],
  },
  burningShip: {
    equations: [
      'zₙ₊₁ = (|Re(zₙ)| + i·|Im(zₙ)|)² + c',
      'z₀ = 0',
      'c = pixel coordinate (x + yi)',
      'Escape: |zₙ| > 2',
    ],
    variables: ['Key difference: absolute values before squaring', 'Produces asymmetric, flame-like boundary'],
  },
  newton: {
    equations: [
      'Newton\'s method: zₙ₊₁ = zₙ - f(zₙ)/f\'(zₙ)',
      'f(z) = zⁿ - 1',
      'f\'(z) = n·zⁿ⁻¹',
      'Roots: zₖ = e^(2πik/n), k = 0..n-1',
    ],
    variables: ['n = polynomial degree', 'Convergence tolerance ≈ 10⁻⁶', 'Color = which root'],
  },
  buddhabrot: {
    equations: [
      'zₙ₊₁ = zₙ² + c (same as Mandelbrot)',
      'Plot: trajectory of escaping orbits',
      'Density[pixel] += 1 for each visit',
      'Brightness ∝ log(density)',
    ],
    variables: ['Only escaping orbits are plotted', 'Higher iterations → finer detail', 'Anti-Buddhabrot uses non-escaping orbits'],
  },
  hilbert: {
    equations: [
      'd → (x, y) mapping via bit manipulation',
      'Recursive: H(n) = B·H(n-1), D·H(n-1), D·H(n-1), C·H(n-1)',
      'Points visited: 4ⁿ = 2²ⁿ',
      'Dimension: d = 2 (space-filling)',
    ],
    variables: ['n = order (recursion depth)', 'Locality preserving: if |i-j| small → ||p(i)-p(j)|| small'],
  },
  peano: {
    equations: [
      'L-system: Axiom L',
      'L → LFRFL-F-RFLFR+F+LFRFL',
      'R → RFLFR+F+LFRFL-F-RFLFR',
      'Points: 9ⁿ segments',
    ],
    variables: ['n = order', 'F = forward', '+ = left 90°', '- = right 90°'],
  },
  clifford: {
    equations: [
      'xₙ₊₁ = sin(a·yₙ) + c·cos(a·xₙ)',
      'yₙ₊₁ = sin(b·xₙ) + d·cos(b·yₙ)',
    ],
    variables: ['a, b, c, d ∈ ℝ (attractor parameters)', 'Typical range: [-3, 3]', 'Rendered as density plot'],
  },
  rossler: {
    equations: [
      'dx/dt = -y - z',
      'dy/dt = x + a·y',
      'dz/dt = b + z·(x - c)',
    ],
    variables: ['a = 0.2', 'b = 0.2', 'c = 5.7', 'Period doubling at c ≈ 2.83, 4.2, ...'],
  },
  penrose: {
    equations: [
      'Robinson triangle decomposition',
      'φ = (1+√5)/2 (golden ratio)',
      'Thin triangle → 1 thin + 1 thick',
      'Thick triangle → 1 thin + 2 thick',
      'Ratio of thick/thin → φ',
    ],
    variables: ['5-fold symmetry', 'Never periodic', 'Related to quasicrystals'],
  },
  pythagoras: {
    equations: [
      'For each square with base (p1, p2):',
      'Build right triangle on top edge',
      'Left child: hypotenuse side a',
      'Right child: hypotenuse side b',
      'a² + b² = c² (Pythagorean theorem)',
    ],
    variables: ['lean = angle of triangle apex', 'depth = recursion level', 'Total squares: 2ⁿ⁺¹ - 1'],
  },
  sierpinskiCarpet: {
    equations: [
      'Divide square into 9 (3×3) sub-squares',
      'Remove center sub-square',
      'Recurse on remaining 8',
      'Area at depth n: (8/9)ⁿ',
    ],
    variables: ['Hausdorff dim = log(8)/log(3) ≈ 1.893', 'n = recursion depth', '8ⁿ squares at depth n'],
  },
  plasma: {
    equations: [
      'Diamond step: center = avg(corners) + random·scale',
      'Square step: edge = avg(neighbors) + random·scale',
      'scale *= 0.5 each iteration (roughness decay)',
    ],
    variables: ['roughness ∈ (0, 2)', 'Grid size: 2ⁿ + 1', 'seed = random seed'],
  },
  lyapunov: {
    equations: [
      'xₙ₊₁ = rₙ·xₙ·(1 - xₙ) (logistic map)',
      'rₙ = A if seq[n] = "A", else B',
      'λ = (1/N)·Σ ln|rₙ·(1 - 2xₙ)|',
      'λ < 0 → stable, λ > 0 → chaotic',
    ],
    variables: ['A, B ∈ [2, 4] (mapped to x, y axes)', 'Sequence: e.g. "AB", "AABB"', 'λ = Lyapunov exponent'],
  },
};
