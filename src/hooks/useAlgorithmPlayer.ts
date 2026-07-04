import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface PlayerStats {
  comparisons: number;
  swaps: number;
}

interface StepWithAction {
  action?: string;
}

const COUNTABLE_ACTIONS = {
  comparisons: new Set(["compare", "select"]),
  swaps: new Set(["swap"]),
};

function computeStats(steps: StepWithAction[], upToIndex: number): PlayerStats {
  const slice = steps.slice(0, upToIndex + 1);

  return {
    comparisons: slice.filter((step) => COUNTABLE_ACTIONS.comparisons.has(step.action ?? ""))
      .length,
    swaps: slice.filter((step) => COUNTABLE_ACTIONS.swaps.has(step.action ?? "")).length,
  };
}

/**
 * Управляет воспроизведением шагов: play/pause, навигация, скорость, статистика.
 */
export function useAlgorithmPlayer<T extends StepWithAction>(steps: T[], stepsId: string) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [prevStepsId, setPrevStepsId] = useState(stepsId);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Сброс при смене input/алгоритма — паттерн «adjust state when prop changes»
  if (stepsId !== prevStepsId) {
    setPrevStepsId(stepsId);
    setCurrentIndex(0);
    setIsPlaying(false);
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
  };
}
