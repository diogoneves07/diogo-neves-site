import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from "three";
import { WATER_LEVEL, WATER_PLANE_Z, WAVE_GLSL, WIND } from "./waves";

// Plano de água noturno: ondas Gerstner (campo compartilhado em waves.ts) +
// reflexo do céu escuro + caminho de luar (specular frio na direção da lua).
const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uWind;
varying vec3 vWorld;
varying float vHeight;

${WAVE_GLSL}

void main(){
  vec3 p = position;
  float h = surface(p.xy);
  p.z += h;
  vHeight = h;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uOpacity;
uniform vec3 uDeep;
uniform vec3 uSky;
varying vec3 vWorld;
varying float vHeight;

// Ondulações de ALTA frequência usadas só para perturbar o normal (cintilação),
// sem mexer na altura física da água — o barco continua seguindo waves.ts.
vec3 rippleNormal(vec2 p, float t){
  vec2 d = vec2(0.0);
  d.x += cos(p.x * 2.3 + t * 1.7) * 0.06;
  d.y += cos(p.y * 2.9 - t * 1.3) * 0.06;
  d.x += cos(p.x * 5.1 - p.y * 1.5 + t * 2.1) * 0.03;
  d.y += cos(p.y * 4.3 + p.x * 1.2 - t * 1.9) * 0.03;
  return normalize(vec3(-d.x, 1.0, -d.y));
}

void main(){
  float t = uTime * 0.001;

  // Normal das ondas Gerstner (gradiente da altura) + detalhe fino animado.
  vec3 nBase = normalize(vec3(-dFdx(vHeight) * 8.0, 1.0, -dFdy(vHeight) * 8.0));
  vec3 nFine = rippleNormal(vWorld.xz, t);
  vec3 n = normalize(nBase * 0.7 + nFine * 0.5);

  vec3 viewDir = normalize(cameraPosition - vWorld);
  float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 4.0);

  // Reflexo do céu por Fresnel: rasante reflete o céu, a pino mostra a água funda.
  vec3 col = mix(uDeep, uSky, clamp(fres * 1.2 + 0.06, 0.0, 1.0));

  // Caminho de luar: realce especular nítido + brilho largo na direção da lua.
  vec3 moonDir = normalize(vec3(-0.71, 0.18, -0.68)); // aponta para a Lua visível
  vec3 halfDir = normalize(moonDir + viewDir);
  float ndh = max(dot(n, halfDir), 0.0);
  col += pow(ndh, 120.0) * vec3(0.85, 0.9, 1.0) * 1.4;  // glitter
  col += pow(ndh, 18.0) * vec3(0.18, 0.24, 0.4);        // halo do luar

  // Espuma tênue nas cristas, vales mais escuros → sensação de volume d'água.
  float foam = smoothstep(0.45, 0.7, vHeight);
  col = mix(col, vec3(0.5, 0.58, 0.7), foam * 0.25);
  col *= 0.85 + smoothstep(-0.4, 0.5, vHeight) * 0.25;

  gl_FragColor = vec4(col, uOpacity * (0.7 + fres * 0.3));
}
`;

export type Water = {
  mesh: Mesh;
  update: (time: number) => void;
  dispose: () => void;
};

export function createWater(): Water {
  const geometry = new PlaneGeometry(80, 60, 120, 90);
  const material = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uWind: { value: WIND },
      uOpacity: { value: 1 },
      uDeep: { value: [0.01, 0.03, 0.055] },
      uSky: { value: [0.07, 0.12, 0.2] },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
  });

  const mesh = new Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, WATER_LEVEL, WATER_PLANE_Z);

  return {
    mesh,
    update(time) {
      material.uniforms.uTime.value = time;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
