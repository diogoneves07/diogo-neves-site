import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";

// Fonte única de verdade da posição da Lua (usada também pela luz direcional
// em index.ts e como referência do caminho de luar em water.ts).
export const MOON_POSITION: readonly [number, number, number] = [-40, 7, -52];

// Luz solar (espaço da CÂMERA) que ilumina a Lua: quase frontal, levemente do
// canto superior-esquerdo → revela o relevo das crateras como numa foto.
const SUN_DIR = new Vector3(-0.35, 0.3, 0.88).normalize();

const VERTEX = /* glsl */ `
varying vec3 vDir;        // direção na esfera unitária (espaço do objeto)
varying vec3 vViewNormal; // normal no espaço da câmera (p/ limbo + luz)
void main(){
  vDir = normalize(position);
  vViewNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader: gera o relevo lunar proceduralmente (ruído + crateras) e o
// ilumina como uma "lua de cinema" — sombras macias, limbo suave, halo etéreo.
const FRAGMENT = /* glsl */ `
precision highp float;
uniform vec3 uSunDir;
varying vec3 vDir;
varying vec3 vViewNormal;

// Pseudo-aleatório vetorial: leva um ponto 3D a um vetor "ruidoso" em [0,1).
vec3 hash3(vec3 point){
  point = vec3(dot(point, vec3(127.1, 311.7, 74.7)),
               dot(point, vec3(269.5, 183.3, 246.1)),
               dot(point, vec3(113.5, 271.9, 124.6)));
  return fract(sin(point) * 43758.5453123);
}

// Pseudo-aleatório escalar a partir de um ponto 3D.
float hash1(vec3 point){ return fract(sin(dot(point, vec3(127.1, 311.7, 74.7))) * 43758.5453); }

// Value noise 3D (interpolação trilinear suave).
float valueNoise(vec3 position){
  vec3 cell = floor(position);
  vec3 frac = fract(position);
  frac = frac * frac * (3.0 - 2.0 * frac);
  return mix(
    mix(mix(hash1(cell + vec3(0,0,0)), hash1(cell + vec3(1,0,0)), frac.x),
        mix(hash1(cell + vec3(0,1,0)), hash1(cell + vec3(1,1,0)), frac.x), frac.y),
    mix(mix(hash1(cell + vec3(0,0,1)), hash1(cell + vec3(1,0,1)), frac.x),
        mix(hash1(cell + vec3(0,1,1)), hash1(cell + vec3(1,1,1)), frac.x), frac.y),
    frac.z);
}

// Ruído fractal (rugosidade da regolito / variação de albedo).
float fbm(vec3 position){
  float amplitude = 0.5, sum = 0.0;
  for(int i = 0; i < 4; i++){ sum += amplitude * valueNoise(position); position *= 2.03; amplitude *= 0.5; }
  return sum;
}

// Voronoi 3D (F1): distância ao ponto-semente mais próximo → centros de cratera.
float voronoi(vec3 position){
  vec3 cell = floor(position);
  vec3 frac = fract(position);
  float nearest = 1.0;
  for(int k = -1; k <= 1; k++)
  for(int j = -1; j <= 1; j++)
  for(int i = -1; i <= 1; i++){
    vec3 neighbor = vec3(float(i), float(j), float(k));
    nearest = min(nearest, length(neighbor + hash3(cell + neighbor) - frac));
  }
  return nearest;
}

// Altura de uma camada de crateras: bacia côncava + anel de borda erguido.
float craters(vec3 dir, float scale, float radius){
  float dist = voronoi(dir * scale);
  float bowl = smoothstep(radius, 0.0, dist);
  float rim  = smoothstep(radius, radius * 0.82, dist)
             * smoothstep(radius * 1.28, radius, dist);
  return rim * 0.5 - bowl;
}

// Campo de altura completo do relevo lunar (crateras multi-escala + rugosidade).
float terrain(vec3 dir){
  float height = craters(dir, 4.0,  0.36) * 1.00
               + craters(dir, 8.0,  0.32) * 0.50
               + craters(dir, 16.0, 0.30) * 0.27
               + craters(dir, 32.0, 0.30) * 0.13;
  height += (fbm(dir * 7.0) - 0.5) * 0.12;     // micro-rugosidade sutil
  return height;
}

