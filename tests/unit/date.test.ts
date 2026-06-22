import { describe, expect, it } from "vitest";
import { formatArticleDate, toIsoDate } from "../../src/lib/date";

describe("formatArticleDate", () => {
  it("formats an ISO date into a pt-BR long date", () => {
    expect(formatArticleDate("2022-12-27")).toBe("27 de dezembro de 2022");
  });

  it("accepts slash-separated dates", () => {
    expect(formatArticleDate("2026/06/21")).toBe("21 de junho de 2026");
  });

  it("trims surrounding whitespace before parsing", () => {
    expect(formatArticleDate("  2022-12-27  ")).toBe("27 de dezembro de 2022");
  });

  it("returns the original value untouched when it does not match", () => {
    expect(formatArticleDate("ontem")).toBe("ontem");
    expect(formatArticleDate("2022-13")).toBe("2022-13");
  });
});

describe("toIsoDate", () => {
  it("normalises slash dates to ISO", () => {
    expect(toIsoDate("2026/06/21")).toBe("2026-06-21");
  });

  it("keeps already-ISO dates", () => {
    expect(toIsoDate("2022-12-27")).toBe("2022-12-27");
  });

  it("returns the original value when it does not match", () => {
    expect(toIsoDate("sem data")).toBe("sem data");
  });
});
