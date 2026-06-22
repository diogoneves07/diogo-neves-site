import { describe, expect, it } from "vitest";
import {
  about,
  experiences,
  links,
  profile,
  stackGroups,
  track,
} from "../../src/data/resume";

describe("resume data integrity", () => {
  it("exposes the core profile contact details", () => {
    expect(profile.email).toBe("07dneves@gmail.com");
    expect(profile.phone).toMatch(/^\+55 /);
    expect(profile.name).toBe("Diogo Neves");
  });

  it("derives the mailto link from the profile email", () => {
    expect(links.email).toBe(`mailto:${profile.email}`);
  });

  it("points every external link at an absolute https url", () => {
    for (const url of [links.linkedin, links.github, links.devto]) {
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("describes at least one current experience", () => {
    expect(experiences.length).toBeGreaterThan(0);
    expect(experiences.some((item) => item.current)).toBe(true);
  });

  it("gives every experience a role, company and period", () => {
    for (const item of experiences) {
      expect(item.role).toBeTruthy();
      expect(item.company).toBeTruthy();
      expect(item.period).toBeTruthy();
    }
  });

  it("groups the stack with non-empty item lists", () => {
    expect(stackGroups.length).toBeGreaterThan(0);
    for (const group of stackGroups) {
      expect(group.category).toBeTruthy();
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("lists about domains and languages", () => {
    expect(about.domains.length).toBeGreaterThan(0);
    expect(about.languages.length).toBeGreaterThan(0);
    for (const lang of about.languages) {
      expect(lang.icon).toMatch(/^\/icons\/lang\/.+\.svg$/);
    }
  });

  it("describes the career track countries and flagships", () => {
    expect(track.countries.length).toBeGreaterThan(0);
    expect(track.flagships.length).toBeGreaterThan(0);
  });
});
