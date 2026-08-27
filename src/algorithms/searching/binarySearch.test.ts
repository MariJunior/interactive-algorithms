import { describe, expect, it } from "vitest";
import { binarySearch, binarySearchSteps } from "./binarySearch";

describe("binarySearch", () => {
  it("возвращает индекс найденного элемента", () => {
    expect(binarySearch([1, 2, 4, 5, 8], 4)).toBe(2);
  });

  it("возвращает -1, если элемента нет", () => {
    expect(binarySearch([1, 2, 4, 5, 8], 3)).toBe(-1);
  });

  it("не мутирует исходный массив", () => {
    const input = [1, 2, 3];
    binarySearch(input, 2);
    expect(input).toEqual([1, 2, 3]);
  });

  it("обрабатывает пустой массив и края", () => {
    expect(binarySearch([], 1)).toBe(-1);
    expect(binarySearch([1, 2, 3], 1)).toBe(0);
    expect(binarySearch([1, 2, 3], 3)).toBe(2);
  });
});

describe("binarySearchSteps", () => {
  it("не мутирует исходный массив", () => {
    const input = [1, 3, 5];
    Array.from(binarySearchSteps(input, 3));
    expect(input).toEqual([1, 3, 5]);
  });

  it("завершается found/done с корректным индексом", () => {
    const steps = Array.from(binarySearchSteps([1, 2, 4, 5, 8], 5));
    const last = steps.at(-1);

    expect(last?.action).toBe("done");
    expect(last?.foundIndex).toBe(3);
    expect(steps.some((step) => step.action === "found")).toBe(true);
  });

  it("результат шагов совпадает с binarySearch", () => {
    const input = [1, 2, 3, 5, 8, 13, 21];
    for (const target of [1, 8, 21, 4, 99]) {
      const steps = Array.from(binarySearchSteps(input, target));
      const last = steps.at(-1);
      const expected = binarySearch(input, target);

      expect(last?.foundIndex ?? -1).toBe(expected);
    }
  });
});
