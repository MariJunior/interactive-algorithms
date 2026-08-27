import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { SortStep } from "@/algorithms/types";
import { bubbleSortSteps } from "@/algorithms/sorting/bubbleSort";
import { useAlgorithmRunner } from "./useAlgorithmRunner";
import { formatElapsedMs, useAlgorithmPlayer } from "./useAlgorithmPlayer";

describe("useAlgorithmRunner", () => {
  it("собирает шаги из генератора", () => {
    const input = [3, 1, 2];
    const { result } = renderHook(() => useAlgorithmRunner(bubbleSortSteps, input));

    expect(result.current.totalSteps).toBeGreaterThan(0);
    expect(result.current.steps.at(-1)?.action).toBe("done");
  });
});

describe("formatElapsedMs", () => {
  it("форматирует целые миллисекунды", () => {
    expect(formatElapsedMs(0)).toBe("0 ms");
    expect(formatElapsedMs(1234.6)).toBe("1235 ms");
  });
});

describe("useAlgorithmPlayer", () => {
  const steps: SortStep[] = Array.from(bubbleSortSteps([3, 1, 2]));

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "performance"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("начинает с первого шага и нулевого таймера", () => {
    const { result } = renderHook(() => useAlgorithmPlayer(steps, "3,1,2"));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.elapsedMs).toBe(0);
  });

  it("stepForward переходит к следующему шагу", () => {
    const { result } = renderHook(() => useAlgorithmPlayer(steps, "3,1,2"));

    act(() => {
      result.current.stepForward();
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it("reset возвращает к началу и обнуляет таймер", () => {
    const { result } = renderHook(() => useAlgorithmPlayer(steps, "3,1,2"));

    act(() => {
      result.current.play();
    });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.elapsedMs).toBe(0);
  });
});
