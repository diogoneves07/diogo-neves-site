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

void main(){
  vec3 n = normalize(vec3(-dFdx(vHeight) * 8.0, 1.0, -dFdy(vHeight) * 8.0));
  vec3 viewDir = normalize(cameraPosition - vWorld);
  float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

  vec3 moonDir = normalize(vec3(-0.35, 0.55, -0.75));
  float spec = pow(max(dot(reflect(-moonDir, n), viewDir), 0.0), 40.0);

  vec3 col = mix(uDeep, uSky, clamp(fres + 0.1, 0.0, 1.0));
  col += spec * vec3(0.7, 0.78, 1.0) * 1.1;       // glitter de luar
  col += smoothstep(0.25, 0.55, vHeight) * 0.05;  // cristas tênues

  gl_FragColor = vec4(col, uOpacity * (0.6 + fres * 0.4));
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
      uDeep: { value: [0.01, 0.025, 0.05] },
      uSky: { value: [0.06, 0.1, 0.18] },
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
