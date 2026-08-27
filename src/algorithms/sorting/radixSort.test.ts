import { describe, expect, it } from "vitest";
import { radixSort, radixSortSteps } from "./radixSort";

describe("radixSort", () => {
  it("сортирует массив по возрастанию", () => {
    expect(radixSort([170, 45, 75, 90, 802, 24, 2, 66])).toEqual([
      2, 24, 45, 66, 75, 90, 170, 802,
    ]);
  });

  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    radixSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it("обрабатывает пустой и одноэлементный массив", () => {
    expect(radixSort([])).toEqual([]);
    expect(radixSort([42])).toEqual([42]);
  });

  it("бросает на отрицательных числах", () => {
    expect(() => radixSort([-1, 2])).toThrow();
  });
});

describe("radixSortSteps", () => {
  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    Array.from(radixSortSteps(input));
    expect(input).toEqual([3, 1, 2]);
  });

  it("завершается отсортированным массивом", () => {
    const steps = Array.from(radixSortSteps([170, 45, 75, 90]));
    expect(steps.at(-1)?.action).toBe("done");
    expect(steps.at(-1)?.array).toEqual([45, 75, 90, 170]);
  });

  it("результат шагов совпадает с radixSort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const lastArray = Array.from(radixSortSteps(input)).at(-1)?.array;
    expect(lastArray).toEqual(radixSort(input));
  });
});
