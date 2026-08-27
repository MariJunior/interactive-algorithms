import type { KnnPoint, KnnStep } from "@/algorithms/types";

export function euclidean(
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  return Math.round(Math.hypot(ax - bx, ay - by) * 10) / 10;
}

/** Чистая классификация k-NN (евклидово расстояние, голосование большинством) */
export function knnClassify(
  points: KnnPoint[],
  query: { x: number; y: number },
  k: number,
): { prediction: string; neighborIds: string[]; votes: Record<string, number> } {
  const ranked = [...points]
    .map((point) => ({
      id: point.id,
      label: point.label,
      distance: euclidean(query.x, query.y, point.x, point.y),
    }))
    .sort(
      (a, b) =>
        a.distance - b.distance || a.id.localeCompare(b.id),
    );

  const safeK = Math.max(1, Math.min(k, ranked.length));
  const neighbors = ranked.slice(0, safeK);
  const votes: Record<string, number> = {};
  for (const neighbor of neighbors) {
    votes[neighbor.label] = (votes[neighbor.label] ?? 0) + 1;
  }

  let prediction = neighbors[0]?.label ?? "?";
  let bestCount = -1;
  for (const [label, count] of Object.entries(votes)) {
    if (
      count > bestCount ||
      (count === bestCount && label.localeCompare(prediction) < 0)
    ) {
      bestCount = count;
      prediction = label;
    }
  }

  return {
    prediction,
    neighborIds: neighbors.map((n) => n.id),
    votes,
  };
}

export function* knnSteps(
  points: KnnPoint[],
  query: { x: number; y: number },
  k: number,
): Generator<KnnStep> {
  const safeK = Math.max(1, Math.min(k, Math.max(1, points.length)));
  const distances: Array<{ id: string; distance: number }> = [];

  yield {
    kind: "knn",
    action: "measure",
    points: [...points],
    query: { ...query },
    k: safeK,
    distances: [],
    neighborIds: [],
    formula: `k = ${safeK}; query = (${query.x}, ${query.y})`,
    message: "k ближайших соседей: классифицируем новую точку по большинству среди k",
  };

  const ordered = [...points].sort((a, b) => a.id.localeCompare(b.id));
  for (const point of ordered) {
    const distance = euclidean(query.x, query.y, point.x, point.y);
    distances.push({ id: point.id, distance });
    yield {
      kind: "knn",
      action: "measure",
      points: [...points],
      query: { ...query },
      k: safeK,
      distances: [...distances],
      neighborIds: [],
      focusId: point.id,
      formula: `dist(query, ${point.id}) = ${distance}`,
      message: `Измеряем расстояние до ${point.id} (класс ${point.label})`,
    };
  }

  const ranked = [...distances].sort(
    (a, b) => a.distance - b.distance || a.id.localeCompare(b.id),
  );
  const neighborIds = ranked.slice(0, safeK).map((d) => d.id);

  yield {
    kind: "knn",
    action: "rank",
    points: [...points],
    query: { ...query },
    k: safeK,
    distances: ranked,
    neighborIds: [...neighborIds],
    formula: `Топ-${safeK}: ${neighborIds.join(", ")}`,
    message: "Упорядочили точки по возрастанию расстояния",
  };

  const byId = new Map(points.map((p) => [p.id, p]));
  const votes: Record<string, number> = {};
  for (const id of neighborIds) {
    const label = byId.get(id)?.label ?? "?";
    votes[label] = (votes[label] ?? 0) + 1;
  }

  yield {
    kind: "knn",
    action: "vote",
    points: [...points],
    query: { ...query },
    k: safeK,
    distances: ranked,
    neighborIds: [...neighborIds],
    votes: { ...votes },
    formula: Object.entries(votes)
      .map(([label, count]) => `${label}: ${count}`)
      .join(" · "),
    message: "Голосование соседей",
  };

  const result = knnClassify(points, query, safeK);

  yield {
    kind: "knn",
    action: "done",
    points: [...points],
    query: { ...query },
    k: safeK,
    distances: ranked,
    neighborIds: result.neighborIds,
    votes: result.votes,
    prediction: result.prediction,
    formula: `Предсказание: класс ${result.prediction}`,
    message: `Готово: query ∈ «${result.prediction}»`,
  };
}
