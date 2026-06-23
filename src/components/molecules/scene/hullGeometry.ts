import { BufferGeometry, Float32BufferAttribute } from "three";

export type HullDims = {
  length: number; // ao longo de Z (proa em +Z)
  beam: number; // largura (X)
  depth: number; // profundidade do casco (Y)
  sheer: number; // elevação da borda na proa/popa
};

// Quantas fatias ao longo do comprimento e quantos pontos no arco da seção.
// Mais fatias = casco mais liso, porém mais triângulos. 28×14 é suficiente.
const LENGTH_SEGMENTS = 28; // "estações" ao longo do comprimento
const ARC_SEGMENTS = 14; // pontos no arco de cada seção transversal

// Largura/altura da seção afunilam de 1 (meio) até 0 (pontas). O expoente 0.55
// deixa a curva cheia no meio e fina nas pontas, dando o formato de bote.
const TAPER_EXPONENT = 0.55;

// Em cada fatia "i", o quanto a seção encolheu (0 nas pontas, 1 no meio) e o
// quanto a borda subiu nas pontas (efeito "sheer").
const sectionTaper = (lengthFraction: number) =>
  Math.pow(Math.sin(Math.PI * lengthFraction), TAPER_EXPONENT);
const sheerRiseAt = (lengthFraction: number, sheer: number) =>
  sheer * Math.pow(2 * lengthFraction - 1, 2);

// Casco de bote por malha paramétrica: em cada "estação" ao longo do
// comprimento, a seção transversal é um U (parábola) cuja largura/altura
// afunilam até virar ponta na proa e na popa. A borda (sheer) sobe nas pontas.
export function buildHullGeometry(dims: HullDims): BufferGeometry {
  const { length, beam, depth, sheer } = dims;
  const pointsPerRow = ARC_SEGMENTS + 1;

  const positions: number[] = [];
  for (let station = 0; station <= LENGTH_SEGMENTS; station += 1) {
    const lengthFraction = station / LENGTH_SEGMENTS; // 0..1 (popa→proa)
    const z = (lengthFraction - 0.5) * length;
    const taper = sectionTaper(lengthFraction);
    const halfBeam = (beam / 2) * taper;
    const sectionDepth = depth * taper;
    const sheerRise = sheerRiseAt(lengthFraction, sheer);

    for (let arc = 0; arc <= ARC_SEGMENTS; arc += 1) {
      const side = (arc / ARC_SEGMENTS) * 2 - 1; // -1..1 (bombordo→boreste)
      const x = halfBeam * side;
      const y = -sectionDepth * (1 - side * side) + sheerRise; // U: quilha no centro, borda em cima
      positions.push(x, y, z);
    }
  }

  const indices: number[] = [];
  for (let station = 0; station < LENGTH_SEGMENTS; station += 1) {
    for (let arc = 0; arc < ARC_SEGMENTS; arc += 1) {
      const topLeft = station * pointsPerRow + arc;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + pointsPerRow;
      const bottomRight = bottomLeft + 1;
      indices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight);
    }
  }

  return finalizeGeometry(positions, indices);
}

// Assoalho (sole) opaco que tampa o interior do casco. No meio fica plano em
// y=floorY (acima da linha de água); rumo à proa/popa, onde o fundo do casco
// sobe e já não alcança floorY, o piso ACOMPANHA a quilha (logo acima dela) em
// vez de afunilar para um ponto — assim cobre o comprimento inteiro e não deixa
// a água vazar nas pontas. Sem ele o bote parece alagado.
export function buildSoleGeometry(dims: HullDims, floorY: number): BufferGeometry {
  const { length, beam, depth, sheer } = dims;

  const positions: number[] = [];
  for (let station = 0; station <= LENGTH_SEGMENTS; station += 1) {
    const lengthFraction = station / LENGTH_SEGMENTS;
    const z = (lengthFraction - 0.5) * length;
    const taper = sectionTaper(lengthFraction);
    const halfBeam = (beam / 2) * taper;
    const sectionDepth = depth * taper;
    const sheerRise = sheerRiseAt(lengthFraction, sheer);

    // Quilha (fundo do casco, side=0) nesta estação.
    const keelY = -sectionDepth + sheerRise;
    // Piso plano no meio; perto das pontas sobe junto da quilha (+2cm).
    const y = Math.max(floorY, keelY + 0.02);

    // Onde o piso encosta na parede do casco: resolve side² na equação da parede
    // (y = -sectionDepth*(1 - side²) + sheerRise) para achar o x da borda.
    let edgeX = 0;
    if (sectionDepth > 1e-4) {
      const sideSquared = 1 - (sheerRise - y) / sectionDepth;
      if (sideSquared > 0) edgeX = halfBeam * Math.sqrt(Math.min(1, sideSquared));
    }
    positions.push(-edgeX, y, z, edgeX, y, z);
  }

  const indices: number[] = [];
  for (let station = 0; station < LENGTH_SEGMENTS; station += 1) {
    const leftNear = station * 2;
    const rightNear = leftNear + 1;
    const leftFar = leftNear + 2;
    const rightFar = leftNear + 3;
    indices.push(leftNear, leftFar, rightNear, rightNear, leftFar, rightFar);
  }

  return finalizeGeometry(positions, indices);
}

const finalizeGeometry = (positions: number[], indices: number[]): BufferGeometry => {
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};
