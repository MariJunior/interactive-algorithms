import type { SortStep } from "@/algorithms/types";
import { hasSortingVisualization, sortingStepGenerators } from "@/algorithms/sorting";
import PlaybackControls from "@/components/ui/PlaybackControls";
import SortVisualizer from "@/components/visualizers/SortVisualizer";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useAlgorithmRunner } from "@/hooks/useAlgorithmRunner";
import { createRandomArray } from "@/utils/createRandomArray";
import { useCallback, useState } from "react";
import styles from "./SortPlaybackPanel.module.css";

interface SortPlaybackPanelProps {
  slug: string;
}

/** Пустой генератор — чтобы хуки всегда вызывались при отсутствии реализации */
function* emptySortSteps(_input: number[]): Generator<SortStep> {
  yield { array: [], action: "done", message: "Визуализация пока недоступна" };
}

/**
 * Composition root для сортировок на странице алгоритма:
 * domain (генератор) → application (runner/player) → presentation (viz + controls).
 */
export default function SortPlaybackPanel({ slug }: SortPlaybackPanelProps) {
  const [input, setInput] = useState(() => createRandomArray(12));

  // Стабильная ссылка на генератор (или заглушка) — hooks до любого early return
  const createGenerator = sortingStepGenerators[slug] ?? emptySortSteps;
  const { steps } = useAlgorithmRunner(createGenerator, input);

  const stepsId = `${slug}:${input.join(",")}`;
  const player = useAlgorithmPlayer(steps, stepsId);

  const handleRandom = useCallback(() => {
    setInput(createRandomArray(12));
  }, []);

  if (!hasSortingVisualization(slug)) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <SortVisualizer step={player.currentStep} />
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
