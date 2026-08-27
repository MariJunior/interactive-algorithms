import { describe, expect, it } from "vitest";
import { countingSort, countingSortSteps } from "./countingSort";

describe("countingSort", () => {
  it("сортирует массив по возрастанию", () => {
    expect(countingSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
  });

  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    countingSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it("обрабатывает пустой и одноэлементный массив", () => {
    expect(countingSort([])).toEqual([]);
    expect(countingSort([42])).toEqual([42]);
  });

  it("работает с отрицательными числами", () => {
    expect(countingSort([-2, 3, -1, 0])).toEqual([-2, -1, 0, 3]);
  });

  it("стабилен при равных значениях", () => {
    expect(countingSort([2, 1, 2])).toEqual([1, 2, 2]);
  });
});

describe("countingSortSteps", () => {
  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    Array.from(countingSortSteps(input));
    expect(input).toEqual([3, 1, 2]);
  });

  it("завершается отсортированным массивом", () => {
    const steps = Array.from(countingSortSteps([5, 1, 4, 2]));
    expect(steps.at(-1)?.action).toBe("done");
    expect(steps.at(-1)?.array).toEqual([1, 2, 4, 5]);
  });

  it("результат шагов совпадает с countingSort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const lastArray = Array.from(countingSortSteps(input)).at(-1)?.array;
    expect(lastArray).toEqual(countingSort(input));
  });
});
