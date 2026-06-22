import type { PerspectiveCamera } from "three";
import { Vector3 } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// Keyframes de câmera: já chegamos perto do barco → close-up final.
// O barco está em z=-8; partir de z≈6.5 deixa o remador grande logo de cara.
const CAM_POS: Vector3[] = [new Vector3(1.8, 0.5, 6.5), new Vector3(0.2, -0.4, 3.6)];
const CAM_LOOK: Vector3[] = [new Vector3(0, -2.2, -8), new Vector3(0, -2.8, -9)];

const sample = (frames: Vector3[], t: number, out: Vector3) =>
  out.copy(frames[0]).lerp(frames[1], t);

export type Director = {
  /** Progresso de scroll 0..1 (alvo, atualizado pelo ScrollTrigger). */
  progress: number;
  applyCamera: (camera: PerspectiveCamera, progress: number, time: number, motion: number) => void;
  raf: (time: number) => void;
  dispose: () => void;
};

const tmpPos = new Vector3();
const tmpLook = new Vector3();

export function createDirector(root: HTMLElement, reduceMotion: boolean): Director {
  const state: Director = {
    progress: 0,
    applyCamera(camera, progress, time, motion) {
      sample(CAM_POS, progress, tmpPos);
      sample(CAM_LOOK, progress, tmpLook);
      // Em retrato (smartphone) a cena sobe e fica atrás do texto do hero.
      // Inclinamos a câmera para cima (alvo mais alto) → o barco desce para perto
      // do rodapé. Proporcional a quão estreita é a tela; 0 no desktop (sem efeito).
      const portrait = Math.max(0, 1 - camera.aspect);
      tmpLook.y += portrait * 4.4;
      const t = time * 0.0002 * motion;
      camera.position.set(
        tmpPos.x + Math.sin(t) * 0.4,
        tmpPos.y + Math.cos(t * 0.8) * 0.3,
        tmpPos.z
      );
      camera.lookAt(tmpLook);
    },
    raf: () => undefined,
    dispose: () => undefined,
  };

  // Sem Lenis quando o usuário pede menos movimento — usa scroll nativo.
  const lenis = reduceMotion
    ? null
    : new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        anchors: {
          offset: 24,
          duration: 0.78,
        },
      });

  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  const trigger = ScrollTrigger.create({
    trigger: root,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      state.progress = self.progress;
    },
  });

  state.raf = (time: number) => {
    if (lenis) lenis.raf(time);
  };

  state.dispose = () => {
    trigger.kill();
    lenis?.destroy();
  };

  return state;
}
