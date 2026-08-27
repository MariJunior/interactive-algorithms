import { describe, expect, it } from "vitest";
import { heapSort, heapSortSteps } from "./heapSort";

describe("heapSort", () => {
  it("сортирует массив по возрастанию", () => {
    expect(heapSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
  });

  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    heapSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it("обрабатывает пустой и одноэлементный массив", () => {
    expect(heapSort([])).toEqual([]);
    expect(heapSort([42])).toEqual([42]);
  });
});

describe("heapSortSteps", () => {
  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    Array.from(heapSortSteps(input));
    expect(input).toEqual([3, 1, 2]);
  });

  it("завершается отсортированным массивом", () => {
    const steps = Array.from(heapSortSteps([5, 1, 4, 2]));
    expect(steps.at(-1)?.action).toBe("done");
    expect(steps.at(-1)?.array).toEqual([1, 2, 4, 5]);
  });

  it("результат шагов совпадает с heapSort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const lastArray = Array.from(heapSortSteps(input)).at(-1)?.array;
    expect(lastArray).toEqual(heapSort(input));
  });
});
