import Slider from "@/components/ui/Slider";
import { formatElapsedMs, type PlayerStats } from "@/hooks/useAlgorithmPlayer";
import styles from "./PlaybackControls.module.css";

export interface PlaybackControlsProps {
  isPlaying: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  currentIndex: number;
  totalSteps: number;
  /** Интервал автоплея в миллисекундах */
  speed: number;
  stats: PlayerStats;
  /** Real-time время воспроизведения (wall-clock), ms */
  elapsedMs?: number;
  message?: string;
  onToggle: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSpeedChange: (ms: number) => void;
  onRandom: () => void;
}

/**
 * Презентационные controls плеера — не знает про конкретный алгоритм,
 * только про состояние воспроизведения и колбэки.
 */
export default function PlaybackControls({
  isPlaying,
  isAtStart,
  isAtEnd,
  currentIndex,
  totalSteps,
  speed,
  stats,
  elapsedMs = 0,
  message,
  onToggle,
  onStepBack,
  onStepForward,
  onReset,
  onSpeedChange,
  onRandom,
}: PlaybackControlsProps) {
  const stepLabel = totalSteps === 0 ? "0 / 0" : `${currentIndex + 1} / ${totalSteps}`;

  return (
    <div className={styles.panel}>
      <p className={styles.message}>{message ?? " "}</p>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.btn}
          onClick={onStepBack}
          disabled={isAtStart}
          aria-label="Шаг назад"
          title="Шаг назад"
        >
          ‹
        </button>

        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={onToggle}
          disabled={totalSteps === 0 || (isAtEnd && !isPlaying)}
          aria-label={isPlaying ? "Пауза" : "Воспроизведение"}
          title={isPlaying ? "Пауза" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          type="button"
          className={styles.btn}
          onClick={onStepForward}
          disabled={isAtEnd}
          aria-label="Шаг вперёд"
          title="Шаг вперёд"
        >
          ›
        </button>

        <button
          type="button"
          className={styles.btn}
          onClick={onReset}
          disabled={isAtStart && !isPlaying && elapsedMs === 0}
          aria-label="Сброс"
          title="Сброс"
        >
          ↺
        </button>

        <button type="button" className={styles.btn} onClick={onRandom} title="Случайный массив">
          🎲 Random
        </button>
      </div>

      <Slider
        id="playback-speed"
        label="Скорость"
        // Инвертируем UI: больше вправо = быстрее (меньше ms)
        min={50}
        max={1000}
        step={50}
        value={1050 - speed}
        valueLabel={`${speed} ms`}
        onChange={(uiValue) => onSpeedChange(1050 - uiValue)}
      />

      <div className={styles.meta}>
        <span>
          Шаг: <span className={styles.metaStrong}>{stepLabel}</span>
        </span>
        <span>
          Время:{" "}
          <span className={styles.metaStrong} aria-live="polite">
            {formatElapsedMs(elapsedMs)}
          </span>
        </span>
        <span>
          Сравнений: <span className={styles.metaStrong}>{stats.comparisons}</span>
        </span>
        <span>
          Перестановок: <span className={styles.metaStrong}>{stats.swaps}</span>
        </span>
      </div>
    </div>
  );
}
