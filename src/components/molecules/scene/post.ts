import type { Camera, Scene, WebGLRenderer } from "three";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  VignetteEffect,
} from "postprocessing";
import type { QualityProfile } from "./quality";

export type PostPipeline = {
  render: (delta: number) => void;
  setSize: (width: number, height: number) => void;
  dispose: () => void;
};

export function createPost(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  profile: QualityProfile
): PostPipeline {
  // Tier baixo: render direto, sem composer (economia de fill-rate).
  if (!profile.postprocessing) {
    return {
      render: () => renderer.render(scene, camera),
      setSize: (w, h) => renderer.setSize(w, h, false),
      dispose: () => undefined,
    };
  }

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new BloomEffect({
    intensity: 0.95,
    luminanceThreshold: 0.5,
    luminanceSmoothing: 0.3,
    mipmapBlur: true,
    radius: 0.7,
  });
  const vignette = new VignetteEffect({ offset: 0.3, darkness: 0.7 });

  composer.addPass(new EffectPass(camera, bloom, vignette));

  return {
    render: (delta) => composer.render(delta),
    setSize: (w, h) => composer.setSize(w, h),
    dispose: () => composer.dispose(),
  };
}
