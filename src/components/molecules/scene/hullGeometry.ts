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
