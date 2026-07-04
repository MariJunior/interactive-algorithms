import { useMemo } from "react";

/** Собирает генератор в массив шагов */
export function collectSteps<T>(generator: Generator<T>): T[] {
  return Array.from(generator);
}

/**
 * Запускает генератор шагов для текущего input.
 * Родитель должен мемоизировать массив input, чтобы избежать лишних пересчётов.
 */
export function useAlgorithmRunner<T>(
  createGenerator: (input: number[]) => Generator<T>,
  input: number[],
) {
  const steps = useMemo(() => collectSteps(createGenerator(input)), [createGenerator, input]);

  return {
    steps,
    totalSteps: steps.length,
  };
}
