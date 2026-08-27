import { describe, expect, it } from "vitest";
import { linearSearch, linearSearchSteps } from "./linearSearch";

describe("linearSearch", () => {
  it("возвращает индекс найденного элемента", () => {
    expect(linearSearch([5, 1, 4, 2, 8], 4)).toBe(2);
  });

  it("возвращает -1, если элемента нет", () => {
    expect(linearSearch([5, 1, 4], 99)).toBe(-1);
  });

  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    linearSearch(input, 1);
    expect(input).toEqual([3, 1, 2]);
  });

  it("обрабатывает пустой массив и совпадение на первом элементе", () => {
    expect(linearSearch([], 1)).toBe(-1);
    expect(linearSearch([7, 2, 3], 7)).toBe(0);
  });
});

describe("linearSearchSteps", () => {
  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    Array.from(linearSearchSteps(input, 1));
    expect(input).toEqual([3, 1, 2]);
  });

  it("завершается found/done с корректным индексом", () => {
    const steps = Array.from(linearSearchSteps([5, 1, 4, 2], 4));
    const last = steps.at(-1);

    expect(last?.action).toBe("done");
    expect(last?.foundIndex).toBe(2);
    expect(steps.some((step) => step.action === "found")).toBe(true);
  });

  it("результат шагов совпадает с linearSearch", () => {
    const input = [8, 3, 5, 1, 9, 2];
    for (const target of [5, 99, 8, 2]) {
      const steps = Array.from(linearSearchSteps(input, target));
      const last = steps.at(-1);
      const expected = linearSearch(input, target);

      expect(last?.foundIndex ?? -1).toBe(expected);
    }
  });
});
