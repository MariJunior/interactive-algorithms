import { describe, expect, it } from "vitest";
import { quickSort, quickSortSteps } from "./quickSort";

describe("quickSort", () => {
  it("сортирует массив по возрастанию", () => {
    expect(quickSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
  });

  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    quickSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it("обрабатывает пустой и одноэлементный массив", () => {
    expect(quickSort([])).toEqual([]);
    expect(quickSort([42])).toEqual([42]);
  });
});

describe("quickSortSteps", () => {
  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    Array.from(quickSortSteps(input));
    expect(input).toEqual([3, 1, 2]);
  });

  it("завершается отсортированным массивом", () => {
    const steps = Array.from(quickSortSteps([5, 1, 4, 2]));
    expect(steps.at(-1)?.action).toBe("done");
    expect(steps.at(-1)?.array).toEqual([1, 2, 4, 5]);
  });

  it("результат шагов совпадает с quickSort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const lastArray = Array.from(quickSortSteps(input)).at(-1)?.array;
    expect(lastArray).toEqual(quickSort(input));
  });

  it("отмечает pivot на шагах", () => {
    const steps = Array.from(quickSortSteps([3, 1, 2]));
    expect(steps.some((step) => step.action === "pivot")).toBe(true);
  });
});
