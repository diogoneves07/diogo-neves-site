import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from "three";
import { WATER_LEVEL, WATER_PLANE_Z, WAVE_GLSL, WIND } from "./waves";

// Plano de água noturno: ondas Gerstner (campo compartilhado em waves.ts) +
// reflexo do céu escuro + caminho de luar (specular frio na direção da lua).

// Vertex shader: desloca cada vértice na vertical pela altura da onda (surface)
// e repassa a altura/posição-mundo para o fragment shader.
const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uWind;
varying vec3 vWorld;
varying float vHeight;

${WAVE_GLSL}

void main(){
  vec3 displaced = position;
  float height = surface(displaced.xy);
  displaced.z += height;
  vHeight = height;
  vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
  vWorld = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

// Fragment shader: cor da água por Fresnel (céu vs. água funda) + glitter e halo
// do luar + espuma nas cristas.
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
vec3 rippleNormal(vec2 point, float seconds){
  vec2 slope = vec2(0.0);
  slope.x += cos(point.x * 2.3 + seconds * 1.7) * 0.06;
  slope.y += cos(point.y * 2.9 - seconds * 1.3) * 0.06;
  slope.x += cos(point.x * 5.1 - point.y * 1.5 + seconds * 2.1) * 0.03;
  slope.y += cos(point.y * 4.3 + point.x * 1.2 - seconds * 1.9) * 0.03;
  return normalize(vec3(-slope.x, 1.0, -slope.y));
}

void main(){
  float seconds = uTime * 0.001;

  // Normal das ondas Gerstner (gradiente da altura) + detalhe fino animado.
  vec3 waveNormal = normalize(vec3(-dFdx(vHeight) * 8.0, 1.0, -dFdy(vHeight) * 8.0));
  vec3 detailNormal = rippleNormal(vWorld.xz, seconds);
  vec3 normal = normalize(waveNormal * 0.7 + detailNormal * 0.5);

  vec3 viewDir = normalize(cameraPosition - vWorld);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

  // Reflexo do céu por Fresnel: rasante reflete o céu, a pino mostra a água funda.
  vec3 color = mix(uDeep, uSky, clamp(fresnel * 1.2 + 0.06, 0.0, 1.0));

  // Caminho de luar: realce especular nítido + brilho largo na direção da lua.
  vec3 moonDir = normalize(vec3(-0.71, 0.18, -0.68)); // aponta para a Lua visível
  vec3 halfDir = normalize(moonDir + viewDir);
  float normalDotHalf = max(dot(normal, halfDir), 0.0);
  color += pow(normalDotHalf, 120.0) * vec3(0.85, 0.9, 1.0) * 1.4;  // glitter
  color += pow(normalDotHalf, 18.0) * vec3(0.18, 0.24, 0.4);        // halo do luar

  // Espuma tênue nas cristas, vales mais escuros → sensação de volume d'água.
  float foam = smoothstep(0.45, 0.7, vHeight);
  color = mix(color, vec3(0.5, 0.58, 0.7), foam * 0.25);
  color *= 0.85 + smoothstep(-0.4, 0.5, vHeight) * 0.25;

  gl_FragColor = vec4(color, uOpacity * (0.7 + fresnel * 0.3));
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
