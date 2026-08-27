import { describe, expect, it } from "vitest";
import {
  createDemoHashOps,
  DEMO_HASH_CAPACITY,
  hashInsert,
  hashKey,
  hashLookup,
  hashTableSteps,
  emptyBuckets,
} from "./index";

describe("hashKey", () => {
  it("apple и mango дают один индекс при capacity=5", () => {
    expect(hashKey("apple", 5).index).toBe(hashKey("mango", 5).index);
    expect(hashKey("apple", 5).index).toBe(0);
  });
});

describe("hashInsert / hashLookup", () => {
  it("кладёт и находит ключ", () => {
    let buckets = emptyBuckets(5);
    buckets = hashInsert(buckets, "apple", "яблоко").buckets;
    expect(hashLookup(buckets, "apple").value).toBe("яблоко");
  });

  it("коллизия: apple и mango в одной цепочке", () => {
    let buckets = emptyBuckets(5);
    buckets = hashInsert(buckets, "apple", "яблоко").buckets;
    const second = hashInsert(buckets, "mango", "манго");
    expect(second.collided).toBe(true);
    expect(second.index).toBe(0);
    expect(second.buckets[0].map((e) => e.key)).toEqual(["apple", "mango"]);
  });
});

describe("hashTableSteps", () => {
  it("демо заканчивается done и содержит collide", () => {
    const steps = Array.from(
      hashTableSteps(createDemoHashOps(), DEMO_HASH_CAPACITY),
    );
    expect(steps.at(-1)?.action).toBe("done");
    expect(steps.some((s) => s.action === "collide")).toBe(true);
    expect(steps.some((s) => s.action === "found")).toBe(true);
    expect(steps.some((s) => s.action === "miss")).toBe(true);
  });
});
