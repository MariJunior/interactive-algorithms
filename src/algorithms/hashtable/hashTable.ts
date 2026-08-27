import type { HashEntry, HashTableStep } from "@/algorithms/types";
import { emptyBuckets } from "./demo";

/** Простая учебная хеш-функция: сумма кодов символов % capacity */
export function hashKey(key: string, capacity: number): { sum: number; index: number } {
  let sum = 0;
  for (let i = 0; i < key.length; i++) {
    sum += key.charCodeAt(i);
  }
  return { sum, index: capacity === 0 ? 0 : sum % capacity };
}

function cloneBuckets(buckets: HashEntry[][]): HashEntry[][] {
  return buckets.map((chain) => chain.map((entry) => ({ ...entry })));
}

export interface HashTableSnapshot {
  buckets: HashEntry[][];
  size: number;
}

/** Чистая вставка с chaining (обновляет value, если ключ уже есть) */
export function hashInsert(
  buckets: HashEntry[][],
  key: string,
  value: string,
): { buckets: HashEntry[][]; index: number; collided: boolean; updated: boolean } {
  const capacity = buckets.length;
  const { index } = hashKey(key, capacity);
  const next = cloneBuckets(buckets);
  const chain = next[index];
  const existing = chain.findIndex((entry) => entry.key === key);

  if (existing >= 0) {
    chain[existing] = { key, value };
    return { buckets: next, index, collided: chain.length > 1, updated: true };
  }

  const collided = chain.length > 0;
  chain.push({ key, value });
  return { buckets: next, index, collided, updated: false };
}

export function hashLookup(
  buckets: HashEntry[][],
  key: string,
): { index: number; value: string | undefined; comparisons: number } {
  const { index } = hashKey(key, buckets.length);
  const chain = buckets[index] ?? [];
  let comparisons = 0;
  for (const entry of chain) {
    comparisons += 1;
    if (entry.key === key) {
      return { index, value: entry.value, comparisons };
    }
  }
  return { index, value: undefined, comparisons: Math.max(comparisons, chain.length) };
}

export type HashScriptOp =
  | { type: "insert"; key: string; value: string }
  | { type: "lookup"; key: string };

/**
 * Генератор шагов: для каждой операции — hash → place/collide или lookup → found/miss.
 */
export function* hashTableSteps(
  ops: readonly HashScriptOp[],
  capacity: number,
): Generator<HashTableStep> {
  let buckets = emptyBuckets(capacity);

  for (const op of ops) {
    const { sum, index } = hashKey(op.key, capacity);

    yield {
      kind: "hashtable",
      action: "hash",
      capacity,
      buckets: cloneBuckets(buckets),
      focusIndex: index,
      focusKey: op.key,
      focusValue: op.type === "insert" ? op.value : undefined,
      hashSum: sum,
      hashIndex: index,
      op: op.type,
      formula: `hash("${op.key}") = ${sum} % ${capacity} = ${index}`,
      message:
        op.type === "insert"
          ? `Вставка ключа «${op.key}»`
          : `Поиск ключа «${op.key}»`,
    };

    if (op.type === "insert") {
      const beforeLen = buckets[index]?.length ?? 0;
      const result = hashInsert(buckets, op.key, op.value);
      buckets = result.buckets;
      const action = result.collided && !result.updated ? "collide" : "place";

      yield {
        kind: "hashtable",
        action,
        capacity,
        buckets: cloneBuckets(buckets),
        focusIndex: index,
        focusKey: op.key,
        focusValue: op.value,
        hashSum: sum,
        hashIndex: index,
        op: "insert",
        formula:
          action === "collide"
            ? `Коллизия в бакете [${index}] — добавляем в цепочку (было ${beforeLen})`
            : result.updated
              ? `Ключ уже был — обновили value в [${index}]`
              : `Бакет [${index}] свободен — кладём пару`,
        message:
          action === "collide"
            ? `Коллизия: «${op.key}» → цепочка [${index}]`
            : `Положили «${op.key}» → «${op.value}» в [${index}]`,
      };
    } else {
      const chain = buckets[index] ?? [];
      yield {
        kind: "hashtable",
        action: "lookup",
        capacity,
        buckets: cloneBuckets(buckets),
        focusIndex: index,
        focusKey: op.key,
        hashSum: sum,
        hashIndex: index,
        op: "lookup",
        formula: `Смотрим цепочку бакета [${index}] (длина ${chain.length})`,
        message: `Ищем «${op.key}» в бакете [${index}]`,
      };

      const found = hashLookup(buckets, op.key);
      if (found.value !== undefined) {
        yield {
          kind: "hashtable",
          action: "found",
          capacity,
          buckets: cloneBuckets(buckets),
          focusIndex: index,
          focusKey: op.key,
          focusValue: found.value,
          hashSum: sum,
          hashIndex: index,
          op: "lookup",
          formula: `Нашли за ${found.comparisons} сравн. в цепочке`,
          message: `Найдено: «${op.key}» → «${found.value}»`,
        };
      } else {
        yield {
          kind: "hashtable",
          action: "miss",
          capacity,
          buckets: cloneBuckets(buckets),
          focusIndex: index,
          focusKey: op.key,
          hashSum: sum,
          hashIndex: index,
          op: "lookup",
          formula:
            chain.length === 0
              ? "Бакет пуст — ключа нет"
              : "Прошли цепочку — ключа нет",
          message: `Промах: «${op.key}» не найден`,
        };
      }
    }
  }

  yield {
    kind: "hashtable",
    action: "done",
    capacity,
    buckets: cloneBuckets(buckets),
    message: "Сценарий завершён",
    formula: "В среднем O(1), в худшем O(n) при длинных цепочках",
  };
}
