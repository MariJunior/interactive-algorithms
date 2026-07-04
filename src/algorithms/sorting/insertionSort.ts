import type { SortStep } from "@/algorithms/types";

export function insertionSort(arr: number[]): number[] {
  const items = [...arr];

  for (let i = 1; i < items.length; i++) {
    const current = items[i];
    let j = i - 1;

    while (j >= 0 && items[j] > current) {
      items[j + 1] = items[j];
      j--;
    }

    items[j + 1] = current;
  }

  return items;
}

export function* insertionSortSteps(arr: number[]): Generator<SortStep> {
  const items = [...arr];
  const sorted: number[] = [0];

  yield {
    array: [...items],
    action: "insert",
    sorted: [...sorted],
    message: "Начальное состояние: первый элемент считаем отсортированным",
  };

  for (let i = 1; i < items.length; i++) {
    const current = items[i];
    let j = i - 1;

    yield {
      array: [...items],
      action: "insert",
      comparing: [i, j],
      sorted: [...sorted],
      message: `Вставляем элемент ${current} в отсортированную часть`,
    };

    while (j >= 0 && items[j] > current) {
      items[j + 1] = items[j];

      yield {
        array: [...items],
        action: "insert",
        comparing: [j, j + 1],
        sorted: [...sorted],
        message: `Сдвигаем ${items[j + 1]} вправо`,
      };

      j--;
    }

    items[j + 1] = current;

    yield {
      array: [...items],
      action: "insert",
      comparing: [j + 1, j + 1],
      sorted: [...sorted],
      message: `Вставили ${current} на позицию ${j + 1}`,
    };

    if (!sorted.includes(i)) {
      sorted.push(i);
    }
  }

  yield {
    array: [...items],
    action: "done",
    sorted: items.map((_, index) => index),
    message: "Массив отсортирован",
  };
}
