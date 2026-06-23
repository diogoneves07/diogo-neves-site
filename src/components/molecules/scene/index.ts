import {
  AmbientLight,
  Color,
  FogExp2,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { detectQuality } from "./quality";
import { createDirector } from "./director";
import { createStarfield } from "./starfield";
import { createMoon } from "./moon";
import { createMeteors } from "./meteors";
import { createWater } from "./water";
import { createBoat } from "./boat";
import { createThoughtBubble } from "./thoughtBubble";
import { createPost } from "./post";

type Dispose = () => void;

export function mountPortfolioScene(root: HTMLElement): Dispose {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-portfolio-scene]");
  if (!canvas) {
    return () => undefined;
  }

  const profile = detectQuality();
  const motion = profile.reduceMotion ? 0 : 1;

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !profile.postprocessing,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(profile.pixelRatio);

  const scene = new Scene();
  // Céu noturno: azul quase preto, com névoa tênue para dar profundidade.
  scene.background = new Color("#05070f");
  scene.fog = new FogExp2(new Color("#080c16"), 0.01);

  const camera = new PerspectiveCamera(42, 1, 0.1, 220);
  camera.position.set(1.8, 0.5, 6.5);

  // Luz ambiente fria. O luar direcional vive dentro do módulo da Lua (moon.ts),
  // acompanhando sua posição responsiva.
  const ambient = new AmbientLight(new Color("#1b2740"), 0.8);
  scene.add(ambient);

  // Cintilação das estrelas é sutil e ambiente → sempre ligada (1).
  const starfield = createStarfield(profile.starCount, profile.pixelRatio, 1);
  const moon = createMoon();
  const meteors = createMeteors();
  const water = createWater();
  const boat = createBoat();
  const bubble = createThoughtBubble(boat.headWorld);

  scene.add(starfield.object, moon.object, water.mesh, boat.object);
  if (meteors) scene.add(meteors.object);
  if (bubble) scene.add(bubble.object);

  const director = createDirector(root, profile.reduceMotion);
  const post = createPost(renderer, scene, camera, profile);

  let disposed = false;
  let paused = document.hidden;
  let frameId = 0;
  let smoothedProgress = 0;
  let lastTime = performance.now();

  const resize = () => {
    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    moon.setAspect(camera.aspect); // reposiciona a Lua p/ caber em retrato/paisagem
    post.setSize(width, height);
  };

  const render = (time: number) => {
    if (disposed) return;
    frameId = window.requestAnimationFrame(render);
    if (paused) return;

    const deltaSeconds = (time - lastTime) / 1000;
    lastTime = time;

    director.raf(time);
    // Persegue o progresso-alvo do scroll; suavizado (0.1) exceto em reduced-motion.
    smoothedProgress += (director.progress - smoothedProgress) * (profile.reduceMotion ? 1 : 0.1);

    // Ambiente (ondas, barco, meteoros, cintilação) anima sempre — é a essência
    // da cena. reduced-motion só suaviza o balanço OCIOSO da câmera (em director).
    starfield.update(time);
    meteors?.update(time);
    water.update(time);
    boat.update(time);
    bubble?.update(time);
    director.applyCamera(camera, smoothedProgress, time, motion);

    post.render(deltaSeconds);
  };

  const onVisibility = () => {
    paused = document.hidden;
    lastTime = performance.now();
  };

  resize();
  frameId = window.requestAnimationFrame(render);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    disposed = true;
    if (frameId) window.cancelAnimationFrame(frameId);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    director.dispose();
    post.dispose();
    starfield.dispose();
    moon.dispose();
    meteors?.dispose();
    water.dispose();
    boat.dispose();
    bubble?.dispose();
    renderer.dispose();
  };
}
