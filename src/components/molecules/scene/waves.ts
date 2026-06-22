// Fonte única da verdade para a ondulação da água.
// O MESMO campo de ondas é usado pelo shader (WAVE_GLSL) e pela física do
// barco (sampleWaveHeight), garantindo que o barco siga as ondas reais.

export const WATER_LEVEL = -3.1; // y mundial da superfície
export const WATER_PLANE_Z = -14; // z mundial do centro do plano de água
export const WIND = 1.0; // intensidade fixa do vento

// Zona de calmaria ao redor do barco: as ondulações diminuem perto dele para que
// a crista (curva) não transborde o assoalho (plano) conforme as ondas passam.
// Aplicada no shader E na física — o bote segue a água calma, sem descasamento.
const CALM_MIN = 0.5; // amplitude no centro do barco (fração da normal)
const CALM_R0 = 1.0; // raio onde a calmaria começa a ceder
const CALM_R1 = 9.0; // raio onde a água volta ao normal
// Barco em (0,0,-8) mundial → coords locais do plano: (0, -6).
const BOAT_LX = 0.0;
const BOAT_LY = -6.0;

// GLSL: define wave(), calm() e surface(); usa os uniforms uTime (ms) e uWind.
export const WAVE_GLSL = /* glsl */ `
float wave(vec2 p, vec2 dir, float freq, float speed, float amp){
  return sin(dot(p, dir) * freq + uTime * 0.001 * speed) * amp;
}
float calm(vec2 p){
  float d = distance(p, vec2(${BOAT_LX.toFixed(1)}, ${BOAT_LY.toFixed(1)}));
  return mix(${CALM_MIN.toFixed(2)}, 1.0, smoothstep(${CALM_R0.toFixed(1)}, ${CALM_R1.toFixed(1)}, d));
}
float surface(vec2 p){
  float h = 0.0;
  h += wave(p, normalize(vec2(1.0, 0.3)), 0.55, 2.2, 0.42 * uWind);
  h += wave(p, normalize(vec2(-0.4, 1.0)), 0.9, 1.6, 0.26 * uWind);
  h += wave(p, normalize(vec2(0.8, -0.6)), 1.7, 3.1, 0.12 * uWind);
  return h * calm(p);
}
`;

const norm = (x: number, y: number): [number, number] => {
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};
const D1 = norm(1.0, 0.3);
const D2 = norm(-0.4, 1.0);
const D3 = norm(0.8, -0.6);

// Espelho em JS de calm(): mesma calmaria radial ao redor do barco.
const calm = (px: number, py: number): number => {
  const d = Math.hypot(px - BOAT_LX, py - BOAT_LY);
  const t = Math.min(1, Math.max(0, (d - CALM_R0) / (CALM_R1 - CALM_R0)));
  const s = t * t * (3 - 2 * t); // smoothstep
  return CALM_MIN + (1 - CALM_MIN) * s;
};

// Espelho em JS de surface(): altura da onda em coordenadas LOCAIS do plano.
const surfaceLocal = (px: number, py: number, timeMs: number, wind: number): number => {
  const w = (dx: number, dy: number, f: number, s: number, a: number) =>
    Math.sin((px * dx + py * dy) * f + timeMs * 0.001 * s) * a;
  return (
    w(D1[0], D1[1], 0.55, 2.2, 0.42 * wind) +
    w(D2[0], D2[1], 0.9, 1.6, 0.26 * wind) +
    w(D3[0], D3[1], 1.7, 3.1, 0.12 * wind)
  ) * calm(px, py);
};

// Altura MUNDIAL da água em (worldX, worldZ). Converte para o espaço local do
// plano (rotacionado -90° em X e transladado): localX = worldX,
// localY = -(worldZ - WATER_PLANE_Z).
export const sampleWaveHeight = (
  worldX: number,
  worldZ: number,
  timeMs: number,
  wind = WIND
): number => {
  const lx = worldX;
  const ly = -(worldZ - WATER_PLANE_Z);
  return WATER_LEVEL + surfaceLocal(lx, ly, timeMs, wind);
};
