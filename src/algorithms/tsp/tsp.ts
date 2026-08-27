import type { TspCity, TspStep } from "@/algorithms/types";

/** Евклидово расстояние (округляем до 1 знака — стабильные тесты) */
export function cityDistance(a: TspCity, b: TspCity): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.round(Math.hypot(dx, dy) * 10) / 10;
}

export function tourLength(cities: TspCity[], path: string[]): number {
  const byId = new Map(cities.map((c) => [c.id, c]));
  if (path.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const from = byId.get(path[i]);
    const to = byId.get(path[i + 1]);
    if (!from || !to) continue;
    total += cityDistance(from, to);
  }
  // замыкание тура
  const first = byId.get(path[0]);
  const last = byId.get(path[path.length - 1]);
  if (first && last && path.length > 1) {
    total += cityDistance(last, first);
  }
  return Math.round(total * 10) / 10;
}

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/** Все перестановки массива (Heap) */
function* permutations<T>(items: T[]): Generator<T[]> {
  const arr = [...items];
  const n = arr.length;
  const c = Array(n).fill(0);
  yield [...arr];

  let i = 0;
  while (i < n) {
    if (c[i] < i) {
      const j = i % 2 === 0 ? 0 : c[i];
      [arr[j], arr[i]] = [arr[i], arr[j]];
      yield [...arr];
      c[i] += 1;
      i = 0;
    } else {
      c[i] = 0;
      i += 1;
    }
  }
}

/** Полный перебор туров с фиксированным стартом: (n-1)! */
export function tspBruteForce(
  cities: TspCity[],
  startId: string,
): { path: string[]; length: number; toursChecked: number } {
  const start = cities.find((c) => c.id === startId);
  if (!start) return { path: [], length: Infinity, toursChecked: 0 };

  const others = cities.filter((c) => c.id !== startId).map((c) => c.id);
  let bestPath = [startId, ...others];
  let bestLength = tourLength(cities, bestPath);
  let toursChecked = 0;

  for (const mid of permutations(others)) {
    toursChecked += 1;
    const path = [startId, ...mid];
    const length = tourLength(cities, path);
    if (length < bestLength) {
      bestLength = length;
      bestPath = path;
    }
  }

  return { path: bestPath, length: bestLength, toursChecked };
}

export function* tspBruteForceSteps(
  cities: TspCity[],
  startId: string,
): Generator<TspStep> {
  const start = cities.find((c) => c.id === startId);
  const others = cities.filter((c) => c.id !== startId).map((c) => c.id);
  const totalTours = factorial(Math.max(0, cities.length - 1));

  if (!start) {
    yield {
      kind: "tsp",
      action: "done",
      method: "brute",
      cities,
      path: [],
      bestPath: [],
      bestLength: Infinity,
      toursChecked: 0,
      totalTours,
      message: `Стартовый город ${startId} не найден`,
    };
    return;
  }

  let bestPath = [startId, ...others];
  let bestLength = tourLength(cities, bestPath);
  let toursChecked = 0;

  yield {
    kind: "tsp",
    action: "explore",
    method: "brute",
    cities,
    path: bestPath,
    bestPath: [...bestPath],
    bestLength,
    currentLength: bestLength,
    toursChecked: 0,
    totalTours,
    formula: `n=${cities.length} → (n−1)! = ${totalTours} туров (старт зафиксирован)`,
    message:
      "Задача о коммивояжёре: полный перебор — NP-полная, на больших n не масштабируется",
  };

  for (const mid of permutations(others)) {
    toursChecked += 1;
    const path = [startId, ...mid];
    const length = tourLength(cities, path);

    yield {
      kind: "tsp",
      action: "explore",
      method: "brute",
      cities,
      path,
      bestPath: [...bestPath],
      bestLength,
      currentLength: length,
      toursChecked,
      totalTours,
      formula: `Тур #${toursChecked}/${totalTours}: длина ${length}`,
      message: `Смотрим ${path.join(" → ")} → ${startId}`,
    };

    if (length < bestLength) {
      bestLength = length;
      bestPath = path;
      yield {
        kind: "tsp",
        action: "improve",
        method: "brute",
        cities,
        path,
        bestPath: [...bestPath],
        bestLength,
        currentLength: length,
        toursChecked,
        totalTours,
        formula: `Новый рекорд: ${length}`,
        message: `Улучшили лучший тур`,
      };
    }
  }

  yield {
    kind: "tsp",
    action: "done",
    method: "brute",
    cities,
    path: [...bestPath],
    bestPath: [...bestPath],
    bestLength,
    currentLength: bestLength,
    toursChecked,
    totalTours,
    formula: `Оптимум на демо: ${bestPath.join(" → ")} → ${startId} = ${bestLength}`,
    message: `Готово: просмотрено ${toursChecked} туров`,
  };
}

