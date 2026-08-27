import type { DpStep } from "@/algorithms/types";

/** Чистый Fibonacci (bottom-up), F(0)=0, F(1)=1 */
export function fibonacci(n: number): number {
  if (n < 0) return 0;
  if (n <= 1) return n;
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

/** Генератор шагов: явно заполняем таблицу dp[0..n] */
export function* fibonacciSteps(n: number): Generator<DpStep> {
  const size = Math.max(n, 1);
  const table: Array<number | null> = Array.from({ length: size + 1 }, () => null);

  yield {
    table: [...table],
    action: "init",
    n,
    formula: "F(0) = 0, F(1) = 1",
    message: `Задача: найти F(${n}). База: F(0)=0, F(1)=1`,
  };

  table[0] = 0;
  yield {
    table: [...table],
    action: "init",
    n,
    focusIndex: 0,
    formula: "dp[0] = 0",
    message: "Записываем базу: dp[0] = 0",
  };

  if (n >= 1) {
    table[1] = 1;
    yield {
      table: [...table],
      action: "init",
      n,
      focusIndex: 1,
      formula: "dp[1] = 1",
      message: "Записываем базу: dp[1] = 1",
    };
  }

  for (let i = 2; i <= n; i++) {
    const left = table[i - 1] ?? 0;
    const right = table[i - 2] ?? 0;
    table[i] = left + right;
    yield {
      table: [...table],
      action: "compute",
      n,
      focusIndex: i,
      reading: [i - 1, i - 2],
      formula: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${left} + ${right} = ${table[i]}`,
      message: `Считаем F(${i})`,
    };
  }

  const result = n <= 0 ? 0 : (table[n] ?? 0);
  yield {
    table: [...table],
    action: "done",
    n,
    focusIndex: n,
    result,
    formula: `Ответ: F(${n}) = ${result}`,
    message: `Готово: F(${n}) = ${result}`,
  };
}
