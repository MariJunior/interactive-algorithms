import type { TspStep } from "@/algorithms/types";
import { createDemoTspCities, DEMO_TSP_START } from "./demo";
import {
  tspBruteForceSteps,
  tspNearestNeighborSteps,
} from "./tsp";

export { createDemoTspCities, DEMO_TSP_START } from "./demo";
export {
  cityDistance,
  tourLength,
  tspBruteForce,
  tspBruteForceSteps,
  tspNearestNeighbor,
  tspNearestNeighborSteps,
} from "./tsp";

export const tspStepGenerators: Record<
  string,
  (cities: ReturnType<typeof createDemoTspCities>, startId: string) => Generator<TspStep>
> = {
  "tsp-brute": tspBruteForceSteps,
  "tsp-nearest-neighbor": tspNearestNeighborSteps,
};

export function hasTspVisualization(slug: string): boolean {
  return slug in tspStepGenerators;
}

export function collectTspSteps(
  slug: string,
  cities = createDemoTspCities(),
  startId = DEMO_TSP_START,
): TspStep[] | null {
  const create = tspStepGenerators[slug];
  if (!create) return null;
  return Array.from(create(cities, startId));
}
