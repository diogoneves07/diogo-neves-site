import { BoxGeometry, Color, DoubleSide, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { buildHullGeometry, buildSoleGeometry } from "./hullGeometry";
import { createPerson } from "./person";
import { sampleWaveHeight, WATER_LEVEL } from "./waves";

// Bote com remador programando. Estrutura:
//   pivot   → posição (segue a altura da onda) + proa (heading)
//     tilt  → arfagem/balanço (pitch/roll) derivados das ondas reais
//       hull, seat, person
// A pessoa olha para +Z local; o heading rotaciona o conjunto para um 3/4.

const HULL_DIMS = { length: 3.2, beam: 1.2, depth: 0.62, sheer: 0.16 };
const HALF_LENGTH = HULL_DIMS.length / 2;
const HALF_BEAM = HULL_DIMS.beam / 2;
const HEADING = Math.PI / 3; // 60° → vista em 3/4
const CENTER = new Vector3(0, 0, -8); // posição mundial do barco
// Calado: quanto a LINHA DE ÁGUA fica acima da quilha. A origem local do casco
// está na borda (gunwale, y≈0) e a quilha em y=-depth. Para o barco BOIAR
// (quilha submersa, borda acima da água) elevamos o pivô em relação à onda.
const FREEBOARD = 0.34; // borda acima da linha de água
const SOLE_RISE_ABOVE_WATERLINE = 0.2; // folga do assoalho acima da linha de água
const SEAT_FORWARD_OFFSET = -0.15; // banco/pessoa um pouco à ré do centro
const SCREEN_LIGHT_BASE = 2.0; // brilho médio da tela do notebook
const SCREEN_LIGHT_FLICKER = 0.4; // amplitude da cintilação (digitação)

export type Boat = {
  object: Group;
  /** Posição mundial aproximada da cabeça (alvo do balão). */
  headWorld: Vector3;
  update: (time: number) => void;
  dispose: () => void;
};

export function createBoat(): Boat {
  const pivot = new Group();
  pivot.position.set(CENTER.x, WATER_LEVEL + FREEBOARD, CENTER.z);
  pivot.rotation.y = HEADING;

  const tilt = new Group();
  pivot.add(tilt);

  const disposables: Array<{ dispose: () => void }> = [];
  const keep = <T extends { dispose: () => void }>(resource: T) => {
    disposables.push(resource);
    return resource;
  };

  const wood = keep(
    new MeshStandardMaterial({
      color: new Color("#46321f"),
      roughness: 0.85,
      metalness: 0.05,
      side: DoubleSide, // interior do casco visível
    })
  );

  // Casco curvo com proa/popa em ponta.
  const hull = new Mesh(keep(buildHullGeometry(HULL_DIMS)), wood);
  tilt.add(hull);

  // Assoalho opaco bem acima da linha de água (que fica em y≈-FREEBOARD local).
  // Folga generosa porque a onda real é curva (soma de senos) e o barco só
  // inclina linearmente — com pouca folga a crista "incha" acima do piso e vaza.
  const soleY = -FREEBOARD + SOLE_RISE_ABOVE_WATERLINE;
  const sole = new Mesh(keep(buildSoleGeometry(HULL_DIMS, soleY)), wood);
  tilt.add(sole);

  // Banco onde a pessoa senta.
  const seat = new Mesh(keep(new BoxGeometry(HULL_DIMS.beam * 0.8, 0.07, 0.5)), wood);
  seat.position.set(0, 0.02, SEAT_FORWARD_OFFSET);
  tilt.add(seat);

  // Pessoa sentada um pouco à ré, virada para a proa (+Z).
  const person = createPerson();
  person.group.position.set(0, 0.08, SEAT_FORWARD_OFFSET);
  tilt.add(person.group);

  // Direções (mundo) da proa e do través, derivadas do heading.
  const bowDir = new Vector3(Math.sin(HEADING), 0, Math.cos(HEADING)); // proa (+Z local)
  const beamDir = new Vector3(Math.cos(HEADING), 0, -Math.sin(HEADING)); // través (+X local)

  // Posição mundial da cabeça (aprox., para ancorar o balão).
  const headWorld = new Vector3()
    .copy(CENTER)
    .addScaledVector(bowDir, person.headLocal.z + SEAT_FORWARD_OFFSET)
    .addScaledVector(beamDir, person.headLocal.x);
  headWorld.y = WATER_LEVEL + person.headLocal.y + 0.1;

  const centerX = CENTER.x;
  const centerZ = CENTER.z;

  return {
    object: pivot,
    headWorld,
    update(time) {
      // Amostra a altura da onda em proa, popa e ambos os bordos.
      const heightCenter = sampleWaveHeight(centerX, centerZ, time);
      const heightBow = sampleWaveHeight(
        centerX + bowDir.x * HALF_LENGTH,
        centerZ + bowDir.z * HALF_LENGTH,
        time
      );
      const heightStern = sampleWaveHeight(
        centerX - bowDir.x * HALF_LENGTH,
        centerZ - bowDir.z * HALF_LENGTH,
        time
      );
      const heightPort = sampleWaveHeight(
        centerX + beamDir.x * HALF_BEAM,
        centerZ + beamDir.z * HALF_BEAM,
        time
      );
      const heightStarboard = sampleWaveHeight(
        centerX - beamDir.x * HALF_BEAM,
        centerZ - beamDir.z * HALF_BEAM,
        time
      );

      // Boia sobre a onda: linha de água em heightCenter, borda FREEBOARD acima.
      pivot.position.y = heightCenter + FREEBOARD;
      // Inclinações = gradiente local da superfície (proa para cima quando bow>stern).
      tilt.rotation.x = -Math.atan2(heightBow - heightStern, HULL_DIMS.length);
      tilt.rotation.z = Math.atan2(heightPort - heightStarboard, HULL_DIMS.beam);

      // Cintilação da tela (digitação).
      person.screenLight.intensity = SCREEN_LIGHT_BASE + Math.sin(time * 0.006) * SCREEN_LIGHT_FLICKER;
    },
    dispose() {
      disposables.forEach((resource) => resource.dispose());
      person.dispose();
    },
  };
}
