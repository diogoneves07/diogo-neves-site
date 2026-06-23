// Fonte única da verdade para a ondulação da água.
// O MESMO campo de ondas é usado pelo shader (WAVE_GLSL) e pela física do
// barco (sampleWaveHeight), garantindo que o barco siga as ondas reais.
// Os números das três ondas aparecem no GLSL e no espelho JS abaixo: ao ajustar
// uma onda, mude os DOIS lados juntos (são duas linguagens, não dá para importar).

export const WATER_LEVEL = -3.1; // y mundial da superfície
export const WATER_PLANE_Z = -14; // z mundial do centro do plano de água
export const WIND = 1.0; // intensidade fixa do vento

// Zona de calmaria ao redor do barco: as ondulações diminuem perto dele para que
// a crista (curva) não transborde o assoalho (plano) conforme as ondas passam.
// Aplicada no shader E na física — o bote segue a água calma, sem descasamento.
const CALM_AMPLITUDE_AT_CENTER = 0.5; // amplitude no centro do barco (fração da normal)
const CALM_INNER_RADIUS = 1.0; // raio onde a calmaria começa a ceder
const CALM_OUTER_RADIUS = 9.0; // raio onde a água volta ao normal
// Barco em (0,0,-8) mundial → coords locais do plano: (0, -6).
const BOAT_LOCAL_X = 0.0;
const BOAT_LOCAL_Y = -6.0;

// As três ondas que somadas formam a superfície (espelho JS dos senos do GLSL).
const WAVE_A = { dirX: 1.0, dirY: 0.3, frequency: 0.55, speed: 2.2, amplitude: 0.42 };
const WAVE_B = { dirX: -0.4, dirY: 1.0, frequency: 0.9, speed: 1.6, amplitude: 0.26 };
const WAVE_C = { dirX: 0.8, dirY: -0.6, frequency: 1.7, speed: 3.1, amplitude: 0.12 };

// GLSL: define wave(), calm() e surface(); usa os uniforms uTime (ms) e uWind.
// (Literais float escritos à mão de propósito — GLSL exige o ".0".)
export const WAVE_GLSL = /* glsl */ `
float wave(vec2 point, vec2 direction, float frequency, float speed, float amplitude){
  return sin(dot(point, direction) * frequency + uTime * 0.001 * speed) * amplitude;
}
float calm(vec2 point){
  float distanceToBoat = distance(point, vec2(${BOAT_LOCAL_X.toFixed(1)}, ${BOAT_LOCAL_Y.toFixed(1)}));
  return mix(${CALM_AMPLITUDE_AT_CENTER.toFixed(2)}, 1.0, smoothstep(${CALM_INNER_RADIUS.toFixed(1)}, ${CALM_OUTER_RADIUS.toFixed(1)}, distanceToBoat));
}
float surface(vec2 point){
  float height = 0.0;
  height += wave(point, normalize(vec2(1.0, 0.3)), 0.55, 2.2, 0.42 * uWind);
  height += wave(point, normalize(vec2(-0.4, 1.0)), 0.9, 1.6, 0.26 * uWind);
  height += wave(point, normalize(vec2(0.8, -0.6)), 1.7, 3.1, 0.12 * uWind);
  return height * calm(point);
}
`;

const normalize2D = (x: number, y: number): [number, number] => {
  const length = Math.hypot(x, y) || 1;
  return [x / length, y / length];
};
const directionA = normalize2D(WAVE_A.dirX, WAVE_A.dirY);
const directionB = normalize2D(WAVE_B.dirX, WAVE_B.dirY);
const directionC = normalize2D(WAVE_C.dirX, WAVE_C.dirY);

// Espelho em JS de calm(): mesma calmaria radial ao redor do barco.
const calm = (pointX: number, pointY: number): number => {
  const distanceToBoat = Math.hypot(pointX - BOAT_LOCAL_X, pointY - BOAT_LOCAL_Y);
  const ramp = Math.min(1, Math.max(0, (distanceToBoat - CALM_INNER_RADIUS) / (CALM_OUTER_RADIUS - CALM_INNER_RADIUS)));
  const smooth = ramp * ramp * (3 - 2 * ramp); // smoothstep
  return CALM_AMPLITUDE_AT_CENTER + (1 - CALM_AMPLITUDE_AT_CENTER) * smooth;
};

// Espelho em JS de surface(): altura da onda em coordenadas LOCAIS do plano.
const surfaceLocal = (pointX: number, pointY: number, timeMs: number, wind: number): number => {
  const sampleWave = (
    direction: [number, number],
    frequency: number,
    speed: number,
    amplitude: number
  ) =>
    Math.sin((pointX * direction[0] + pointY * direction[1]) * frequency + timeMs * 0.001 * speed) *
    amplitude;
  return (
    (sampleWave(directionA, WAVE_A.frequency, WAVE_A.speed, WAVE_A.amplitude * wind) +
      sampleWave(directionB, WAVE_B.frequency, WAVE_B.speed, WAVE_B.amplitude * wind) +
      sampleWave(directionC, WAVE_C.frequency, WAVE_C.speed, WAVE_C.amplitude * wind)) *
    calm(pointX, pointY)
  );
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
  const localX = worldX;
  const localY = -(worldZ - WATER_PLANE_Z);
  return WATER_LEVEL + surfaceLocal(localX, localY, timeMs, wind);
};
