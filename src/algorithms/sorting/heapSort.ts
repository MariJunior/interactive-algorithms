import type { SortStep } from "@/algorithms/types";

/** Heap Sort на месте (max-heap) */
export function heapSort(arr: number[]): number[] {
  const items = [...arr];
  const n = items.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(items, n, i);
  }

  for (let end = n - 1; end > 0; end--) {
    [items[0], items[end]] = [items[end], items[0]];
    heapify(items, end, 0);
  }

  return items;
}

function heapify(items: number[], heapSize: number, root: number): void {
  let largest = root;
  const left = 2 * root + 1;
  const right = 2 * root + 2;

  if (left < heapSize && items[left] > items[largest]) {
    largest = left;
  }

  if (right < heapSize && items[right] > items[largest]) {
    largest = right;
  }

  if (largest !== root) {
    [items[root], items[largest]] = [items[largest], items[root]];
    heapify(items, heapSize, largest);
  }
}

export function* heapSortSteps(arr: number[]): Generator<SortStep> {
  const items = [...arr];
  const n = items.length;
  const sorted: number[] = [];

  yield {
    array: [...items],
    action: "compare",
    message: "Начальное состояние массива",
  };

  if (n <= 1) {
    yield {
      array: [...items],
      action: "done",
      sorted: items.map((_, index) => index),
      message: "Массив уже отсортирован",
    };
    return;
  }

  yield {
    array: [...items],
    action: "select",
    message: "Строим max-heap",
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapifySteps(items, n, i, sorted);
  }

  for (let end = n - 1; end > 0; end--) {
    yield {
      array: [...items],
      action: "swap",
      swapping: [0, end],
      sorted: [...sorted],
      message: `Максимум ${items[0]} → в конец (swap 0 ↔ ${end})`,
    };

    [items[0], items[end]] = [items[end], items[0]];

    yield {
      array: [...items],
      action: "swap",
      swapping: [0, end],
      sorted: [...sorted],
      message: `Элемент ${items[end]} зафиксирован на позиции ${end}`,
    };

    sorted.push(end);
    yield* heapifySteps(items, end, 0, sorted);
  }

  sorted.push(0);

  yield {
    array: [...items],
    action: "done",
    sorted: items.map((_, index) => index),
    message: "Массив отсортирован",
  };
}

function* heapifySteps(
  items: number[],
  heapSize: number,
  root: number,
  sorted: number[],
): Generator<SortStep> {
  let largest = root;
  const left = 2 * root + 1;
  const right = 2 * root + 2;

  if (left < heapSize) {
    yield {
      array: [...items],
      action: "compare",
      comparing: [left, largest],
      sorted: [...sorted],
      message: `Сравниваем левого потомка ${items[left]} с ${items[largest]}`,
    };

    if (items[left] > items[largest]) {
      largest = left;
    }
  }

  if (right < heapSize) {
    yield {
      array: [...items],
      action: "compare",
      comparing: [right, largest],
      sorted: [...sorted],
      message: `Сравниваем правого потомка ${items[right]} с ${items[largest]}`,
    };

    if (items[right] > items[largest]) {
      largest = right;
    }
  }

  if (largest !== root) {
    yield {
      array: [...items],
      action: "swap",
      swapping: [root, largest],
      sorted: [...sorted],
      message: `Просеивание: swap ${root} ↔ ${largest}`,
    };

    [items[root], items[largest]] = [items[largest], items[root]];
    yield* heapifySteps(items, heapSize, largest, sorted);
  }
}
