import type { SortStep } from "@/algorithms/types";
import { bubbleSortSteps } from "./bubbleSort";
import { insertionSortSteps } from "./insertionSort";
import { selectionSortSteps } from "./selectionSort";

export { bubbleSort, bubbleSortSteps } from "./bubbleSort";
export { selectionSort, selectionSortSteps } from "./selectionSort";
export { insertionSort, insertionSortSteps } from "./insertionSort";

/** Реестр генераторов шагов для сортировок — ключ = slug из algorithms.ts */
export const sortingStepGenerators: Record<string, (input: number[]) => Generator<SortStep>> = {
  "bubble-sort": bubbleSortSteps,
  "selection-sort": selectionSortSteps,
  "insertion-sort": insertionSortSteps,
};

/** Проверяет, есть ли интерактивная визуализация для алгоритма */
export function hasSortingVisualization(slug: string): boolean {
  return slug in sortingStepGenerators;
}

/** Собирает все шаги генератора в массив (удобно вне React) */
export function collectSortSteps(
  slug: string,
  input: number[],
): SortStep[] | null {
  const createSteps = sortingStepGenerators[slug];
  if (!createSteps) return null;
  return Array.from(createSteps(input));
}
