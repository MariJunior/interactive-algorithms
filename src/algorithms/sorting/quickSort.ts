import type { SortStep } from "@/algorithms/types";

/** In-place Quick Sort (Lomuto partition, pivot = последний элемент диапазона) */
export function quickSort(arr: number[]): number[] {
  const items = [...arr];
  quickSortRange(items, 0, items.length - 1);
  return items;
}

function quickSortRange(items: number[], lo: number, hi: number): void {
  if (lo >= hi) return;

  const pivotIndex = partition(items, lo, hi);
  quickSortRange(items, lo, pivotIndex - 1);
  quickSortRange(items, pivotIndex + 1, hi);
}

function partition(items: number[], lo: number, hi: number): number {
  const pivot = items[hi];
  let store = lo;

  for (let i = lo; i < hi; i++) {
    if (items[i] < pivot) {
      [items[i], items[store]] = [items[store], items[i]];
      store += 1;
    }
  }

  [items[store], items[hi]] = [items[hi], items[store]];
  return store;
}

/** Генератор шагов — не мутирует исходный массив */
export function* quickSortSteps(arr: number[]): Generator<SortStep> {
  const items = [...arr];

  yield {
    array: [...items],
    action: "compare",
    message: "Начальное состояние массива",
  };

  if (items.length <= 1) {
    yield {
      array: [...items],
      action: "done",
      sorted: items.map((_, index) => index),
      message: "Массив уже отсортирован",
    };
    return;
  }

  const settled: number[] = [];
  yield* quickSortRangeSteps(items, 0, items.length - 1, settled);

  yield {
    array: [...items],
    action: "done",
    sorted: items.map((_, index) => index),
    message: "Массив отсортирован",
  };
}

function* quickSortRangeSteps(
  items: number[],
  lo: number,
  hi: number,
  settled: number[],
): Generator<SortStep> {
  if (lo > hi) return;

  if (lo === hi) {
    if (!settled.includes(lo)) settled.push(lo);
    yield {
      array: [...items],
      action: "select",
      comparing: [lo, lo],
      sorted: [...settled],
      message: `Подмассив из одного элемента [${lo}] уже на месте`,
    };
    return;
  }

  const pivotValue = items[hi];

  yield {
    array: [...items],
    action: "pivot",
    pivot: hi,
    sorted: [...settled],
    message: `Pivot = ${pivotValue} (индекс ${hi}), диапазон [${lo}..${hi}]`,
  };

  let store = lo;

  for (let i = lo; i < hi; i++) {
    yield {
      array: [...items],
      action: "compare",
      comparing: [i, hi],
      pivot: hi,
      sorted: [...settled],
      message: `Сравниваем ${items[i]} с pivot ${pivotValue}`,
    };

    if (items[i] < pivotValue) {
      if (i !== store) {
        [items[i], items[store]] = [items[store], items[i]];
        yield {
          array: [...items],
          action: "swap",
          swapping: [i, store],
          pivot: hi,
          sorted: [...settled],
          message: `${items[store]} < pivot → в левую часть (swap ${i} ↔ ${store})`,
        };
      }
      store += 1;
    }
  }

  [items[store], items[hi]] = [items[hi], items[store]];
  yield {
    array: [...items],
    action: "swap",
    swapping: [store, hi],
    pivot: store,
    sorted: [...settled],
    message: `Ставим pivot ${pivotValue} на финальную позицию ${store}`,
  };

  settled.push(store);

  yield* quickSortRangeSteps(items, lo, store - 1, settled);
  yield* quickSortRangeSteps(items, store + 1, hi, settled);
}
