import type {
  ActivityItem,
  KnapsackItem,
  SetCoverCandidate,
  SetCoverElement,
} from "@/algorithms/types";

/** Учебный набор активностей на временной шкале 0…12 */
export function createDemoActivities(): ActivityItem[] {
  return [
    { id: "a1", label: "A", start: 1, finish: 4 },
    { id: "a2", label: "B", start: 3, finish: 5 },
    { id: "a3", label: "C", start: 0, finish: 6 },
    { id: "a4", label: "D", start: 5, finish: 7 },
    { id: "a5", label: "E", start: 3, finish: 9 },
    { id: "a6", label: "F", start: 5, finish: 9 },
    { id: "a7", label: "G", start: 6, finish: 10 },
    { id: "a8", label: "H", start: 8, finish: 11 },
    { id: "a9", label: "I", start: 8, finish: 12 },
    { id: "a10", label: "J", start: 11, finish: 14 },
  ];
}

/** Учебный рюкзак: capacity 15 */
export const DEMO_KNAPSACK_CAPACITY = 15;

export function createDemoKnapsackItems(): KnapsackItem[] {
  return [
    { id: "k1", label: "Золото", weight: 10, value: 60 },
    { id: "k2", label: "Серебро", weight: 20, value: 100 },
    { id: "k3", label: "Бронза", weight: 30, value: 120 },
  ];
}

/**
 * Демо «радиостанции» в духе «Грокаем алгоритмы»:
 * покрыть штаты минимумом станций (жадное приближение).
 */
export function createDemoSetCoverUniverse(): SetCoverElement[] {
  return [
    { id: "mt", label: "MT" },
    { id: "wa", label: "WA" },
    { id: "or", label: "OR" },
    { id: "id", label: "ID" },
    { id: "nv", label: "NV" },
    { id: "ut", label: "UT" },
    { id: "ca", label: "CA" },
    { id: "az", label: "AZ" },
  ];
}

export function createDemoSetCoverCandidates(): SetCoverCandidate[] {
  return [
    { id: "s1", label: "Станция 1", elementIds: ["id", "nv", "ut"] },
    { id: "s2", label: "Станция 2", elementIds: ["wa", "id", "mt"] },
    { id: "s3", label: "Станция 3", elementIds: ["or", "nv", "ca"] },
    { id: "s4", label: "Станция 4", elementIds: ["nv", "ut"] },
    { id: "s5", label: "Станция 5", elementIds: ["ca", "az"] },
  ];
}
