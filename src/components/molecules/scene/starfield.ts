import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Points,
  ShaderMaterial,
} from "three";

// PRNG determinístico (mulberry32) — mesmo céu em todo carregamento.
const makeRng = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
};

// Vertex shader: dimensiona cada estrela conforme a distância e calcula seu
// brilho oscilante (cintilação). aSeed desfasa cada estrela para não piscarem
// juntas; uMotion=0 (reduced-motion) congela a cintilação.
const STAR_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uMotion;
attribute float aSeed;
attribute float aSize;
attribute vec3 aColor;
varying vec3 vColor;
varying float vTwinkle;

void main(){
  vColor = aColor;
  float twinkle = 0.55 + 0.45 * sin(uTime * 0.0018 + aSeed * 6.2831);
  vTwinkle = mix(1.0, twinkle, uMotion); // estático em reduced-motion
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (300.0 / -viewPosition.z);
  gl_Position = projectionMatrix * viewPosition;
}
`;

// Fragment shader: desenha cada ponto como um disco macio (borda esmaecida) e
// descarta o canto transparente do quad.
const STAR_FRAGMENT = /* glsl */ `
precision highp float;
varying vec3 vColor;
varying float vTwinkle;

void main(){
  vec2 offset = gl_PointCoord - 0.5;
  float distanceFromCenter = length(offset);
  float alpha = smoothstep(0.5, 0.0, distanceFromCenter) * vTwinkle;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(vColor, alpha);
}
`;

export type Starfield = {
  object: Group;
  update: (time: number) => void;
  dispose: () => void;
};

const WHITE = new Color(1, 1, 1);
const COOL = new Color(0.72, 0.82, 1.0);
const WARM = new Color(1.0, 0.86, 0.68);

// Limiares de sorteio: poucas estrelas grandes; poucas coloridas (a maioria branca).
const BIG_STAR_THRESHOLD = 0.96;
const COOL_HUE_THRESHOLD = 0.12;
const WARM_HUE_THRESHOLD = 0.92;

export function createStarfield(count: number, pixelRatio: number, motion: number): Starfield {
  const group = new Group();
  const rng = makeRng(0x1234abcd);

  // ---- Estrelas: caixa ampla no céu, atrás e acima da água ----
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const colorScratch = new Color();

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (rng() - 0.5) * 160;
    positions[i * 3 + 1] = 3 + rng() * 58;
    positions[i * 3 + 2] = -90 + rng() * 80; // -90..-10

    seeds[i] = rng();

    // Poucas estrelas grandes/brilhantes; maioria pequena.
    const sizeRoll = rng();
    sizes[i] = sizeRoll > BIG_STAR_THRESHOLD ? 2.6 + rng() * 1.6 : 0.8 + rng() * 1.2;

    const hue = rng();
    colorScratch.copy(hue < COOL_HUE_THRESHOLD ? COOL : hue > WARM_HUE_THRESHOLD ? WARM : WHITE);
    colors[i * 3] = colorScratch.r;
    colors[i * 3 + 1] = colorScratch.g;
    colors[i * 3 + 2] = colorScratch.b;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new Float32BufferAttribute(seeds, 1));
  geometry.setAttribute("aSize", new Float32BufferAttribute(sizes, 1));
  geometry.setAttribute("aColor", new Float32BufferAttribute(colors, 3));

  const material = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uMotion: { value: motion },
    },
    vertexShader: STAR_VERTEX,
    fragmentShader: STAR_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const stars = new Points(geometry, material);
  stars.frustumCulled = false;
  group.add(stars);

  return {
    object: group,
    update(time) {
      material.uniforms.uTime.value = time;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
