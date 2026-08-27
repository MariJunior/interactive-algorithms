import type {
  SetCoverCandidate,
  SetCoverElement,
  SetCoverGreedyStep,
} from "@/algorithms/types";

function gainFor(candidate: SetCoverCandidate, uncovered: Set<string>): number {
  let gain = 0;
  for (const id of candidate.elementIds) {
    if (uncovered.has(id)) gain += 1;
  }
  return gain;
}

/** Лучший кандидат: max новых элементов, при ничьей — меньший id */
function pickBest(
  remaining: SetCoverCandidate[],
  uncovered: Set<string>,
): { best: SetCoverCandidate | null; bestGain: number } {
  let best: SetCoverCandidate | null = null;
  let bestGain = -1;

  for (const candidate of remaining) {
    const gain = gainFor(candidate, uncovered);
    if (
      gain > bestGain ||
      (gain === bestGain && best !== null && candidate.id.localeCompare(best.id) < 0)
    ) {
      best = candidate;
      bestGain = gain;
    }
  }

  return { best, bestGain };
}

/** Жадное покрытие множества: на каждом шаге — максимум новых элементов */
export function setCover(
  universe: SetCoverElement[],
  candidates: SetCoverCandidate[],
): string[] {
  const uncovered = new Set(universe.map((el) => el.id));
  const remaining = [...candidates];
  const selected: string[] = [];

  while (uncovered.size > 0 && remaining.length > 0) {
    const { best, bestGain } = pickBest(remaining, uncovered);
    if (!best || bestGain <= 0) break;

    selected.push(best.id);
    for (const id of best.elementIds) uncovered.delete(id);
    const idx = remaining.findIndex((c) => c.id === best.id);
    if (idx >= 0) remaining.splice(idx, 1);
  }

  return selected;
}

export function* setCoverSteps(
  universe: SetCoverElement[],
  candidates: SetCoverCandidate[],
): Generator<SetCoverGreedyStep> {
  const uncovered = new Set(universe.map((el) => el.id));
  const remaining = [...candidates];
  const selectedIds: string[] = [];

  const snapshot = (): Omit<
    SetCoverGreedyStep,
    "action" | "message" | "formula" | "consideringId" | "gain"
  > => ({
    kind: "set-cover",
    universe: [...universe],
    candidates: [...candidates],
    uncoveredIds: [...uncovered],
    selectedIds: [...selectedIds],
  });

  yield {
    ...snapshot(),
    action: "consider",
    formula: `Универсум: ${universe.map((el) => el.label).join(", ")}`,
    message:
      "Задача о покрытии множества: покрыть все элементы минимумом подмножеств",
  };

  while (uncovered.size > 0 && remaining.length > 0) {
    const ordered = [...remaining].sort((a, b) => a.id.localeCompare(b.id));

    for (const candidate of ordered) {
      const gain = gainFor(candidate, uncovered);
      yield {
        ...snapshot(),
        action: "consider",
        consideringId: candidate.id,
        gain,
        formula: `${candidate.label}: +${gain} новых из ещё непокрытых`,
        message: `Смотрим ${candidate.label}`,
      };
    }

    const { best, bestGain } = pickBest(remaining, uncovered);
    if (!best || bestGain <= 0) {
      yield {
        ...snapshot(),
        action: "done",
        formula: "Нельзя покрыть оставшееся — кандидаты исчерпаны",
        message: "Остановка: непокрытые элементы остались",
      };
      return;
    }

    selectedIds.push(best.id);
    for (const id of best.elementIds) uncovered.delete(id);
    const removeIdx = remaining.findIndex((c) => c.id === best.id);
    if (removeIdx >= 0) remaining.splice(removeIdx, 1);

    yield {
      ...snapshot(),
      action: "take",
      consideringId: best.id,
      gain: bestGain,
      formula: `Берём ${best.label} (+${bestGain}) — жадный выбор`,
      message: `Выбрали ${best.label}`,
    };
  }

  yield {
    ...snapshot(),
    action: "done",
    formula: `Выбрано подмножеств: ${selectedIds.length}`,
    message: `Готово: покрытие из ${selectedIds.length} множеств`,
  };
}
