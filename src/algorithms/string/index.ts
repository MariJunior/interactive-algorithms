import type { StringStep } from "@/algorithms/types";
import { kmpSearchSteps } from "./kmp";
import { naiveSearchSteps } from "./naiveSearch";

export { DEMO_PATTERN, DEMO_TEXT } from "./demo";
export { buildLps, kmpSearch, kmpSearchSteps } from "./kmp";
export { naiveSearch, naiveSearchSteps } from "./naiveSearch";

export const stringStepGenerators: Record<
  string,
  (text: string, pattern: string) => Generator<StringStep>
> = {
  "naive-string-search": naiveSearchSteps,
  "kmp-search": kmpSearchSteps,
};

export function hasStringVisualization(slug: string): boolean {
  return slug in stringStepGenerators;
}

export function collectStringSteps(
  slug: string,
  text: string,
  pattern: string,
): StringStep[] | null {
  const create = stringStepGenerators[slug];
  if (!create) return null;
  return Array.from(create(text, pattern));
}
