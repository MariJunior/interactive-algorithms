import {
  DEMO_DP_N,
  dpStepGenerators,
  hasDpVisualization,
} from "@/algorithms/dp";
import type { DpStep } from "@/algorithms/types";
import PlaybackControls from "@/components/ui/PlaybackControls";
import DpTableVisualizer from "@/components/visualizers/DpTableVisualizer";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useMemo, useState } from "react";
import styles from "./DpPlaybackPanel.module.css";

interface DpPlaybackPanelProps {
  slug: string;
}

const COPY: Record<
  string,
  { task: string; recurrence: string; indexLabel: string }
> = {
  fibonacci: {
    task: "Найти n-е число Фибоначчи, заполняя таблицу снизу вверх",
    recurrence: "F(i) = F(i−1) + F(i−2), база F(0)=0, F(1)=1",
    indexLabel: "i",
  },
  "climbing-stairs": {
    task: "Сколько способов подняться на n ступеней (шаг +1 или +2)",
    recurrence: "ways(i) = ways(i−1) + ways(i−2), база ways(1)=1, ways(2)=2",
    indexLabel: "ст.",
  },
};

function collectSteps(slug: string, n: number): DpStep[] {
  const create = dpStepGenerators[slug];
  if (!create) {
    return [
      {
        table: [],
        action: "done",
        n,
        message: "Визуализация пока недоступна",
      },
    ];
  }
  return Array.from(create(n));
}

/** Composition root для 1D DP на странице алгоритма */
export default function DpPlaybackPanel({ slug }: DpPlaybackPanelProps) {
  const [n, setN] = useState(DEMO_DP_N);
  const copy = COPY[slug] ?? {
    task: "Заполнить DP-таблицу",
    recurrence: "См. описание",
    indexLabel: "i",
  };

  const steps = useMemo(() => collectSteps(slug, n), [slug, n]);
  const player = useAlgorithmPlayer(steps, `${slug}:${n}`);

  if (!hasDpVisualization(slug)) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.nRow}>
        <label className={styles.nLabel} htmlFor={`dp-n-${slug}`}>
          Размер n
        </label>
        <input
          id={`dp-n-${slug}`}
          className={styles.nInput}
          type="number"
          min={1}
          max={15}
          value={n}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (!Number.isFinite(next)) return;
            setN(Math.min(15, Math.max(1, Math.trunc(next))));
          }}
        />
        <span className={styles.nHint}>1…15 (чтобы таблица читалась)</span>
      </div>

      <DpTableVisualizer
        step={player.currentStep}
        task={copy.task}
        recurrenceHint={copy.recurrence}
        indexLabel={copy.indexLabel}
      />

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
        comparisonsLabel="Чтений базы"
        movesLabel="Заполнений"
        onRandom={() => {
          setN(3 + Math.floor(Math.random() * 10));
        }}
      />
    </div>
  );
}
