import {
  AdditiveBlending,
  CanvasTexture,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
} from "three";

// Estrelas cadentes / meteoros: um pequeno pool de riscos luminosos que cruzam
// o céu de tempos em tempos, em intervalos aleatórios. Vivem num plano distante
// (z fixo) voltado para a câmera; o risco é orientado ao longo da velocidade.

const SKY_Z = -48;
const POOL = 3;

// Textura do risco: cauda transparente → cabeça brilhante (gradiente horizontal).
const makeStreakTexture = (): CanvasTexture | null => {
  if (typeof document === "undefined") return null;
  const W = 256;
  const H = 32;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0.0, "rgba(255,255,255,0)");
  g.addColorStop(0.75, "rgba(200,220,255,0.5)");
  g.addColorStop(1.0, "rgba(255,255,255,1)");
  ctx.fillStyle = g;
  ctx.fillRect(0, H * 0.35, W, H * 0.3);
  // Glow da cabeça.
  const head = ctx.createRadialGradient(W - 16, H / 2, 0, W - 16, H / 2, 16);
  head.addColorStop(0, "rgba(255,255,255,1)");
  head.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = head;
  ctx.fillRect(W - 40, 0, 40, H);
  return new CanvasTexture(canvas);
};

type Streak = {
  mesh: Mesh;
  active: boolean;
  next: number; // próximo tempo de spawn (ms)
  start: number; // tempo de início da passagem
  duration: number;
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  len: number;
};

export type Meteors = {
  object: Group;
  update: (time: number) => void;
  dispose: () => void;
};

export function createMeteors(): Meteors | null {
  const texture = makeStreakTexture();
  if (!texture) return null;

  const group = new Group();
  const geo = new PlaneGeometry(1, 0.18);
  const streaks: Streak[] = [];

  for (let i = 0; i < POOL; i += 1) {
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      opacity: 0,
    });
    const mesh = new Mesh(geo, material);
    mesh.position.z = SKY_Z;
    mesh.visible = false;
    group.add(mesh);
    streaks.push({
      mesh,
      active: false,
      next: 700 + Math.random() * 2500 + i * 1500,
      start: 0,
      duration: 1,
      x0: 0,
      y0: 0,
      dx: 0,
      dy: 0,
      len: 10,
    });
  }

  const spawn = (s: Streak, time: number) => {
    s.active = true;
    s.start = time;
    s.duration = 800 + Math.random() * 500;
    s.len = 9 + Math.random() * 7;
    // Começa no alto da sky visível, viaja na diagonal para baixo (esq. ou dir.).
    s.x0 = (Math.random() - 0.5) * 60;
    s.y0 = 6 + Math.random() * 18;
    const horiz = (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.7);
    const travel = 26 + Math.random() * 16;
    s.dx = horiz;
    s.dy = -(0.7 + Math.random() * 0.5);
    const norm = Math.hypot(s.dx, s.dy) || 1;
    s.dx = (s.dx / norm) * travel;
    s.dy = (s.dy / norm) * travel;
    s.mesh.rotation.z = Math.atan2(s.dy, s.dx);
    s.mesh.scale.set(s.len, 1, 1);
    s.mesh.visible = true;
  };

  return {
    object: group,
    update(time) {
      for (const s of streaks) {
        if (!s.active) {
          if (time >= s.next) spawn(s, time);
          continue;
        }
        const p = (time - s.start) / s.duration; // 0..1
        if (p >= 1) {
          s.active = false;
          s.mesh.visible = false;
          (s.mesh.material as MeshBasicMaterial).opacity = 0;
          s.next = time + 2500 + Math.random() * 9000;
          continue;
        }
        s.mesh.position.x = s.x0 + s.dx * p;
        s.mesh.position.y = s.y0 + s.dy * p;
        // Fade-in rápido, fade-out longo (rastro sumindo).
        (s.mesh.material as MeshBasicMaterial).opacity =
          Math.min(p * 6, 1) * (1 - p * p);
      }
    },
    dispose() {
      geo.dispose();
      texture.dispose();
      streaks.forEach((s) => (s.mesh.material as MeshBasicMaterial).dispose());
    },
  };
}
