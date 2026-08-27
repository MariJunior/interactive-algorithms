import { describe, expect, it } from "vitest";
import {
  createDemoActivities,
  createDemoKnapsackItems,
  DEMO_KNAPSACK_CAPACITY,
} from "./demo";
import { activitySelection, activitySelectionSteps } from "./activitySelection";
import {
  fractionalKnapsack,
  fractionalKnapsackSteps,
} from "./fractionalKnapsack";

describe("activitySelection", () => {
  it("выбирает оптимальный набор на демо", () => {
    // Классический пример: A, D, H (или эквивалент по размеру)
    const selected = activitySelection(createDemoActivities());
    expect(selected.length).toBe(4);
    expect(selected).toEqual(["a1", "a4", "a8", "a10"]);
  });

  it("шаги заканчиваются тем же набором", () => {
    const activities = createDemoActivities();
    const last = Array.from(activitySelectionSteps(activities)).at(-1);
    expect(last?.action).toBe("done");
    expect(last?.selectedIds).toEqual(activitySelection(activities));
  });
});

describe("fractionalKnapsack", () => {
  it("считает классический пример capacity=50 → 240", () => {
    // Стандартный учебный набор часто другой; проверим наш демо capacity=15
    // densities: 60/10=6, 100/20=5, 120/30=4 → take gold 10 + 5/20 silver
    const result = fractionalKnapsack(
      createDemoKnapsackItems(),
      DEMO_KNAPSACK_CAPACITY,
    );
    expect(result.takenFraction.k1).toBe(1);
    expect(result.takenFraction.k2).toBeCloseTo(0.25);
    expect(result.totalValue).toBeCloseTo(60 + 25);
  });

  it("шаги совпадают с чистой функцией", () => {
    const items = createDemoKnapsackItems();
    const last = Array.from(
      fractionalKnapsackSteps(items, DEMO_KNAPSACK_CAPACITY),
    ).at(-1);
    const expected = fractionalKnapsack(items, DEMO_KNAPSACK_CAPACITY);
    expect(last?.totalValue).toBeCloseTo(expected.totalValue);
  });
});
