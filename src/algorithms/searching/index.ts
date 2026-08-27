import type { SearchStep } from "@/algorithms/types";
import { binarySearchSteps } from "./binarySearch";
import { linearSearchSteps } from "./linearSearch";

export { binarySearch, binarySearchSteps } from "./binarySearch";
export { linearSearch, linearSearchSteps } from "./linearSearch";

/** Реестр генераторов шагов поиска — ключ = slug из algorithms.ts */
export const searchingStepGenerators: Record<
  string,
  (input: number[], target: number) => Generator<SearchStep>
> = {
  "linear-search": linearSearchSteps,
  "binary-search": binarySearchSteps,
};

/** Проверяет, есть ли интерактивная визуализация поиска для slug */
export function hasSearchingVisualization(slug: string): boolean {
  return slug in searchingStepGenerators;
}

/** Собирает все шаги генератора в массив (удобно вне React) */
export function collectSearchSteps(
  slug: string,
  input: number[],
  target: number,
): SearchStep[] | null {
  const createSteps = searchingStepGenerators[slug];
  if (!createSteps) return null;
  return Array.from(createSteps(input, target));
}
