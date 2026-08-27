import type {
  ActivityGreedyStep,
  ActivityItem,
  GreedyStep,
  KnapsackGreedyStep,
  KnapsackItem,
} from "@/algorithms/types";
import { activitySelectionSteps } from "./activitySelection";
import { fractionalKnapsackSteps } from "./fractionalKnapsack";

export {
  createDemoActivities,
  createDemoKnapsackItems,
  DEMO_KNAPSACK_CAPACITY,
} from "./demo";
export { activitySelection, activitySelectionSteps } from "./activitySelection";
export {
  fractionalKnapsack,
  fractionalKnapsackSteps,
} from "./fractionalKnapsack";

export type GreedyGeneratorInput =
  | { slug: "activity-selection"; activities: ActivityItem[] }
  | {
      slug: "fractional-knapsack";
      items: KnapsackItem[];
      capacity: number;
    };

export const greedyStepGenerators = {
  "activity-selection": activitySelectionSteps,
  "fractional-knapsack": fractionalKnapsackSteps,
} as const;

export function hasGreedyVisualization(slug: string): boolean {
  return slug === "activity-selection" || slug === "fractional-knapsack";
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

export function isGreedyStep(step: unknown): step is GreedyStep {
  return (
    typeof step === "object" &&
    step !== null &&
    "kind" in step &&
    ((step as GreedyStep).kind === "activity" ||
      (step as GreedyStep).kind === "knapsack")
  );
}
