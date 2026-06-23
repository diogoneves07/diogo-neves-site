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

// Interpola entre o keyframe inicial e o final conforme o progresso (0..1).
const lerpKeyframes = (frames: Vector3[], progress: number, out: Vector3) =>
  out.copy(frames[0]).lerp(frames[1], progress);

export type Director = {
  /** Progresso de scroll 0..1 (alvo, atualizado pelo ScrollTrigger). */
  progress: number;
  applyCamera: (camera: PerspectiveCamera, progress: number, time: number, motion: number) => void;
  raf: (time: number) => void;
  dispose: () => void;
};

const scratchPos = new Vector3();
const scratchLook = new Vector3();

export function createDirector(root: HTMLElement, reduceMotion: boolean): Director {
  const state: Director = {
    progress: 0,
    applyCamera(camera, progress, time, motion) {
      lerpKeyframes(CAM_POS, progress, scratchPos);
      lerpKeyframes(CAM_LOOK, progress, scratchLook);
      // Em retrato (smartphone) a cena sobe e fica atrás do texto do hero.
      // Inclinamos a câmera para cima (alvo mais alto) → o barco desce para perto
      // do rodapé. Proporcional a quão estreita é a tela; 0 no desktop (sem efeito).
      const portraitAmount = Math.max(0, 1 - camera.aspect);
      scratchLook.y += portraitAmount * 4.4;
      // Balanço ocioso suave da câmera; motion=0 (reduced-motion) o congela.
      const drift = time * 0.0002 * motion;
      camera.position.set(
        scratchPos.x + Math.sin(drift) * 0.4,
        scratchPos.y + Math.cos(drift * 0.8) * 0.3,
        scratchPos.z
      );
      camera.lookAt(scratchLook);
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
