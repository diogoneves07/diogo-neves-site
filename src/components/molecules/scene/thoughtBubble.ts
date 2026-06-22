import { CanvasTexture, Sprite, SpriteMaterial, Vector3 } from "three";

// Balão de pensamento: Sprite com textura gerada via canvas (texto).
// Flutua e pulsa levemente; sempre de frente para a câmera (é um Sprite).

const drawBubble = (): HTMLCanvasElement | null => {
  if (typeof document === "undefined") return null;
  const W = 512;
  const H = 340;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Corpo do balão (retângulo arredondado) + cauda de bolhas.
  const bubble = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
  };
  const codeX = 88;
  const drawToken = (text: string, x: number, y: number, fill: string) => {
    ctx.strokeStyle = "rgba(8,12,18,0.96)";
    ctx.fillStyle = fill;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    return x + ctx.measureText(text).width;
  };
  const drawCodeLine = (
    y: number,
    tokens: Array<{ text: string; fill: string }>
  ) => {
    let x = codeX;
    for (const token of tokens) {
      x = drawToken(token.text, x, y, token.fill);
    }
  };

  ctx.fillStyle = "rgba(10,14,20,0.96)";
  bubble(40, 24, W - 80, 220, 40);
  ctx.strokeStyle = "rgba(126,145,168,0.5)";
  ctx.lineWidth = 4;
  bubble(40, 24, W - 80, 220, 40);
  ctx.stroke();

  // Cauda (bolhas decrescentes em direção à pessoa).
  ctx.beginPath();
  ctx.arc(150, 250, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(110, 292, 13, 0, Math.PI * 2);
  ctx.fill();

  // Texto.
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 2;
  ctx.lineWidth = 3;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "900 42px 'Courier New', monospace";
  drawToken("programando...", 104, 86, "#f8fafc");

  ctx.font = "800 32px 'Courier New', monospace";
  drawCodeLine(144, [
    { text: "while", fill: "#c084fc" },
    { text: " ", fill: "#f8fafc" },
    { text: "(", fill: "#f8fafc" },
    { text: "awake", fill: "#5eead4" },
    { text: ")", fill: "#f8fafc" },
    { text: " ", fill: "#f8fafc" },
    { text: "{", fill: "#f8fafc" },
  ]);
  drawCodeLine(184, [
    { text: "  ", fill: "#f8fafc" },
    { text: "code", fill: "#60a5fa" },
    { text: "();", fill: "#f8fafc" },
  ]);
  drawCodeLine(224, [
    { text: "}", fill: "#f8fafc" },
  ]);

  return canvas;
};

export type ThoughtBubble = {
  object: Sprite;
  update: (time: number) => void;
  dispose: () => void;
};

export function createThoughtBubble(anchor: Vector3): ThoughtBubble | null {
  const canvas = drawBubble();
  if (!canvas) return null;

  const texture = new CanvasTexture(canvas);
  const material = new SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const sprite = new Sprite(material);

  const baseScaleX = 2.4;
  const baseScaleY = 1.5;
  sprite.scale.set(baseScaleX, baseScaleY, 1);
  sprite.position.set(anchor.x + 1.1, anchor.y + 1.5, anchor.z);

  const baseY = sprite.position.y;

  return {
    object: sprite,
    update(time) {
      const t = time * 0.001;
      sprite.position.y = baseY + Math.sin(t * 1.2) * 0.1;
      const pulse = 1 + Math.sin(t * 1.6) * 0.03;
      sprite.scale.set(baseScaleX * pulse, baseScaleY * pulse, 1);
    },
    dispose() {
      texture.dispose();
      material.dispose();
    },
  };
}
