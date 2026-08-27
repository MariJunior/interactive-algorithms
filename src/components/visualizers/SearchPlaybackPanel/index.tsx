import type { SearchStep } from "@/algorithms/types";
import {
  hasSearchingVisualization,
  searchingStepGenerators,
} from "@/algorithms/searching";
import PlaybackControls from "@/components/ui/PlaybackControls";
import SearchVisualizer from "@/components/visualizers/SearchVisualizer";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useAlgorithmRunner } from "@/hooks/useAlgorithmRunner";
import { createRandomArray } from "@/utils/createRandomArray";
import { useCallback, useMemo, useState } from "react";
import styles from "./SearchPlaybackPanel.module.css";

interface SearchPlaybackPanelProps {
  slug: string;
}

interface SearchScenario {
  array: number[];
  target: number;
}

/** Сценарий: массив (+ сортировка для binary) и цель (часто hit, иногда miss) */
function createSearchScenario(sorted: boolean): SearchScenario {
  const raw = createRandomArray(12, 1, 40);
  const array = sorted ? [...raw].sort((a, b) => a - b) : raw;

  // ~80% попадание в существующий элемент — нагляднее для обучения
  if (array.length > 0 && Math.random() < 0.8) {
    const target = array[Math.floor(Math.random() * array.length)];
    return { array, target };
  }

  const max = array.length > 0 ? Math.max(...array) : 0;
  return { array, target: max + 1 + Math.floor(Math.random() * 9) };
}

/** Пустой генератор — hooks всегда вызываются при отсутствии реализации */
function* emptySearchSteps(_input: number[]): Generator<SearchStep> {
  yield {
    array: [],
    target: 0,
    action: "done",
    message: "Визуализация пока недоступна",
  };
}

/**
 * Composition root для поиска на странице алгоритма:
 * domain (генератор) → application (runner/player) → presentation (viz + controls).
 */
export default function SearchPlaybackPanel({ slug }: SearchPlaybackPanelProps) {
  const needsSorted = slug === "binary-search";
  const [scenario, setScenario] = useState(() => createSearchScenario(needsSorted));

  // Оборачиваем (arr, target) → (arr) для совместимости с useAlgorithmRunner
  const createGenerator = useMemo(() => {
    const domainGenerator = searchingStepGenerators[slug];
    if (!domainGenerator) return emptySearchSteps;
    return (input: number[]) => domainGenerator(input, scenario.target);
  }, [slug, scenario.target]);

  const { steps } = useAlgorithmRunner(createGenerator, scenario.array);

  const stepsId = `${slug}:${scenario.array.join(",")}:${scenario.target}`;
  const player = useAlgorithmPlayer(steps, stepsId);

  const handleRandom = useCallback(() => {
    setScenario(createSearchScenario(needsSorted));
  }, [needsSorted]);

  if (!hasSearchingVisualization(slug)) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <SearchVisualizer step={player.currentStep} />
      <PlaybackControls
        isPlaying={player.isPlaying}
        isAtStart={player.isAtStart}
        isAtEnd={player.isAtEnd}
        currentIndex={player.currentIndex}
        totalSteps={player.totalSteps}
        speed={player.speed}
        stats={player.stats}
        message={player.currentStep?.message}
        onToggle={player.toggle}
        onStepBack={player.stepBack}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onSpeedChange={player.setSpeed}
        onRandom={handleRandom}
      />
    </div>
  );
}
