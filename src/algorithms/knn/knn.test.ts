import { describe, expect, it } from "vitest";
import {
  createDemoKnnPoints,
  DEMO_KNN_K,
  DEMO_KNN_QUERY,
} from "./demo";
import { knnClassify, knnSteps } from "./knn";

describe("knnClassify", () => {
  it("предсказывает класс на демо при k=3", () => {
    const result = knnClassify(
      createDemoKnnPoints(),
      DEMO_KNN_QUERY,
      DEMO_KNN_K,
    );
    expect(result.neighborIds).toHaveLength(3);
    expect(["A", "B"]).toContain(result.prediction);
    expect(result.votes[result.prediction]).toBeGreaterThanOrEqual(2);
  });
});

describe("knnSteps", () => {
  it("заканчивается done с тем же предсказанием", () => {
    const points = createDemoKnnPoints();
    const expected = knnClassify(points, DEMO_KNN_QUERY, DEMO_KNN_K);
    const steps = Array.from(knnSteps(points, DEMO_KNN_QUERY, DEMO_KNN_K));
    const last = steps.at(-1);
    expect(last?.action).toBe("done");
    expect(last?.prediction).toBe(expected.prediction);
    expect(steps.some((s) => s.action === "measure")).toBe(true);
    expect(steps.some((s) => s.action === "vote")).toBe(true);
  });
});
