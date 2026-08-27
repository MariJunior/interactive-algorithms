import type { SortStep } from "@/algorithms/types";

/**
 * LSD Radix Sort по основанию 10 для неотрицательных целых.
 * Отрицательные не поддерживаем в визуализаторе (createRandomArray даёт ≥ 0).
 */
export function radixSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr];

  if (arr.some((value) => value < 0 || !Number.isInteger(value))) {
    throw new Error("radixSort поддерживает только неотрицательные целые числа");
  }

  const items = [...arr];
  const max = Math.max(...items);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(items, exp);
  }

  return items;
}

/** Стабильная сортировка по цифре (exp = 1, 10, 100, ...) */
function countingSortByDigit(items: number[], exp: number): void {
  const n = items.length;
  const output = new Array<number>(n);
  const counts = new Array<number>(10).fill(0);

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(items[i] / exp) % 10;
    counts[digit] += 1;
  }

  for (let i = 1; i < 10; i++) {
    counts[i] += counts[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(items[i] / exp) % 10;
    counts[digit] -= 1;
    output[counts[digit]] = items[i];
  }

  for (let i = 0; i < n; i++) {
    items[i] = output[i];
  }
}

export function* radixSortSteps(arr: number[]): Generator<SortStep> {
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

  if (items.some((value) => value < 0 || !Number.isInteger(value))) {
    yield {
      array: [...items],
      action: "done",
      message: "Radix Sort в демо работает только с неотрицательными целыми",
    };
    return;
  }

  const max = Math.max(...items);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const place = exp === 1 ? "единицы" : exp === 10 ? "десятки" : `разряд ${exp}`;

    yield {
      array: [...items],
      action: "select",
      message: `Сортируем по разряду: ${place}`,
    };

    yield* countingSortByDigitSteps(items, exp);
  }

  yield {
    array: [...items],
    action: "done",
    sorted: items.map((_, index) => index),
    message: "Массив отсортирован",
  };
}

function* countingSortByDigitSteps(
  items: number[],
  exp: number,
): Generator<SortStep> {
  const n = items.length;
  const output = new Array<number>(n);
  const counts = new Array<number>(10).fill(0);
  const filled: number[] = [];
  const view = [...items];

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(items[i] / exp) % 10;
    counts[digit] += 1;
    yield {
      array: [...items],
      action: "select",
      comparing: [i, i],
      message: `${items[i]} → цифра ${digit} (counts[${digit}] = ${counts[digit]})`,
    };
  }

  for (let i = 1; i < 10; i++) {
    counts[i] += counts[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(items[i] / exp) % 10;
    counts[digit] -= 1;
    const pos = counts[digit];
    output[pos] = items[i];
    view[pos] = items[i];
    filled.push(pos);

    yield {
      array: [...view],
      action: "insert",
      comparing: [pos, i],
      sorted: [...filled],
      message: `Пишем ${items[i]} на позицию ${pos} по цифре ${digit}`,
    };
  }

  for (let i = 0; i < n; i++) {
    items[i] = output[i];
  }

  yield {
    array: [...items],
    action: "merge",
    message: `Разряд ×${exp} обработан`,
  };
}