/** Жадная эвристика nearest-neighbor (не гарантирует оптимум) */
export function tspNearestNeighbor(
  cities: TspCity[],
  startId: string,
): { path: string[]; length: number } {
  const byId = new Map(cities.map((c) => [c.id, c]));
  if (!byId.has(startId)) return { path: [], length: Infinity };

  const remaining = new Set(cities.map((c) => c.id));
  remaining.delete(startId);
  const path = [startId];
  let current = startId;

  while (remaining.size > 0) {
    let nearest: string | null = null;
    let bestDist = Infinity;
    const from = byId.get(current)!;
    for (const id of remaining) {
      const d = cityDistance(from, byId.get(id)!);
      if (d < bestDist || (d === bestDist && nearest !== null && id < nearest)) {
        bestDist = d;
        nearest = id;
      }
    }
    if (!nearest) break;
    path.push(nearest);
    remaining.delete(nearest);
    current = nearest;
  }

  return { path, length: tourLength(cities, path) };
}

export function* tspNearestNeighborSteps(
  cities: TspCity[],
  startId: string,
): Generator<TspStep> {
  const byId = new Map(cities.map((c) => [c.id, c]));
  const totalTours = factorial(Math.max(0, cities.length - 1));

  if (!byId.has(startId)) {
    yield {
      kind: "tsp",
      action: "done",
      method: "nearest-neighbor",
      cities,
      path: [],
      bestPath: [],
      bestLength: Infinity,
      toursChecked: 0,
      totalTours,
      message: `Стартовый город ${startId} не найден`,
    };
    return;
  }

  const remaining = new Set(cities.map((c) => c.id));
  remaining.delete(startId);
  const path = [startId];

  yield {
    kind: "tsp",
    action: "take",
    method: "nearest-neighbor",
    cities,
    path: [...path],
    bestPath: [],
    bestLength: Infinity,
    toursChecked: 0,
    totalTours,
    formula: `Старт ${startId}; жадно идём к ближайшему непосещённому`,
    message:
      "Задача о коммивояжёре: nearest-neighbor — быстрая эвристика, не оптимум",
  };

  while (remaining.size > 0) {
    const current = path[path.length - 1];
    const from = byId.get(current)!;
    let nearest: string | null = null;
    let bestDist = Infinity;

    for (const id of remaining) {
      const d = cityDistance(from, byId.get(id)!);
      if (d < bestDist || (d === bestDist && nearest !== null && id < nearest)) {
        bestDist = d;
        nearest = id;
      }
    }
    if (!nearest) break;

    path.push(nearest);
    remaining.delete(nearest);
    const partialLen = tourLength(cities, path);

    yield {
      kind: "tsp",
      action: "take",
      method: "nearest-neighbor",
      cities,
      path: [...path],
      bestPath: [...path],
      bestLength: partialLen,
      currentLength: bestDist,
      toursChecked: 0,
      totalTours,
      formula: `${current} → ${nearest} (dist ${bestDist})`,
      message: `Добавили ${nearest}`,
    };
  }

  const length = tourLength(cities, path);
  yield {
    kind: "tsp",
    action: "done",
    method: "nearest-neighbor",
    cities,
    path: [...path],
    bestPath: [...path],
    bestLength: length,
    currentLength: length,
    toursChecked: 0,
    totalTours,
    formula: `Тур: ${path.join(" → ")} → ${startId} = ${length}`,
    message: `Готово (эвристика). Для сравнения — полный перебор смотрит ${totalTours} туров`,
  };
}
