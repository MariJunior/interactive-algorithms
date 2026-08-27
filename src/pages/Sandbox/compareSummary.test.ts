import { describe, expect, it } from "vitest";
import { buildCompareSummary, finalStatsFromActions } from "./compareSummary";

describe("buildCompareSummary", () => {
  it("считает процент ускорения по шагам и времени", () => {
    const text = buildCompareSummary(
      { name: "Quick Sort", totalSteps: 40, comparisons: 20, moves: 10, elapsedMs: 2000 },
      { name: "Bubble Sort", totalSteps: 80, comparisons: 60, moves: 40, elapsedMs: 4000 },
    );

    expect(text).toContain("Quick Sort быстрее на 50% по шагам");
    expect(text).toContain("Quick Sort быстрее на 50% по времени");
    expect(text).toContain("Bubble Sort: 80 шагов");
    expect(text).toContain("4000 ms");
  });

  it("сообщает о ничье при равных метриках", () => {
    const text = buildCompareSummary(
      { name: "A", totalSteps: 10, comparisons: 5, moves: 1, elapsedMs: 500 },
      { name: "B", totalSteps: 10, comparisons: 4, moves: 2, elapsedMs: 500 },
    );

    expect(text).toContain("Ничья по шагам");
    expect(text).toContain("Ничья по времени");
  });
});

describe("finalStatsFromActions", () => {
  it("считает сравнения и перемещения (swap/insert/merge)", () => {
    expect(
      finalStatsFromActions([
        { action: "compare" },
        { action: "select" },
        { action: "swap" },
        { action: "insert" },
        { action: "merge" },
        { action: "done" },
      ]),
    ).toEqual({ comparisons: 2, moves: 3 });
  });
});
