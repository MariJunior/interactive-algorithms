import type { Graph, GraphStep, SearchStep, SortStep } from "@/algorithms/types";
import {
  DEMO_GRAPH_START,
  createDemoGraph,
  graphStepGenerators,
  hasGraphVisualization,
} from "@/algorithms/graph";
import { hasSearchingVisualization, searchingStepGenerators } from "@/algorithms/searching";
import { hasSortingVisualization, sortingStepGenerators } from "@/algorithms/sorting";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useAlgorithmRunner } from "@/hooks/useAlgorithmRunner";
import { useMemo } from "react";

type AnyStep = SortStep | SearchStep | GraphStep;

export type SandboxLaneKind = "sorting" | "searching" | "graph" | "none";

/** Пустой генератор — hooks валидны даже при неизвестном slug */
function* emptySteps(_input: number[]): Generator<AnyStep> {
  yield { array: [], action: "done", message: "Алгоритм недоступен" } as SortStep;
}

/**
 * Одна «дорожка» песочницы: domain-генератор → runner/player.
 * Для графов вход — общий Graph + startId (не number[]).
 */
export function useSandboxLane(
  slug: string,
  input: number[],
  target: number,
  graph: Graph,
  graphStartId: string,
) {
  const kind: SandboxLaneKind = hasSortingVisualization(slug)
    ? "sorting"
    : hasSearchingVisualization(slug)
      ? "searching"
      : hasGraphVisualization(slug)
        ? "graph"
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
    kind === "graph" || kind === "none" ? [] : laneInput,
  );

  const graphSteps = useMemo(() => {
    if (kind !== "graph") return [] as GraphStep[];
    const create = graphStepGenerators[slug];
    if (!create) return [] as GraphStep[];
    return Array.from(create(graph, graphStartId));
  }, [kind, slug, graph, graphStartId]);

  const steps = kind === "graph" ? graphSteps : arraySteps.steps;
  const stepsId =
    kind === "graph"
      ? `${slug}:g:${graphStartId}:${graph.edges.length}`
      : `${slug}:${laneInput.join(",")}:${kind === "searching" ? target : "-"}`;

  const player = useAlgorithmPlayer(steps, stepsId);

  return {
    kind,
    steps,
    player,
    laneInput,
  };
}

export { DEMO_GRAPH_START, createDemoGraph };