void main(){
  vec3 dir = normalize(vDir);
  float height = terrain(dir);

  // Relevo SUAVE: pouca perturbação da normal → crateras sem sombra "dura".
  vec3 geoNormal = normalize(vViewNormal);
  vec3 bumpNormal = normalize(geoNormal - vec3(dFdx(height), dFdy(height), 0.0) * 2.4);

  // Muito preenchimento ambiente → sombras macias e sonhadoras (estilo cinema).
  float diffuse = clamp(dot(bumpNormal, normalize(uSunDir)), 0.0, 1.0);
  float light = 0.55 + 0.5 * diffuse;

  // Limbo suave + brilho atmosférico etéreo na borda (a Lua "vaza" luz).
  float facing = clamp(geoNormal.z, 0.0, 1.0);
  float limb = mix(0.74, 1.0, pow(facing, 0.4));
  float glow = pow(1.0 - facing, 2.5);

  // Albedo de lua de cinema: creme-claro quente, mares apenas insinuados.
  float maria = smoothstep(0.5, 0.78, fbm(dir * 1.4 + 19.0));
  vec3 highland = vec3(0.97, 0.95, 0.90);
  vec3 mare     = vec3(0.68, 0.68, 0.70);
  vec3 albedo = mix(highland, mare, maria * 0.7);

  albedo *= 1.0 - clamp(-height, 0.0, 1.0) * 0.22;  // crateras delicadas
  albedo += vec3(0.10) * max(height, 0.0);          // bordas levemente realçadas
  albedo *= 0.93 + fbm(dir * 11.0) * 0.14;          // variação fina de albedo

  vec3 color = albedo * light * limb;
  color += vec3(0.85, 0.88, 1.0) * glow * 0.45;     // halo etéreo na borda
  color *= 0.92;

  gl_FragColor = vec4(color, 1.0);
}
`;

// Halo radial (branco→transparente) que envolve a Lua e capta o bloom.
const makeHaloTexture = (): CanvasTexture | null => {
  if (typeof document === "undefined") return null;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0.0, "rgba(236,240,250,0.50)");
  gradient.addColorStop(0.22, "rgba(214,224,244,0.22)");
  gradient.addColorStop(0.55, "rgba(200,214,240,0.07)");
  gradient.addColorStop(1.0, "rgba(200,214,240,0.0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
};

// X da Lua conforme o formato da tela: paisagem mantém no extremo esquerdo;
// retrato (smartphone) traz para perto do centro-esquerda, senão sai do quadro
// estreito. y/z fixos (ver MOON_POSITION).
const X_WHEN_PORTRAIT = -10;
const X_WHEN_WIDE = MOON_POSITION[0]; // -40
const moonX = (aspect: number): number => {
  const wideness = Math.max(0, Math.min(1, (aspect - 0.7) / (1.3 - 0.7))); // 0=retrato 1=wide
  return X_WHEN_PORTRAIT + (X_WHEN_WIDE - X_WHEN_PORTRAIT) * wideness;
};

export type Moon = {
  object: Group;
  /** Reposiciona a Lua (e sua luz) para caber no aspect ratio atual. */
  setAspect: (aspect: number) => void;
  dispose: () => void;
};

export function createMoon(): Moon {
  const group = new Group();
  const [, moonY, moonZ] = MOON_POSITION;

  // Esfera grande e densa → silhueta perfeitamente redonda; o relevo vem do
  // shader (sem custo de geometria nem update por frame — a Lua é estática).
  const geometry = new SphereGeometry(3.6, 128, 96);
  const material = new ShaderMaterial({
    uniforms: { uSunDir: { value: SUN_DIR } },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  });
  const sphere = new Mesh(geometry, material);
  sphere.position.set(MOON_POSITION[0], moonY, moonZ);
  group.add(sphere);

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
    halo.position.copy(sphere.position);
    halo.scale.setScalar(26);
    group.add(halo);
  }

  // Luar direcional vindo da Lua → ilumina barco/água a partir de onde ela está.
  const light = new DirectionalLight(new Color("#bcd2ff"), 0.7);
  light.position.copy(sphere.position);
  group.add(light);

  return {
    object: group,
    setAspect(aspect) {
      const x = moonX(aspect);
      sphere.position.x = x;
      halo?.position.setX(x);
      light.position.x = x;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      halo?.material.dispose();
      haloTexture?.dispose();
    },
  };
}
