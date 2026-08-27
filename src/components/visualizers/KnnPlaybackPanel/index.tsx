import {
  DEMO_KNN_K,
  DEMO_KNN_QUERY,
  collectKnnSteps,
  createDemoKnnPoints,
  hasKnnVisualization,
} from "@/algorithms/knn";
import PlaybackControls from "@/components/ui/PlaybackControls";
import KnnVisualizer from "@/components/visualizers/KnnVisualizer";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useMemo, useState } from "react";
import styles from "./KnnPlaybackPanel.module.css";

interface KnnPlaybackPanelProps {
  slug: string;
}

export default function KnnPlaybackPanel({ slug }: KnnPlaybackPanelProps) {
  const [points] = useState(() => createDemoKnnPoints());
  const [query] = useState(() => ({ ...DEMO_KNN_QUERY }));
  const [k, setK] = useState(DEMO_KNN_K);

  const steps = useMemo(
    () => collectKnnSteps(slug, points, query, k) ?? [],
    [slug, points, query, k],
  );
  const player = useAlgorithmPlayer(steps, `${slug}:k${k}:${query.x},${query.y}`);

  if (!hasKnnVisualization(slug)) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.controls}>
        <label className={styles.field}>
          <span>k</span>
          <select
            className={styles.select}
            value={k}
            onChange={(event) => setK(Number(event.target.value))}
            aria-label="Число соседей k"
          >
            {[1, 3, 5, 7].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <p className={styles.hint}>
          Query зафиксирован в демо ({query.x}, {query.y}). Меняй k — смотри, как меняется
          голосование.
        </p>
      </div>

      <KnnVisualizer step={player.currentStep} />

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
        comparisonsLabel="Измерений"
        movesLabel="Рангов / голосов"
        onRandom={() => setK(k === 3 ? 5 : 3)}
      />
    </div>
  );
}
