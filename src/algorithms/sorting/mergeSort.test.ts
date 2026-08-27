import { describe, expect, it } from "vitest";
import { mergeSort, mergeSortSteps } from "./mergeSort";

describe("mergeSort", () => {
  it("сортирует массив по возрастанию", () => {
    expect(mergeSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
  });

  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    mergeSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it("обрабатывает пустой и одноэлементный массив", () => {
    expect(mergeSort([])).toEqual([]);
    expect(mergeSort([42])).toEqual([42]);
  });

  it("стабилен на равных значениях (относительный порядок сохраняется через <=)", () => {
    // Индексы как «метки» одинаковых ключей — после сортировки порядок меток для 2 не меняется
    const input = [2, 1, 2];
    expect(mergeSort(input)).toEqual([1, 2, 2]);
  });
});

describe("mergeSortSteps", () => {
  it("не мутирует исходный массив", () => {
    const input = [3, 1, 2];
    Array.from(mergeSortSteps(input));
    expect(input).toEqual([3, 1, 2]);
  });

  it("завершается отсортированным массивом", () => {
    const steps = Array.from(mergeSortSteps([5, 1, 4, 2]));
    const lastStep = steps.at(-1);

    expect(lastStep?.action).toBe("done");
    expect(lastStep?.array).toEqual([1, 2, 4, 5]);
  });

  it("результат шагов совпадает с mergeSort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const steps = Array.from(mergeSortSteps(input));
    const lastArray = steps.at(-1)?.array;

    expect(lastArray).toEqual(mergeSort(input));
  });

  it("содержит шаги merge при n > 1", () => {
    const steps = Array.from(mergeSortSteps([3, 1]));
    expect(steps.some((step) => step.action === "merge")).toBe(true);
  });
});
