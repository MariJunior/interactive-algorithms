import type { KnnStep } from "@/algorithms/types";
import {
  createDemoKnnPoints,
  DEMO_KNN_K,
  DEMO_KNN_QUERY,
} from "./demo";
import { knnSteps } from "./knn";

export {
  createDemoKnnPoints,
  DEMO_KNN_K,
  DEMO_KNN_QUERY,
} from "./demo";
export { euclidean, knnClassify, knnSteps } from "./knn";

export const knnStepGenerators: Record<
  string,
  (
    points: ReturnType<typeof createDemoKnnPoints>,
    query: { x: number; y: number },
    k: number,
  ) => Generator<KnnStep>
> = {
  knn: knnSteps,
};

export function hasKnnVisualization(slug: string): boolean {
  return slug in knnStepGenerators;
}

export function collectKnnSteps(
  slug: string,
  points = createDemoKnnPoints(),
  query = DEMO_KNN_QUERY,
  k = DEMO_KNN_K,
): KnnStep[] | null {
  const create = knnStepGenerators[slug];
  if (!create) return null;
  return Array.from(create(points, query, k));
}
