import type { HashEntry } from "@/algorithms/types";

/** Учебная вместимость — маленькая, чтобы чаще видеть коллизии */
export const DEMO_HASH_CAPACITY = 5;

export type HashOp =
  | { type: "insert"; key: string; value: string }
  | { type: "lookup"; key: string };

/**
 * Демо в духе «Грокаем алгоритмы»: вставки + поиск.
 * apple и mango дают одинаковый индекс при capacity=5 (сумма кодов % 5).
 */
export function createDemoHashOps(): HashOp[] {
  return [
    { type: "insert", key: "apple", value: "яблоко" },
    { type: "insert", key: "banana", value: "банан" },
    { type: "insert", key: "mango", value: "манго" },
    { type: "lookup", key: "apple" },
    { type: "lookup", key: "kiwi" },
  ];
}

export function emptyBuckets(capacity: number): HashEntry[][] {
  return Array.from({ length: capacity }, () => []);
}
