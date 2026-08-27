import {
  DEMO_HASH_CAPACITY,
  collectHashTableSteps,
  hasHashTableVisualization,
} from "@/algorithms/hashtable";
import PlaybackControls from "@/components/ui/PlaybackControls";
import HashTableVisualizer from "@/components/visualizers/HashTableVisualizer";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useMemo } from "react";
import styles from "./HashTablePlaybackPanel.module.css";

interface HashTablePlaybackPanelProps {
  slug: string;
}

export default function HashTablePlaybackPanel({ slug }: HashTablePlaybackPanelProps) {
  const steps = useMemo(
    () => collectHashTableSteps(slug, DEMO_HASH_CAPACITY) ?? [],
    [slug],
  );
  const player = useAlgorithmPlayer(steps, `${slug}:ht:${DEMO_HASH_CAPACITY}`);

  if (!hasHashTableVisualization(slug)) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <HashTableVisualizer step={player.currentStep} />

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
        comparisonsLabel="Хешей / поисков"
        movesLabel="Записей / коллизий"
        onRandom={player.reset}
      />
    </div>
  );
}
