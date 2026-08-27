import { describe, expect, it } from "vitest";
import { buildCompareSummary, finalStatsFromActions } from "./compareSummary";

describe("buildCompareSummary", () => {
  it("считает процент ускорения по шагам", () => {
    const text = buildCompareSummary(
      { name: "Quick Sort", totalSteps: 40, comparisons: 20, swaps: 10 },
      { name: "Bubble Sort", totalSteps: 80, comparisons: 60, swaps: 40 },
    );

    expect(text).toContain("Quick Sort быстрее на 50%");
    expect(text).toContain("Bubble Sort: 80 шагов");
  });

  it("сообщает о ничье при равном числе шагов", () => {
    const text = buildCompareSummary(
      { name: "A", totalSteps: 10, comparisons: 5, swaps: 1 },
      { name: "B", totalSteps: 10, comparisons: 4, swaps: 2 },
    );

    expect(text).toContain("Ничья по числу шагов");
  });
});

describe("finalStatsFromActions", () => {
  it("считает compare/select и swap", () => {
    expect(
      finalStatsFromActions([
        { action: "compare" },
        { action: "select" },
        { action: "swap" },
        { action: "done" },
      ]),
    ).toEqual({ comparisons: 2, swaps: 1 });
  });
});
