import type {
  ActivityGreedyStep,
  ActivityItem,
  GreedyStep,
  KnapsackGreedyStep,
  KnapsackItem,
  SetCoverCandidate,
  SetCoverElement,
  SetCoverGreedyStep,
} from "@/algorithms/types";
import { activitySelectionSteps } from "./activitySelection";
import { fractionalKnapsackSteps } from "./fractionalKnapsack";
import { setCoverSteps } from "./setCover";

export {
  createDemoActivities,
  createDemoKnapsackItems,
  createDemoSetCoverCandidates,
  createDemoSetCoverUniverse,
  DEMO_KNAPSACK_CAPACITY,
} from "./demo";
export { activitySelection, activitySelectionSteps } from "./activitySelection";
export {
  fractionalKnapsack,
  fractionalKnapsackSteps,
} from "./fractionalKnapsack";
export { setCover, setCoverSteps } from "./setCover";

export function hasGreedyVisualization(slug: string): boolean {
  return (
    slug === "activity-selection" ||
    slug === "fractional-knapsack" ||
    slug === "set-cover"
  );
}

export function collectActivitySteps(
  activities: ActivityItem[],
): ActivityGreedyStep[] {
  return Array.from(activitySelectionSteps(activities));
}

export function collectKnapsackSteps(
  items: KnapsackItem[],
  capacity: number,
): KnapsackGreedyStep[] {
  return Array.from(fractionalKnapsackSteps(items, capacity));
}

export function collectSetCoverSteps(
  universe: SetCoverElement[],
  candidates: SetCoverCandidate[],
): SetCoverGreedyStep[] {
  return Array.from(setCoverSteps(universe, candidates));
}

export function isGreedyStep(step: unknown): step is GreedyStep {
  return (
    typeof step === "object" &&
    step !== null &&
    "kind" in step &&
    ((step as GreedyStep).kind === "activity" ||
      (step as GreedyStep).kind === "knapsack" ||
      (step as GreedyStep).kind === "set-cover")
  );
}
