import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  SphereGeometry,
  Vector3,
} from "three";

// Pessoa estilizada sentada, inclinada sobre um notebook. Construída por "ossos"
// (cilindros entre dois pontos) + juntas esféricas, dando uma silhueta humana
// reconhecível. Origem local no assento (y=0); a pessoa olha para +Z.

export type Person = {
  group: Group;
  /** Posição local da cabeça (para ancorar o balão). */
  headLocal: Vector3;
  screenLight: PointLight;
  dispose: () => void;
};

export function createPerson(): Person {
  const group = new Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const keep = <T extends { dispose: () => void }>(x: T) => {
    disposables.push(x);
    return x;
  };

  const cloth = keep(new MeshStandardMaterial({ color: new Color("#2b3a57"), roughness: 0.9 }));
  const hood = keep(new MeshStandardMaterial({ color: new Color("#1d2740"), roughness: 0.95 }));
  const skin = keep(new MeshStandardMaterial({ color: new Color("#c79a72"), roughness: 0.7 }));

  const Y = new Vector3(0, 1, 0);
  // Osso = cilindro orientado entre dois pontos, com juntas esféricas nas pontas.
  const bone = (a: Vector3, b: Vector3, r: number, mat: MeshStandardMaterial) => {
    const dir = new Vector3().subVectors(b, a);
    const len = dir.length();
    const geo = keep(new CylinderGeometry(r, r, len, 10));
    const mesh = new Mesh(geo, mat);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(Y, dir.clone().normalize());
    group.add(mesh);
    const jointGeo = keep(new SphereGeometry(r, 10, 8));
    [a, b].forEach((p) => {
      const j = new Mesh(jointGeo, mat);
      j.position.copy(p);
      group.add(j);
    });
  };

  // Pontos do esqueleto (pessoa sentada, leve inclinação para frente).
  const hip = new Vector3(0, 0.04, -0.04);
  const chest = new Vector3(0, 0.46, 0.08);
  const headC = new Vector3(0, 0.66, 0.12);
  const shL = new Vector3(0.16, 0.44, 0.06);
  const shR = new Vector3(-0.16, 0.44, 0.06);
  const elL = new Vector3(0.21, 0.3, 0.26);
  const elR = new Vector3(-0.21, 0.3, 0.26);
  const haL = new Vector3(0.1, 0.22, 0.44);
  const haR = new Vector3(-0.1, 0.22, 0.44);
  const hipL = new Vector3(0.1, 0.04, 0.0);
  const hipR = new Vector3(-0.1, 0.04, 0.0);
  const knL = new Vector3(0.12, 0.08, 0.46);
  const knR = new Vector3(-0.12, 0.08, 0.46);
  const ftL = new Vector3(0.12, -0.32, 0.5);
  const ftR = new Vector3(-0.12, -0.32, 0.5);

  bone(hip, chest, 0.14, cloth); // tronco
  bone(shL, elL, 0.06, cloth); // braços
  bone(shR, elR, 0.06, cloth);
  bone(elL, haL, 0.055, cloth); // antebraços
  bone(elR, haR, 0.055, cloth);
  bone(hipL, knL, 0.09, cloth); // coxas
  bone(hipR, knR, 0.09, cloth);
  bone(knL, ftL, 0.07, cloth); // canelas
  bone(knR, ftR, 0.07, cloth);

  // Cabeça + gorro (clima noturno).
  const headGeo = keep(new SphereGeometry(0.13, 18, 14));
  const head = new Mesh(headGeo, skin);
  head.position.copy(headC);
  group.add(head);
  const beanieGeo = keep(new SphereGeometry(0.145, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.6));
  const beanie = new Mesh(beanieGeo, hood);
  beanie.position.copy(headC).y += 0.02;
  group.add(beanie);

  // ---- Notebook no colo ----
  const laptop = new Group();
  laptop.position.set(0, 0.16, 0.42);
  group.add(laptop);

  const metal = keep(
    new MeshStandardMaterial({ color: new Color("#161c28"), roughness: 0.5, metalness: 0.4 })
  );
  const baseGeo = keep(new BoxGeometry(0.32, 0.022, 0.22));
  const base = new Mesh(baseGeo, metal);
  laptop.add(base);

  // Tela voltada para a pessoa (-Z), emitindo luz (capta o bloom).
  const screenMat = keep(new MeshBasicMaterial({ color: new Color("#bfe9ff") }));
  const screenGeo = keep(new BoxGeometry(0.32, 0.21, 0.016));
  const screen = new Mesh(screenGeo, screenMat);
  screen.position.set(0, 0.1, -0.1);
  screen.rotation.x = 1.95; // tampa inclinada para a pessoa
  laptop.add(screen);

  const screenLight = new PointLight(new Color("#9fd8ff"), 2.2, 5, 2);
  screenLight.position.set(0, 0.22, -0.02);
  laptop.add(screenLight);

  return {
    group,
    headLocal: headC,
    screenLight,
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
