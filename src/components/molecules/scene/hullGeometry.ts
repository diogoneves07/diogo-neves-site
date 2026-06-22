import { BufferGeometry, Float32BufferAttribute } from "three";

export type HullDims = {
  length: number; // ao longo de Z (proa em +Z)
  beam: number; // largura (X)
  depth: number; // profundidade do casco (Y)
  sheer: number; // elevação da borda na proa/popa
};

// Casco de bote por malha paramétrica: em cada "estação" ao longo do
// comprimento, a seção transversal é um U (parábola) cuja largura/altura
// afunilam até virar ponta na proa e na popa. A borda (sheer) sobe nas pontas.
export function buildHullGeometry(dims: HullDims): BufferGeometry {
  const { length, beam, depth, sheer } = dims;
  const NL = 28; // estações ao longo do comprimento
  const NA = 14; // pontos no arco da seção
  const row = NA + 1;

  const positions: number[] = [];
  for (let i = 0; i <= NL; i += 1) {
    const u = i / NL; // 0..1
    const z = (u - 0.5) * length;
    const taper = Math.pow(Math.sin(Math.PI * u), 0.55); // 0 nas pontas, 1 no meio
    const halfBeam = (beam / 2) * taper;
    const dep = depth * taper;
    const sheerRise = sheer * Math.pow(2 * u - 1, 2); // borda sobe nas pontas

    for (let j = 0; j <= NA; j += 1) {
      const s = (j / NA) * 2 - 1; // -1..1 (bombordo→boreste)
      const x = halfBeam * s;
      const y = -dep * (1 - s * s) + sheerRise; // U: quilha no centro, borda em cima
      positions.push(x, y, z);
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < NL; i += 1) {
    for (let j = 0; j < NA; j += 1) {
      const a = i * row + j;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Assoalho (sole) opaco que tampa o interior do casco. No meio fica plano em
// y=yFloor (acima da linha de água); rumo à proa/popa, onde o fundo do casco
// sobe e já não alcança yFloor, o piso ACOMPANHA a quilha (logo acima dela) em
// vez de afunilar para um ponto — assim cobre o comprimento inteiro e não deixa
// a água vazar nas pontas. Sem ele o bote parece alagado.
export function buildSoleGeometry(dims: HullDims, yFloor: number): BufferGeometry {
  const { length, beam, depth, sheer } = dims;
  const NL = 28;

  const positions: number[] = [];
  for (let i = 0; i <= NL; i += 1) {
    const u = i / NL;
    const z = (u - 0.5) * length;
    const taper = Math.pow(Math.sin(Math.PI * u), 0.55);
    const halfBeam = (beam / 2) * taper;
    const dep = depth * taper;
    const sheerRise = sheer * Math.pow(2 * u - 1, 2);

    // Quilha (fundo do casco, s=0) nesta estação.
    const keelY = -dep + sheerRise;
    // Piso plano no meio; perto das pontas sobe junto da quilha (+2cm).
    const y = Math.max(yFloor, keelY + 0.02);

    // Parede do casco: y = -dep*(1 - s²) + sheerRise. Resolve s² nesta altura.
    let xEdge = 0;
    if (dep > 1e-4) {
      const s2 = 1 - (sheerRise - y) / dep;
      if (s2 > 0) xEdge = halfBeam * Math.sqrt(Math.min(1, s2));
    }
    positions.push(-xEdge, y, z, xEdge, y, z);
  }

  const indices: number[] = [];
  for (let i = 0; i < NL; i += 1) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
