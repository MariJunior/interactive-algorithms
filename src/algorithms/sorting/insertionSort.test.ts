import { describe, expect, it } from "vitest";
import { insertionSort, insertionSortSteps } from "./insertionSort";

describe("insertionSort", () => {
  it("сортирует массив по возрастанию", () => {
    expect(insertionSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
  });

  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    insertionSort(input);
    expect(input).toEqual([3, 1, 2]);
  });
});

describe("insertionSortSteps", () => {
  it("завершается отсортированным массивом", () => {
    const steps = Array.from(insertionSortSteps([5, 1, 4, 2]));
    const lastStep = steps.at(-1);

    expect(lastStep?.action).toBe("done");
    expect(lastStep?.array).toEqual([1, 2, 4, 5]);
  });

  it("результат шагов совпадает с insertionSort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const steps = Array.from(insertionSortSteps(input));

    expect(steps.at(-1)?.array).toEqual(insertionSort(input));
  });
});
