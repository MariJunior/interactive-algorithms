import type { KnapsackGreedyStep, KnapsackItem } from "@/algorithms/types";

export interface KnapsackResult {
  totalValue: number;
  takenFraction: Record<string, number>;
}

/** Дробный рюкзак: по убыванию value/weight, можно брать долю */
export function fractionalKnapsack(
  items: KnapsackItem[],
  capacity: number,
): KnapsackResult {
  const sorted = [...items].sort(
    (a, b) => b.value / b.weight - a.value / a.weight,
  );
  const takenFraction: Record<string, number> = {};
  let remaining = capacity;
  let totalValue = 0;

  for (const item of sorted) {
    if (remaining <= 0) break;
    if (item.weight <= remaining) {
      takenFraction[item.id] = 1;
      remaining -= item.weight;
      totalValue += item.value;
    } else {
      const fraction = remaining / item.weight;
      takenFraction[item.id] = fraction;
      totalValue += item.value * fraction;
      remaining = 0;
    }
  }

  return { totalValue, takenFraction };
}

export function* fractionalKnapsackSteps(
  items: KnapsackItem[],
  capacity: number,
): Generator<KnapsackGreedyStep> {
  const sorted = [...items].sort(
    (a, b) => b.value / b.weight - a.value / a.weight,
  );
  const orderIds = sorted.map((i) => i.id);
  const density = (item: KnapsackItem) =>
    Math.round((item.value / item.weight) * 100) / 100;

  yield {
    kind: "knapsack",
    action: "sort",
    items: [...items],
    orderIds,
    capacity,
    remaining: capacity,
    totalValue: 0,
    takenFraction: {},
    formula: "Сортируем по ценности на кг (value/weight) ↓",
    message: `Задача: набрать максимум ценности в рюкзак вместимости ${capacity}`,
  };

  const takenFraction: Record<string, number> = {};
  let remaining = capacity;
  let totalValue = 0;

  for (const item of sorted) {
    yield {
      kind: "knapsack",
      action: "consider",
      items: [...items],
      orderIds,
      capacity,
      remaining,
      totalValue,
      takenFraction: { ...takenFraction },
      consideringId: item.id,
      formula: `${item.label}: w=${item.weight}, v=${item.value}, плотность=${density(item)}`,
      message: `Осталось места: ${remaining}`,
    };

    if (remaining <= 0) {
      yield {
        kind: "knapsack",
        action: "skip",
        items: [...items],
        orderIds,
        capacity,
        remaining,
        totalValue,
        takenFraction: { ...takenFraction },
        consideringId: item.id,
        formula: "Рюкзак полон",
        message: `Пропускаем ${item.label}`,
      };
      continue;
    }

    if (item.weight <= remaining) {
      takenFraction[item.id] = 1;
      remaining -= item.weight;
      totalValue += item.value;
      yield {
        kind: "knapsack",
        action: "take",
        items: [...items],
        orderIds,
        capacity,
        remaining,
        totalValue,
        takenFraction: { ...takenFraction },
        consideringId: item.id,
        formula: `Берём 100% ${item.label} → value=${totalValue}, остаток=${remaining}`,
        message: `Целиком кладём ${item.label}`,
      };
    } else {
      const fraction = remaining / item.weight;
      takenFraction[item.id] = fraction;
      totalValue += item.value * fraction;
      const takenW = remaining;
      remaining = 0;
      yield {
        kind: "knapsack",
        action: "take",
        items: [...items],
        orderIds,
        capacity,
        remaining,
        totalValue,
        takenFraction: { ...takenFraction },
        consideringId: item.id,
        formula: `Берём ${(fraction * 100).toFixed(0)}% ${item.label} (вес ${takenW}) → value≈${totalValue.toFixed(1)}`,
        message: `Дробная доля — рюкзак заполнен`,
      };
    }
  }

  yield {
    kind: "knapsack",
    action: "done",
    items: [...items],
    orderIds,
    capacity,
    remaining,
    totalValue,
    takenFraction: { ...takenFraction },
    formula: `Итоговая ценность ≈ ${totalValue.toFixed(1)}`,
    message: `Готово: ценность ${totalValue.toFixed(1)}`,
  };
}
