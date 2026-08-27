import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface PlayerStats {
  comparisons: number;
  /** swap | insert | merge — перемещения данных, не только классические свапы */
  moves: number;
}

interface StepWithAction {
  action?: string;
}

const COUNTABLE_ACTIONS = {
  comparisons: new Set(["compare", "select", "explore", "descend", "init"]),
  moves: new Set(["swap", "insert", "merge", "visit", "compute", "match", "shift"]),
};

function computeStats(steps: StepWithAction[], upToIndex: number): PlayerStats {
  const slice = steps.slice(0, upToIndex + 1);

  return {
    comparisons: slice.filter((step) => COUNTABLE_ACTIONS.comparisons.has(step.action ?? ""))
      .length,
    moves: slice.filter((step) => COUNTABLE_ACTIONS.moves.has(step.action ?? "")).length,
  };
}

/** Формат для UI: целые миллисекунды */
export function formatElapsedMs(ms: number): string {
  return `${Math.max(0, Math.round(ms))} ms`;
}

/**
 * Управляет воспроизведением шагов: play/pause, навигация, скорость, статистика,
 * real-time таймер (wall-clock только пока идёт play).
 */
export function useAlgorithmPlayer<T extends StepWithAction>(steps: T[], stepsId: string) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [prevStepsId, setPrevStepsId] = useState(stepsId);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Накопленное время завершённых сегментов play (без текущего)
  const accumulatedRef = useRef(0);
  // Инкремент при reset/смене input — чтобы cleanup play-эффекта не дописал время после обнуления
  const timerGenerationRef = useRef(0);

  // Сброс при смене input/алгоритма — паттерн «adjust state when prop changes»
  if (stepsId !== prevStepsId) {
    setPrevStepsId(stepsId);
    setCurrentIndex(0);
    setIsPlaying(false);
    setElapsedMs(0);
    accumulatedRef.current = 0;
    timerGenerationRef.current += 1;
  }

  const totalSteps = steps.length;
  const currentStep = steps[currentIndex] ?? null;
  const isAtStart = currentIndex === 0;
  const isAtEnd = totalSteps === 0 || currentIndex >= totalSteps - 1;

  const stats = useMemo(
    () => computeStats(steps, currentIndex),
    [steps, currentIndex],
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (totalSteps === 0 || isAtEnd) return;
    setIsPlaying(true);
  }, [totalSteps, isAtEnd]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const stepForward = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, Math.max(totalSteps - 1, 0)));
  }, [totalSteps]);

  const stepBack = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  const reset = useCallback(() => {
    // Сначала гасим generation — cleanup play-эффекта не восстановит elapsed
    timerGenerationRef.current += 1;
    accumulatedRef.current = 0;
    setElapsedMs(0);
    pause();
    setCurrentIndex(0);
  }, [pause]);

  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), Math.max(totalSteps - 1, 0));
      setCurrentIndex(clamped);
    },
    [totalSteps],
  );

  // Real-time таймер: тикает только во время isPlaying
  useEffect(() => {
    if (!isPlaying) return;

    const generation = timerGenerationRef.current;
    const segmentStart = performance.now();
    let rafId = 0;

    const tick = () => {
      setElapsedMs(Math.round(accumulatedRef.current + performance.now() - segmentStart));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      // После reset/смены input generation другой — не дописываем в накопитель
      if (timerGenerationRef.current !== generation) return;
      accumulatedRef.current += performance.now() - segmentStart;
      setElapsedMs(Math.round(accumulatedRef.current));
    };
  }, [isPlaying]);

  // Автовоспроизведение с заданной скоростью
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((index) => {
        if (index >= totalSteps - 1) {
          setIsPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, speed);

    return clearTimer;
  }, [isPlaying, speed, totalSteps, clearTimer]);

  return {
    currentStep,
    currentIndex,
    totalSteps,
    isPlaying,
    isAtStart,
    isAtEnd,
    play,
    pause,
    toggle,
    stepForward,
    stepBack,
    reset,
    goToStep,
    speed,
    setSpeed,
    stats,
    /** Прошедшее wall-clock время воспроизведения, ms */
    elapsedMs,
  };
}
