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
  const keep = <T extends { dispose: () => void }>(resource: T) => {
    disposables.push(resource);
    return resource;
  };

  const cloth = keep(new MeshStandardMaterial({ color: new Color("#2b3a57"), roughness: 0.9 }));
  const hood = keep(new MeshStandardMaterial({ color: new Color("#1d2740"), roughness: 0.95 }));
  const skin = keep(new MeshStandardMaterial({ color: new Color("#c79a72"), roughness: 0.7 }));

  const UP = new Vector3(0, 1, 0);
  // Osso = cilindro orientado entre dois pontos, com juntas esféricas nas pontas.
  const bone = (from: Vector3, to: Vector3, radius: number, material: MeshStandardMaterial) => {
    const direction = new Vector3().subVectors(to, from);
    const length = direction.length();
    const limb = new Mesh(keep(new CylinderGeometry(radius, radius, length, 10)), material);
    limb.position.copy(from).add(to).multiplyScalar(0.5);
    limb.quaternion.setFromUnitVectors(UP, direction.clone().normalize());
    group.add(limb);
    const jointGeo = keep(new SphereGeometry(radius, 10, 8));
    [from, to].forEach((point) => {
      const joint = new Mesh(jointGeo, material);
      joint.position.copy(point);
      group.add(joint);
    });
  };

  // Pontos do esqueleto (pessoa sentada, leve inclinação para frente).
  const hip = new Vector3(0, 0.04, -0.04);
  const chest = new Vector3(0, 0.46, 0.08);
  const headCenter = new Vector3(0, 0.66, 0.12);
  const shoulderL = new Vector3(0.16, 0.44, 0.06);
  const shoulderR = new Vector3(-0.16, 0.44, 0.06);
  const elbowL = new Vector3(0.21, 0.3, 0.26);
  const elbowR = new Vector3(-0.21, 0.3, 0.26);
  const handL = new Vector3(0.1, 0.22, 0.44);
  const handR = new Vector3(-0.1, 0.22, 0.44);
  const hipL = new Vector3(0.1, 0.04, 0.0);
  const hipR = new Vector3(-0.1, 0.04, 0.0);
  const kneeL = new Vector3(0.12, 0.08, 0.46);
  const kneeR = new Vector3(-0.12, 0.08, 0.46);
  const footL = new Vector3(0.12, -0.22, 0.5);
  const footR = new Vector3(-0.12, -0.22, 0.5);

  bone(hip, chest, 0.14, cloth); // tronco
  bone(shoulderL, elbowL, 0.06, cloth); // braços
  bone(shoulderR, elbowR, 0.06, cloth);
  bone(elbowL, handL, 0.055, cloth); // antebraços
  bone(elbowR, handR, 0.055, cloth);
  bone(hipL, kneeL, 0.09, cloth); // coxas
  bone(hipR, kneeR, 0.09, cloth);
  bone(kneeL, footL, 0.07, cloth); // canelas
  bone(kneeR, footR, 0.07, cloth);

  // Cabeça + gorro (clima noturno).
  const head = new Mesh(keep(new SphereGeometry(0.13, 18, 14)), skin);
  head.position.copy(headCenter);
  group.add(head);
  const beanieGeo = keep(new SphereGeometry(0.145, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.6));
  const beanie = new Mesh(beanieGeo, hood);
  beanie.position.copy(headCenter).y += 0.02;
  group.add(beanie);

  // ---- Notebook no colo ----
  const laptop = new Group();
  laptop.position.set(0, 0.16, 0.42);
  group.add(laptop);

  const metal = keep(
    new MeshStandardMaterial({ color: new Color("#161c28"), roughness: 0.5, metalness: 0.4 })
  );
  const base = new Mesh(keep(new BoxGeometry(0.32, 0.022, 0.22)), metal);
  laptop.add(base);

  // Tela voltada para a pessoa (-Z), emitindo luz (capta o bloom).
  const screenMat = keep(new MeshBasicMaterial({ color: new Color("#bfe9ff") }));
  const screen = new Mesh(keep(new BoxGeometry(0.32, 0.21, 0.016)), screenMat);
  screen.position.set(0, 0.1, -0.1);
  screen.rotation.x = 1.95; // tampa inclinada para a pessoa
  laptop.add(screen);

  const screenLight = new PointLight(new Color("#9fd8ff"), 2.2, 5, 2);
  screenLight.position.set(0, 0.22, -0.02);
  laptop.add(screenLight);

  return {
    group,
    headLocal: headCenter,
    screenLight,
    dispose() {
      disposables.forEach((resource) => resource.dispose());
    },
  };
}
