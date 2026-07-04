import type { SortStep } from "@/algorithms/types";

/** Чистая функция сортировки — для тестов и проверки корректности шагов */
export function bubbleSort(arr: number[]): number[] {
  const items = [...arr];

  for (let i = 0; i < items.length; i++) {
    let swapped = false;

    for (let j = 0; j < items.length - 1 - i; j++) {
      if (items[j] > items[j + 1]) {
        [items[j], items[j + 1]] = [items[j + 1], items[j]];
        swapped = true;
      }
    }

    if (!swapped) break;
  }

  return items;
}

/** Генератор шагов для визуализации — не мутирует исходный массив */
export function* bubbleSortSteps(arr: number[]): Generator<SortStep> {
  const items = [...arr];
  const sorted: number[] = [];

  yield {
    array: [...items],
    action: "compare",
    sorted: [...sorted],
    message: "Начальное состояние массива",
  };

  for (let i = 0; i < items.length; i++) {
    let swapped = false;

    for (let j = 0; j < items.length - 1 - i; j++) {
      yield {
        array: [...items],
        action: "compare",
        comparing: [j, j + 1],
        sorted: [...sorted],
        message: `Сравниваем элементы на позициях ${j} и ${j + 1}`,
      };

      if (items[j] > items[j + 1]) {
        const left = items[j];
        const right = items[j + 1];
        [items[j], items[j + 1]] = [items[j + 1], items[j]];
        swapped = true;

        yield {
          array: [...items],
          action: "swap",
          swapping: [j, j + 1],
          sorted: [...sorted],
          message: `Меняем местами: ${left} и ${right}`,
        };
      }
    }

    const sortedIndex = items.length - 1 - i;
    if (!sorted.includes(sortedIndex)) {
      sorted.push(sortedIndex);
    }

    if (!swapped) {
      for (let k = 0; k < items.length; k++) {
        if (!sorted.includes(k)) sorted.push(k);
      }
      break;
    }
  }

  yield {
    array: [...items],
    action: "done",
    sorted: items.map((_, index) => index),
    message: "Массив отсортирован",
  };
}
