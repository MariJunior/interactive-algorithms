import {
  DEMO_TSP_START,
  collectTspSteps,
  createDemoTspCities,
  hasTspVisualization,
} from "@/algorithms/tsp";
import PlaybackControls from "@/components/ui/PlaybackControls";
import TspVisualizer from "@/components/visualizers/TspVisualizer";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useMemo, useState } from "react";
import styles from "./TspPlaybackPanel.module.css";

interface TspPlaybackPanelProps {
  slug: string;
}

const COPY: Record<string, { task: string; rule: string }> = {
  "tsp-brute": {
    task: "Задача о коммивояжёре: найти кратчайший цикл полным перебором",
    rule: "Фиксируем старт и перебираем все порядки остальных городов — (n−1)!",
  },
  "tsp-nearest-neighbor": {
    task: "Задача о коммивояжёре: построить тур жадной эвристикой",
    rule: "Из текущей точки всегда идём в ближайший ещё не посещённый город",
  },
};

export default function TspPlaybackPanel({ slug }: TspPlaybackPanelProps) {
  const [cities] = useState(() => createDemoTspCities());
  const [startId, setStartId] = useState(DEMO_TSP_START);
  const copy = COPY[slug] ?? {
    task: "Задача о коммивояжёре",
    rule: "См. описание",
  };

  const steps = useMemo(
    () => collectTspSteps(slug, cities, startId) ?? [],
    [slug, cities, startId],
  );
  const player = useAlgorithmPlayer(steps, `${slug}:${startId}`);

  if (!hasTspVisualization(slug)) {
    return null;
  }

  const isBrute = slug === "tsp-brute";

  return (
    <div className={styles.panel}>
      <div className={styles.startRow}>
        <label className={styles.startLabel} htmlFor={`tsp-start-${slug}`}>
          Стартовый город
        </label>
        <select
          id={`tsp-start-${slug}`}
          className={styles.startSelect}
          value={startId}
          onChange={(event) => setStartId(event.target.value)}
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.label}
            </option>
          ))}
        </select>
      </div>

      <TspVisualizer
        step={player.currentStep}
        task={copy.task}
        ruleHint={copy.rule}
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
        comparisonsLabel={isBrute ? "Просмотров туров" : "Шагов выбора"}
        movesLabel={isBrute ? "Улучшений" : "Добавлений города"}
        onRandom={() => {
          const pick =
            cities[Math.floor(Math.random() * cities.length)]?.id ?? DEMO_TSP_START;
          setStartId(pick);
        }}
      />
    </div>
  );
}
