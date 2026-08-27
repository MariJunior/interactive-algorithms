import {
  DEMO_KNAPSACK_CAPACITY,
  activitySelectionSteps,
  createDemoActivities,
  createDemoKnapsackItems,
  fractionalKnapsackSteps,
  hasGreedyVisualization,
} from "@/algorithms/greedy";
import type { GreedyStep } from "@/algorithms/types";
import PlaybackControls from "@/components/ui/PlaybackControls";
import ActivitySelectionVisualizer from "@/components/visualizers/ActivitySelectionVisualizer";
import FractionalKnapsackVisualizer from "@/components/visualizers/FractionalKnapsackVisualizer";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useMemo, useState } from "react";
import styles from "./GreedyPlaybackPanel.module.css";

interface GreedyPlaybackPanelProps {
  slug: string;
}

export default function GreedyPlaybackPanel({ slug }: GreedyPlaybackPanelProps) {
  const [activities] = useState(() => createDemoActivities());
  const [items] = useState(() => createDemoKnapsackItems());
  const [capacity] = useState(DEMO_KNAPSACK_CAPACITY);

  const steps = useMemo((): GreedyStep[] => {
    if (slug === "activity-selection") {
      return Array.from(activitySelectionSteps(activities));
    }
    if (slug === "fractional-knapsack") {
      return Array.from(fractionalKnapsackSteps(items, capacity));
    }
    return [];
  }, [slug, activities, items, capacity]);

  const player = useAlgorithmPlayer(steps, `${slug}:greedy`);

  if (!hasGreedyVisualization(slug)) {
    return null;
  }

  const step = player.currentStep;

  return (
    <div className={styles.panel}>
      {slug === "activity-selection" && step?.kind === "activity" ? (
        <ActivitySelectionVisualizer step={step} />
      ) : slug === "fractional-knapsack" && step?.kind === "knapsack" ? (
        <FractionalKnapsackVisualizer step={step} />
      ) : (
        <ActivitySelectionVisualizer step={null} />
      )}

      <PlaybackControls
        isPlaying={player.isPlaying}
        isAtStart={player.isAtStart}
        isAtEnd={player.isAtEnd}
        currentIndex={player.currentIndex}
        totalSteps={player.totalSteps}
        speed={player.speed}
        stats={player.stats}
        elapsedMs={player.elapsedMs}
        message={player.currentStep?.message}
        onToggle={player.toggle}
        onStepBack={player.stepBack}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onSpeedChange={player.setSpeed}
        comparisonsLabel="Рассмотрений"
        movesLabel="Взятий"
        onRandom={player.reset}
      />
    </div>
  );
}
