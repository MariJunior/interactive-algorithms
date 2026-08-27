import type { SearchStep, SortStep } from "@/algorithms/types";
import { hasSearchingVisualization, searchingStepGenerators } from "@/algorithms/searching";
import { hasSortingVisualization, sortingStepGenerators } from "@/algorithms/sorting";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useAlgorithmRunner } from "@/hooks/useAlgorithmRunner";
import { useMemo } from "react";

type AnyStep = SortStep | SearchStep;

/** Пустой генератор — hooks валидны даже при неизвестном slug */
function* emptySteps(_input: number[]): Generator<AnyStep> {
  yield { array: [], action: "done", message: "Алгоритм недоступен" } as SortStep;
}

/**
 * Одна «дорожка» песочницы: domain-генератор → runner → player.
 * Binary Search получает отсортированную копию того же мультимножества.
 */
export function useSandboxLane(slug: string, input: number[], target: number) {
  const kind: "sorting" | "searching" | "none" = hasSortingVisualization(slug)
    ? "sorting"
    : hasSearchingVisualization(slug)
      ? "searching"
      : "none";

  // Binary требует sorted; остальные сортировки/linear — исходный shared input
  const laneInput = useMemo(() => {
    if (slug === "binary-search") {
      return [...input].sort((a, b) => a - b);
    }
    return input;
  }, [slug, input]);

  const createGenerator = useMemo(() => {
    if (kind === "sorting") {
      return sortingStepGenerators[slug] ?? emptySteps;
    }
    if (kind === "searching") {
      const searchGen = searchingStepGenerators[slug];
      if (!searchGen) return emptySteps;
      return (arr: number[]) => searchGen(arr, target);
    }
    return emptySteps;
  }, [kind, slug, target]);

  const { steps } = useAlgorithmRunner(createGenerator, laneInput);
  const stepsId = `${slug}:${laneInput.join(",")}:${kind === "searching" ? target : "-"}`;
  const player = useAlgorithmPlayer(steps, stepsId);

  return {
    kind,
    steps,
    player,
    laneInput,
  };
}
