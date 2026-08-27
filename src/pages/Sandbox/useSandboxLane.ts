import type {
  BinaryTree,
  DpStep,
  Graph,
  GraphStep,
  GreedyStep,
  HashTableStep,
  SearchStep,
  SortStep,
  StringStep,
  TreeStep,
  TspStep,
} from "@/algorithms/types";
import {
  DEMO_DP_N,
  dpStepGenerators,
  hasDpVisualization,
} from "@/algorithms/dp";
import {
  DEMO_GRAPH_START,
  createDemoGraph,
  graphStepGenerators,
  hasGraphVisualization,
} from "@/algorithms/graph";
import {
  DEMO_KNAPSACK_CAPACITY,
  activitySelectionSteps,
  createDemoActivities,
  createDemoKnapsackItems,
  createDemoSetCoverCandidates,
  createDemoSetCoverUniverse,
  fractionalKnapsackSteps,
  hasGreedyVisualization,
  setCoverSteps,
} from "@/algorithms/greedy";
import {
  DEMO_HASH_CAPACITY,
  collectHashTableSteps,
  hasHashTableVisualization,
} from "@/algorithms/hashtable";
import { hasSearchingVisualization, searchingStepGenerators } from "@/algorithms/searching";
import { hasSortingVisualization, sortingStepGenerators } from "@/algorithms/sorting";
import {
  DEMO_PATTERN,
  DEMO_TEXT,
  hasStringVisualization,
  stringStepGenerators,
} from "@/algorithms/string";
import {
  createDemoTree,
  hasTreeVisualization,
  treeStepGenerators,
} from "@/algorithms/tree";
import {
  DEMO_TSP_START,
  collectTspSteps,
  createDemoTspCities,
  hasTspVisualization,
} from "@/algorithms/tsp";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useAlgorithmRunner } from "@/hooks/useAlgorithmRunner";
import { useMemo } from "react";

type AnyStep =
  | SortStep
  | SearchStep
  | GraphStep
  | TreeStep
  | DpStep
  | StringStep
  | GreedyStep
  | HashTableStep
  | TspStep;

export type SandboxLaneKind =
  | "sorting"
  | "searching"
  | "graph"
  | "tree"
  | "dp"
  | "string"
  | "greedy"
  | "hashtable"
  | "tsp"
  | "none";

function* emptySteps(_input: number[]): Generator<AnyStep> {
  yield { array: [], action: "done", message: "Алгоритм недоступен" } as SortStep;
}

export function useSandboxLane(
  slug: string,
  input: number[],
  target: number,
  graph: Graph,
  graphStartId: string,
  tree: BinaryTree,
  dpN: number,
  text: string,
  pattern: string,
  tspStartId: string = DEMO_TSP_START,
) {
  const kind: SandboxLaneKind = hasSortingVisualization(slug)
    ? "sorting"
    : hasSearchingVisualization(slug)
      ? "searching"
      : hasGraphVisualization(slug)
        ? "graph"
        : hasTreeVisualization(slug)
          ? "tree"
          : hasDpVisualization(slug)
            ? "dp"
            : hasStringVisualization(slug)
              ? "string"
              : hasGreedyVisualization(slug)
                ? "greedy"
                : hasHashTableVisualization(slug)
                  ? "hashtable"
                  : hasTspVisualization(slug)
                    ? "tsp"
                    : "none";

  const laneInput = useMemo(() => {
    if (slug === "binary-search") {
      return [...input].sort((a, b) => a - b);
    }
    return input;
  }, [slug, input]);

  const arraySteps = useAlgorithmRunner(
    useMemo(() => {
      if (kind === "sorting") {
        return sortingStepGenerators[slug] ?? emptySteps;
      }
      if (kind === "searching") {
        const searchGen = searchingStepGenerators[slug];
        if (!searchGen) return emptySteps;
        return (arr: number[]) => searchGen(arr, target);
      }
      return emptySteps;
    }, [kind, slug, target]),
    kind === "sorting" || kind === "searching" ? laneInput : [],
  );

  const graphSteps = useMemo(() => {
    if (kind !== "graph") return [] as GraphStep[];
    const create = graphStepGenerators[slug];
    if (!create) return [] as GraphStep[];
    return Array.from(create(graph, graphStartId));
  }, [kind, slug, graph, graphStartId]);

  const treeSteps = useMemo(() => {
    if (kind !== "tree") return [] as TreeStep[];
    const create = treeStepGenerators[slug];
    if (!create) return [] as TreeStep[];
    return Array.from(create(tree));
  }, [kind, slug, tree]);

  const dpSteps = useMemo(() => {
    if (kind !== "dp") return [] as DpStep[];
    const create = dpStepGenerators[slug];
    if (!create) return [] as DpStep[];
    return Array.from(create(dpN));
  }, [kind, slug, dpN]);

  const stringSteps = useMemo(() => {
    if (kind !== "string") return [] as StringStep[];
    const create = stringStepGenerators[slug];
    if (!create) return [] as StringStep[];
    return Array.from(create(text, pattern));
  }, [kind, slug, text, pattern]);

  const greedySteps = useMemo((): GreedyStep[] => {
    if (kind !== "greedy") return [];
    if (slug === "activity-selection") {
      return Array.from(activitySelectionSteps(createDemoActivities()));
    }
    if (slug === "fractional-knapsack") {
      return Array.from(
        fractionalKnapsackSteps(createDemoKnapsackItems(), DEMO_KNAPSACK_CAPACITY),
      );
    }
    if (slug === "set-cover") {
      return Array.from(
        setCoverSteps(createDemoSetCoverUniverse(), createDemoSetCoverCandidates()),
      );
    }
    return [];
  }, [kind, slug]);

  const hashSteps = useMemo((): HashTableStep[] => {
    if (kind !== "hashtable") return [];
    return collectHashTableSteps(slug, DEMO_HASH_CAPACITY) ?? [];
  }, [kind, slug]);

  const tspSteps = useMemo((): TspStep[] => {
    if (kind !== "tsp") return [];
    return collectTspSteps(slug, createDemoTspCities(), tspStartId) ?? [];
  }, [kind, slug, tspStartId]);

  const steps =
    kind === "graph"
      ? graphSteps
      : kind === "tree"
        ? treeSteps
        : kind === "dp"
          ? dpSteps
          : kind === "string"
            ? stringSteps
            : kind === "greedy"
              ? greedySteps
              : kind === "hashtable"
                ? hashSteps
                : kind === "tsp"
                  ? tspSteps
                  : arraySteps.steps;

  const stepsId =
    kind === "graph"
      ? `${slug}:g:${graphStartId}:${graph.edges.length}`
      : kind === "tree"
        ? `${slug}:t:${tree.rootId}:${tree.nodes.length}`
        : kind === "dp"
          ? `${slug}:dp:${dpN}`
          : kind === "string"
            ? `${slug}:s:${text}:${pattern}`
            : kind === "greedy"
              ? `${slug}:gr`
              : kind === "hashtable"
                ? `${slug}:ht`
                : kind === "tsp"
                  ? `${slug}:tsp:${tspStartId}`
                  : `${slug}:${laneInput.join(",")}:${kind === "searching" ? target : "-"}`;

  const player = useAlgorithmPlayer(steps, stepsId);

  return { kind, steps, player, laneInput };
}

export {
  DEMO_DP_N,
  DEMO_GRAPH_START,
  DEMO_PATTERN,
  DEMO_TEXT,
  DEMO_TSP_START,
  createDemoGraph,
  createDemoTree,
  createDemoTspCities,
};
