import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SortStep } from "@/algorithms/types";
import { bubbleSortSteps } from "@/algorithms/sorting/bubbleSort";
import { useAlgorithmRunner } from "./useAlgorithmRunner";
import { useAlgorithmPlayer } from "./useAlgorithmPlayer";

describe("useAlgorithmRunner", () => {
  it("собирает шаги из генератора", () => {
    const input = [3, 1, 2];
    const { result } = renderHook(() => useAlgorithmRunner(bubbleSortSteps, input));

    expect(result.current.totalSteps).toBeGreaterThan(0);
    expect(result.current.steps.at(-1)?.action).toBe("done");
  });
});

describe("useAlgorithmPlayer", () => {
  const steps: SortStep[] = Array.from(bubbleSortSteps([3, 1, 2]));

  it("начинает с первого шага", () => {
    const { result } = renderHook(() => useAlgorithmPlayer(steps, "3,1,2"));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isPlaying).toBe(false);
  });

  it("stepForward переходит к следующему шагу", () => {
    const { result } = renderHook(() => useAlgorithmPlayer(steps, "3,1,2"));

    act(() => {
      result.current.stepForward();
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it("reset возвращает к началу", () => {
    const { result } = renderHook(() => useAlgorithmPlayer(steps, "3,1,2"));

    act(() => {
      result.current.stepForward();
      result.current.stepForward();
      result.current.reset();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isPlaying).toBe(false);
  });
});
