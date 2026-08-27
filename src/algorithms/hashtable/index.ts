export {
  createDemoHashOps,
  DEMO_HASH_CAPACITY,
  emptyBuckets,
  type HashOp,
} from "./demo";
export {
  hashInsert,
  hashKey,
  hashLookup,
  hashTableSteps,
  type HashScriptOp,
} from "./hashTable";

import type { HashTableStep } from "@/algorithms/types";
import { createDemoHashOps, DEMO_HASH_CAPACITY } from "./demo";
import { hashTableSteps } from "./hashTable";

export const hashTableStepGenerators: Record<
  string,
  (capacity?: number) => Generator<HashTableStep>
> = {
  "hash-table": (capacity = DEMO_HASH_CAPACITY) =>
    hashTableSteps(createDemoHashOps(), capacity),
};

export function hasHashTableVisualization(slug: string): boolean {
  return slug in hashTableStepGenerators;
}

export function collectHashTableSteps(
  slug: string,
  capacity = DEMO_HASH_CAPACITY,
): HashTableStep[] | null {
  const create = hashTableStepGenerators[slug];
  if (!create) return null;
  return Array.from(create(capacity));
}
