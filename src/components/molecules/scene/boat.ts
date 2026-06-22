import { BoxGeometry, Color, DoubleSide, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { buildHullGeometry, buildSoleGeometry } from "./hullGeometry";
import { createPerson } from "./person";
import { sampleWaveHeight, WATER_LEVEL } from "./waves";

// Bote com remador programando. Estrutura:
//   pivot   → posição (segue a altura da onda) + proa (heading)
//     tilt  → arfagem/balanço (pitch/roll) derivados das ondas reais
//       hull, seat, person
// A pessoa olha para +Z local; o heading rotaciona o conjunto para um 3/4.

const DIMS = { length: 3.2, beam: 1.2, depth: 0.62, sheer: 0.16 };
const HALF_LEN = DIMS.length / 2;
const HALF_BEAM = DIMS.beam / 2;
const HEADING = Math.PI / 3; // 60° → vista em 3/4
const CENTER = new Vector3(0, 0, -8); // posição mundial do barco
// Calado: quanto a LINHA DE ÁGUA fica acima da quilha. A origem local do casco
// está na borda (gunwale, y≈0) e a quilha em y=-depth. Para o barco BOIAR
// (quilha submersa, borda acima da água) elevamos o pivô em relação à onda.
const FREEBOARD = 0.34; // borda acima da linha de água

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
  const keep = <T extends { dispose: () => void }>(x: T) => {
    disposables.push(x);
    return x;
  };

  // Casco curvo com proa/popa em ponta.
  const wood = keep(
    new MeshStandardMaterial({
      color: new Color("#46321f"),
      roughness: 0.85,
      metalness: 0.05,
      side: DoubleSide, // interior do casco visível
    })
  );
  const hullGeo = keep(buildHullGeometry(DIMS));
  const hull = new Mesh(hullGeo, wood);
  tilt.add(hull);

  // Assoalho opaco bem acima da linha de água (que fica em y≈-FREEBOARD local).
  // Folga generosa porque a onda real é curva (soma de senos) e o barco só
  // inclina linearmente — com pouca folga a crista "incha" acima do piso e vaza.
  const soleGeo = keep(buildSoleGeometry(DIMS, -FREEBOARD + 0.2));
  const sole = new Mesh(soleGeo, wood);
  tilt.add(sole);

  // Banco onde a pessoa senta.
  const seatGeo = keep(new BoxGeometry(DIMS.beam * 0.8, 0.07, 0.5));
  const seat = new Mesh(seatGeo, wood);
  seat.position.set(0, 0.02, -0.15);
  tilt.add(seat);

  // Pessoa sentada um pouco à ré, virada para a proa (+Z).
  const person = createPerson();
  person.group.position.set(0, 0.08, -0.15);
  tilt.add(person.group);

  // Direções (mundo) da proa e do través, derivadas do heading.
  const fwd = new Vector3(Math.sin(HEADING), 0, Math.cos(HEADING)); // proa (+Z local)
  const side = new Vector3(Math.cos(HEADING), 0, -Math.sin(HEADING)); // través (+X local)

  // Posição mundial da cabeça (aprox., para ancorar o balão).
  const headWorld = new Vector3()
    .copy(CENTER)
    .addScaledVector(fwd, person.headLocal.z - 0.15)
    .addScaledVector(side, person.headLocal.x);
  headWorld.y = WATER_LEVEL + person.headLocal.y + 0.1;

  const cx = CENTER.x;
  const cz = CENTER.z;

  return {
    object: pivot,
    headWorld,
    update(time) {
      // Amostra a altura da onda em proa, popa e ambos os bordos.
      const hCenter = sampleWaveHeight(cx, cz, time);
      const bowX = cx + fwd.x * HALF_LEN;
      const bowZ = cz + fwd.z * HALF_LEN;
      const sternX = cx - fwd.x * HALF_LEN;
      const sternZ = cz - fwd.z * HALF_LEN;
      const portX = cx + side.x * HALF_BEAM;
      const portZ = cz + side.z * HALF_BEAM;
      const stbdX = cx - side.x * HALF_BEAM;
      const stbdZ = cz - side.z * HALF_BEAM;

      const hBow = sampleWaveHeight(bowX, bowZ, time);
      const hStern = sampleWaveHeight(sternX, sternZ, time);
      const hPort = sampleWaveHeight(portX, portZ, time);
      const hStbd = sampleWaveHeight(stbdX, stbdZ, time);

      // Boia sobre a onda: linha de água em hCenter, borda FREEBOARD acima.
      pivot.position.y = hCenter + FREEBOARD;
      // Inclinações = gradiente local da superfície (proa para cima quando hBow>hStern).
      tilt.rotation.x = -Math.atan2(hBow - hStern, DIMS.length);
      tilt.rotation.z = Math.atan2(hPort - hStbd, DIMS.beam);

      // Cintilação da tela (digitação).
      person.screenLight.intensity = 2.0 + Math.sin(time * 0.006) * 0.4;
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
      person.dispose();
    },
  };
}
