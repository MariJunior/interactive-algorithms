import type { DpStep } from "@/algorithms/types";
import { climbingStairsSteps } from "./climbingStairs";
import { fibonacciSteps } from "./fibonacci";

export { climbingStairs, climbingStairsSteps } from "./climbingStairs";
export { fibonacci, fibonacciSteps } from "./fibonacci";

/** Реестр DP-генераторов — ключ = slug */
export const dpStepGenerators: Record<
  string,
  (n: number) => Generator<DpStep>
> = {
  fibonacci: fibonacciSteps,
  "climbing-stairs": climbingStairsSteps,
};

export function hasDpVisualization(slug: string): boolean {
  return slug in dpStepGenerators;
}

export function collectDpSteps(slug: string, n: number): DpStep[] | null {
  const create = dpStepGenerators[slug];
  if (!create) return null;
  return Array.from(create(n));
}

/** Дефолтный размер задачи для демо / sandbox */
export const DEMO_DP_N = 8;
