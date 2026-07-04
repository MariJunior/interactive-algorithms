import type { SortStep } from "@/algorithms/types";

export function selectionSort(arr: number[]): number[] {
  const items = [...arr];

  for (let i = 0; i < items.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < items.length; j++) {
      if (items[j] < items[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [items[i], items[minIndex]] = [items[minIndex], items[i]];
    }
  }

  return items;
}

export function* selectionSortSteps(arr: number[]): Generator<SortStep> {
  const items = [...arr];
  const sorted: number[] = [];

  yield {
    array: [...items],
    action: "select",
    sorted: [...sorted],
    message: "Начальное состояние массива",
  };

  for (let i = 0; i < items.length; i++) {
    let minIndex = i;

    yield {
      array: [...items],
      action: "select",
      comparing: [i, minIndex],
      sorted: [...sorted],
      message: `Ищем минимум в диапазоне [${i}..${items.length - 1}]`,
    };

    for (let j = i + 1; j < items.length; j++) {
      yield {
        array: [...items],
        action: "compare",
        comparing: [j, minIndex],
        sorted: [...sorted],
        message: `Сравниваем items[${j}]=${items[j]} с текущим минимумом items[${minIndex}]=${items[minIndex]}`,
      };

      if (items[j] < items[minIndex]) {
        minIndex = j;

        yield {
          array: [...items],
          action: "select",
          comparing: [j, minIndex],
          sorted: [...sorted],
          message: `Новый минимум: ${items[minIndex]} на позиции ${minIndex}`,
        };
      }
    }

    if (minIndex !== i) {
      const from = items[i];
      const to = items[minIndex];
      [items[i], items[minIndex]] = [items[minIndex], items[i]];

      yield {
        array: [...items],
        action: "swap",
        swapping: [i, minIndex],
        sorted: [...sorted],
        message: `Ставим минимум ${to} на позицию ${i} (меняем с ${from})`,
      };
    }

    sorted.push(i);
  }

  yield {
    array: [...items],
    action: "done",
    sorted: items.map((_, index) => index),
    message: "Массив отсортирован",
  };
}
