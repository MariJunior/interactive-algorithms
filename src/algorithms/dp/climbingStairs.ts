import type { DpStep } from "@/algorithms/types";

/**
 * Число способов подняться на n ступеней, шагая на 1 или 2.
 * ways(n) = ways(n-1) + ways(n-2) — та же рекурсия, что у Fibonacci.
 */
export function climbingStairs(n: number): number {
  if (n <= 0) return 0;
  if (n <= 2) return n;
  let prev = 1;
  let curr = 2;
  for (let i = 3; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

export function* climbingStairsSteps(n: number): Generator<DpStep> {
  const safeN = Math.max(n, 1);
  const table: Array<number | null> = Array.from({ length: safeN + 1 }, () => null);

  yield {
    table: [...table],
    action: "init",
    n: safeN,
    formula: "ways(1)=1, ways(2)=2",
    message: `Задача: сколько способов подняться на ${safeN} ступеней (шаг 1 или 2)`,
  };

  table[1] = 1;
  yield {
    table: [...table],
    action: "init",
    n: safeN,
    focusIndex: 1,
    formula: "dp[1] = 1",
    message: "На 1 ступень — один способ: один шаг +1",
  };

  if (safeN >= 2) {
    table[2] = 2;
    yield {
      table: [...table],
      action: "init",
      n: safeN,
      focusIndex: 2,
      formula: "dp[2] = 2",
      message: "На 2 ступени: (1+1) или (2)",
    };
  }

  for (let i = 3; i <= safeN; i++) {
    const a = table[i - 1] ?? 0;
    const b = table[i - 2] ?? 0;
    table[i] = a + b;
    yield {
      table: [...table],
      action: "compute",
      n: safeN,
      focusIndex: i,
      reading: [i - 1, i - 2],
      formula: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${a} + ${b} = ${table[i]}`,
      message: `Способы дойти до ступени ${i}`,
    };
  }

  const result = table[safeN] ?? 0;
  yield {
    table: [...table],
    action: "done",
    n: safeN,
    focusIndex: safeN,
    result,
    formula: `Ответ: ${result} способ(ов)`,
    message: `Готово: на ${safeN} ступеней — ${result} способов`,
  };
}
