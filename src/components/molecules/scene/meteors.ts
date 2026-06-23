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
const STREAK_COUNT = 3; // quantos riscos coexistem (reaproveitados, não recriados)

// Textura do risco: cauda transparente → cabeça brilhante (gradiente horizontal).
const makeStreakTexture = (): CanvasTexture | null => {
  if (typeof document === "undefined") return null;
  const width = 256;
  const height = 32;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const tail = ctx.createLinearGradient(0, 0, width, 0);
  tail.addColorStop(0.0, "rgba(255,255,255,0)");
  tail.addColorStop(0.75, "rgba(200,220,255,0.5)");
  tail.addColorStop(1.0, "rgba(255,255,255,1)");
  ctx.fillStyle = tail;
  ctx.fillRect(0, height * 0.35, width, height * 0.3);
  // Glow da cabeça.
  const head = ctx.createRadialGradient(width - 16, height / 2, 0, width - 16, height / 2, 16);
  head.addColorStop(0, "rgba(255,255,255,1)");
  head.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = head;
  ctx.fillRect(width - 40, 0, 40, height);
  return new CanvasTexture(canvas);
};

type Streak = {
  mesh: Mesh;
  active: boolean;
  nextSpawnTime: number; // próximo tempo de spawn (ms)
  startTime: number; // tempo de início da passagem
  durationMs: number;
  originX: number;
  originY: number;
  velocityX: number;
  velocityY: number;
  lengthScale: number;
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
  const geometry = new PlaneGeometry(1, 0.18);
  const streaks: Streak[] = [];

  for (let i = 0; i < STREAK_COUNT; i += 1) {
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      opacity: 0,
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.z = SKY_Z;
    mesh.visible = false;
    group.add(mesh);
    streaks.push({
      mesh,
      active: false,
      // Espalha os primeiros disparos no tempo para não saírem todos juntos.
      nextSpawnTime: 700 + Math.random() * 2500 + i * 1500,
      startTime: 0,
      durationMs: 1,
      originX: 0,
      originY: 0,
      velocityX: 0,
      velocityY: 0,
      lengthScale: 10,
    });
  }

  // Sorteia uma nova passagem: posição de início no alto e direção diagonal
  // para baixo (esquerda ou direita), normalizada para uma distância de viagem.
  const spawn = (streak: Streak, time: number) => {
    streak.active = true;
    streak.startTime = time;
    streak.durationMs = 800 + Math.random() * 500;
    streak.lengthScale = 9 + Math.random() * 7;
    streak.originX = (Math.random() - 0.5) * 60;
    streak.originY = 6 + Math.random() * 18;
    const horizontalSign = (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.7);
    const travelDistance = 26 + Math.random() * 16;
    let dirX = horizontalSign;
    let dirY = -(0.7 + Math.random() * 0.5);
    const length = Math.hypot(dirX, dirY) || 1;
    streak.velocityX = (dirX / length) * travelDistance;
    streak.velocityY = (dirY / length) * travelDistance;
    streak.mesh.rotation.z = Math.atan2(streak.velocityY, streak.velocityX);
    streak.mesh.scale.set(streak.lengthScale, 1, 1);
    streak.mesh.visible = true;
  };

  const retire = (streak: Streak, time: number) => {
    streak.active = false;
    streak.mesh.visible = false;
    (streak.mesh.material as MeshBasicMaterial).opacity = 0;
    streak.nextSpawnTime = time + 2500 + Math.random() * 9000;
  };

  return {
    object: group,
    update(time) {
      for (const streak of streaks) {
        if (!streak.active) {
          if (time >= streak.nextSpawnTime) spawn(streak, time);
          continue;
        }
        const progress = (time - streak.startTime) / streak.durationMs; // 0..1
        if (progress >= 1) {
          retire(streak, time);
          continue;
        }
        streak.mesh.position.x = streak.originX + streak.velocityX * progress;
        streak.mesh.position.y = streak.originY + streak.velocityY * progress;
        // Fade-in rápido, fade-out longo (rastro sumindo).
        (streak.mesh.material as MeshBasicMaterial).opacity =
          Math.min(progress * 6, 1) * (1 - progress * progress);
      }
    },
    dispose() {
      geometry.dispose();
      texture.dispose();
      streaks.forEach((streak) => (streak.mesh.material as MeshBasicMaterial).dispose());
    },
  };
}
