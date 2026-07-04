import { describe, expect, it } from "vitest";
import { bubbleSort, bubbleSortSteps } from "./bubbleSort";

describe("bubbleSort", () => {
  it("сортирует массив по возрастанию", () => {
    expect(bubbleSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
  });

  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    bubbleSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it("обрабатывает пустой и одноэлементный массив", () => {
    expect(bubbleSort([])).toEqual([]);
    expect(bubbleSort([42])).toEqual([42]);
  });
});

describe("bubbleSortSteps", () => {
  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    Array.from(bubbleSortSteps(input));
    expect(input).toEqual([3, 1, 2]);
  });

  it("завершается отсортированным массивом", () => {
    const steps = Array.from(bubbleSortSteps([5, 1, 4, 2]));
    const lastStep = steps.at(-1);

    expect(lastStep?.action).toBe("done");
    expect(lastStep?.array).toEqual([1, 2, 4, 5]);
  });

  it("результат шагов совпадает с bubbleSort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const steps = Array.from(bubbleSortSteps(input));
    const lastArray = steps.at(-1)?.array;

    expect(lastArray).toEqual(bubbleSort(input));
  });
});
