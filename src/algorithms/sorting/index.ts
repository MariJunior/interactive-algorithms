import type { SortStep } from "@/algorithms/types";
import { bubbleSortSteps } from "./bubbleSort";
import { countingSortSteps } from "./countingSort";
import { heapSortSteps } from "./heapSort";
import { insertionSortSteps } from "./insertionSort";
import { mergeSortSteps } from "./mergeSort";
import { quickSortSteps } from "./quickSort";
import { radixSortSteps } from "./radixSort";
import { selectionSortSteps } from "./selectionSort";

export { bubbleSort, bubbleSortSteps } from "./bubbleSort";
export { selectionSort, selectionSortSteps } from "./selectionSort";
export { insertionSort, insertionSortSteps } from "./insertionSort";
export { mergeSort, mergeSortSteps } from "./mergeSort";
export { quickSort, quickSortSteps } from "./quickSort";
export { heapSort, heapSortSteps } from "./heapSort";
export { countingSort, countingSortSteps } from "./countingSort";
export { radixSort, radixSortSteps } from "./radixSort";

/** Реестр генераторов шагов для сортировок — ключ = slug из algorithms.ts */
export const sortingStepGenerators: Record<string, (input: number[]) => Generator<SortStep>> = {
  "bubble-sort": bubbleSortSteps,
  "selection-sort": selectionSortSteps,
  "insertion-sort": insertionSortSteps,
  "merge-sort": mergeSortSteps,
  "quick-sort": quickSortSteps,
  "heap-sort": heapSortSteps,
  "counting-sort": countingSortSteps,
  "radix-sort": radixSortSteps,
};

/** Проверяет, есть ли интерактивная визуализация для алгоритма */
export function hasSortingVisualization(slug: string): boolean {
  return slug in sortingStepGenerators;
}

/** Собирает все шаги генератора в массив (удобно вне React) */
export function collectSortSteps(slug: string, input: number[]): SortStep[] | null {
  const createSteps = sortingStepGenerators[slug];
  if (!createSteps) return null;
  return Array.from(createSteps(input));
}
