import {
  DEMO_PATTERN,
  DEMO_TEXT,
  hasStringVisualization,
  stringStepGenerators,
} from "@/algorithms/string";
import type { StringStep } from "@/algorithms/types";
import PlaybackControls from "@/components/ui/PlaybackControls";
import StringMatchVisualizer from "@/components/visualizers/StringMatchVisualizer";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useMemo, useState } from "react";
import styles from "./StringMatchPlaybackPanel.module.css";

interface StringMatchPlaybackPanelProps {
  slug: string;
}

const COPY: Record<string, { task: string; strategy: string }> = {
  "naive-string-search": {
    task: "Найти все вхождения паттерна в тексте",
    strategy: "Наивно: после любого исхода сдвигаем окно на 1",
  },
  "kmp-search": {
    task: "Найти все вхождения паттерна в тексте",
    strategy: "KMP: при несовпадении сдвигаем по LPS, не теряя уже совпавший префикс",
  },
};

function collectSteps(slug: string, text: string, pattern: string): StringStep[] {
  const create = stringStepGenerators[slug];
  if (!create) {
    return [
      {
        text,
        pattern,
        action: "done",
        windowStart: 0,
        foundStarts: [],
        message: "Визуализация пока недоступна",
      },
    ];
  }
  return Array.from(create(text, pattern));
}

export default function StringMatchPlaybackPanel({ slug }: StringMatchPlaybackPanelProps) {
  const [text, setText] = useState(DEMO_TEXT);
  const [pattern, setPattern] = useState(DEMO_PATTERN);
  const copy = COPY[slug] ?? {
    task: "Найти паттерн в тексте",
    strategy: "См. описание",
  };

  const steps = useMemo(() => collectSteps(slug, text, pattern), [slug, text, pattern]);
  const player = useAlgorithmPlayer(steps, `${slug}:${text}:${pattern}`);

  if (!hasStringVisualization(slug)) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.inputs}>
        <label className={styles.field}>
          <span>Текст</span>
          <input
            className={styles.input}
            value={text}
            onChange={(event) => setText(event.target.value.toUpperCase())}
            aria-label="Текст для поиска"
          />
        </label>
        <label className={styles.field}>
          <span>Паттерн</span>
          <input
            className={styles.input}
            value={pattern}
            onChange={(event) => setPattern(event.target.value.toUpperCase())}
            aria-label="Искомый паттерн"
          />
        </label>
      </div>

      <StringMatchVisualizer
        step={player.currentStep}
        task={copy.task}
        strategyHint={copy.strategy}
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
        comparisonsLabel="Сравнений символов"
        movesLabel="Сдвигов / находок"
        onRandom={() => {
          setText(DEMO_TEXT);
          setPattern(DEMO_PATTERN);
        }}
      />
    </div>
  );
}
