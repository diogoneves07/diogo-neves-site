import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  Points,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
} from "three";

// PRNG determinístico (mulberry32) — mesmo céu em todo carregamento.
const makeRng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

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
  float tw = 0.55 + 0.45 * sin(uTime * 0.0018 + aSeed * 6.2831);
  vTwinkle = mix(1.0, tw, uMotion); // estático em reduced-motion
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (300.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const STAR_FRAGMENT = /* glsl */ `
precision highp float;
varying vec3 vColor;
varying float vTwinkle;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.0, d) * vTwinkle;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}
`;

// Textura de halo (gradiente radial branco→transparente) para a lua.
const makeHaloTexture = (): CanvasTexture | null => {
  if (typeof document === "undefined") return null;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, "rgba(220,232,255,0.85)");
  g.addColorStop(0.25, "rgba(190,210,255,0.35)");
  g.addColorStop(1.0, "rgba(190,210,255,0.0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
};

export type Starfield = {
  object: Group;
  update: (time: number) => void;
  dispose: () => void;
};

const WHITE = new Color(1, 1, 1);
const COOL = new Color(0.72, 0.82, 1.0);
const WARM = new Color(1.0, 0.86, 0.68);

export function createStarfield(count: number, pixelRatio: number, motion: number): Starfield {
  const group = new Group();
  const rng = makeRng(0x1234abcd);

  // ---- Estrelas: caixa ampla no céu, atrás e acima da água ----
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const tmp = new Color();

  for (let i = 0; i < count; i += 1) {
    const x = (rng() - 0.5) * 160;
    const y = 3 + rng() * 58;
    const z = -90 + rng() * 80; // -90..-10
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    seeds[i] = rng();

    // Poucas estrelas grandes/brilhantes; maioria pequena.
    const r = rng();
    sizes[i] = r > 0.96 ? 2.6 + rng() * 1.6 : 0.8 + rng() * 1.2;

    const hue = rng();
    tmp.copy(hue < 0.12 ? COOL : hue > 0.92 ? WARM : WHITE);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }

  const starGeo = new BufferGeometry();
  starGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  starGeo.setAttribute("aSeed", new Float32BufferAttribute(seeds, 1));
  starGeo.setAttribute("aSize", new Float32BufferAttribute(sizes, 1));
  starGeo.setAttribute("aColor", new Float32BufferAttribute(colors, 3));

  const starMat = new ShaderMaterial({
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

  const stars = new Points(starGeo, starMat);
  stars.frustumCulled = false;
  group.add(stars);

  // ---- Lua: esfera brilhante (capta o bloom) + halo ----
  const moonGeo = new SphereGeometry(3, 32, 24);
  const moonMat = new MeshBasicMaterial({ color: new Color(0.95, 0.96, 1.0) });
  const moon = new Mesh(moonGeo, moonMat);
  moon.position.set(-18, 22, -52);
  group.add(moon);

  const haloTexture = makeHaloTexture();
  const halo = haloTexture
    ? new Sprite(
        new SpriteMaterial({
          map: haloTexture,
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
        })
      )
    : null;
  if (halo) {
    halo.position.copy(moon.position);
    halo.scale.setScalar(18);
    group.add(halo);
  }

  return {
    object: group,
    update(time) {
      starMat.uniforms.uTime.value = time;
    },
    dispose() {
      starGeo.dispose();
      starMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      halo?.material.dispose();
      haloTexture?.dispose();
    },
  };
}
