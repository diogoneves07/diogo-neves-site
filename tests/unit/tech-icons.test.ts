import { describe, expect, it } from "vitest";
import { techIcon } from "../../src/data/tech-icons";

describe("techIcon", () => {
  it("maps a known brand to its svg logo", () => {
    expect(techIcon("React")).toEqual({ kind: "svg", src: "/icons/tech/react.svg" });
  });

  it("treats aliases as the same logo", () => {
    expect(techIcon("React.js")).toEqual(techIcon("React Native"));
  });

  it("maps a logo-less tech to a representative emoji", () => {
    const icon = techIcon("IA");
    expect(icon).toEqual({ kind: "emoji", char: "🤖" });
  });

  it("falls back to a bullet emoji for unknown labels", () => {
    expect(techIcon("Tecnologia Inexistente")).toEqual({ kind: "emoji", char: "•" });
  });
});
