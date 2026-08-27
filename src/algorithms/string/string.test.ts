import { describe, expect, it } from "vitest";
import { DEMO_PATTERN, DEMO_TEXT } from "./demo";
import { buildLps, kmpSearch, kmpSearchSteps } from "./kmp";
import { naiveSearch, naiveSearchSteps } from "./naiveSearch";

describe("naiveSearch", () => {
  it("находит все вхождения", () => {
    expect(naiveSearch("AABAACAADAABAABA", "AABA")).toEqual([0, 9, 12]);
  });

  it("совпадает с шагами", () => {
    const text = DEMO_TEXT;
    const pattern = DEMO_PATTERN;
    const last = Array.from(naiveSearchSteps(text, pattern)).at(-1);
    expect(last?.foundStarts).toEqual(naiveSearch(text, pattern));
  });
});

describe("kmp", () => {
  it("строит LPS", () => {
    expect(buildLps("ABABCABAB")).toEqual([0, 0, 1, 2, 0, 1, 2, 3, 4]);
  });

  it("даёт те же вхождения, что naive", () => {
    const cases: Array<[string, string]> = [
      [DEMO_TEXT, DEMO_PATTERN],
      ["AAAA", "AA"],
      ["ABC", "X"],
      ["", "A"],
    ];
    for (const [text, pattern] of cases) {
      expect(kmpSearch(text, pattern)).toEqual(naiveSearch(text, pattern));
      const last = Array.from(kmpSearchSteps(text, pattern)).at(-1);
      expect(last?.foundStarts).toEqual(naiveSearch(text, pattern));
    }
  });
});
