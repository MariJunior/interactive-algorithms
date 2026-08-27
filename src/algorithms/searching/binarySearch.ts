import type { SearchStep } from "@/algorithms/types";

/**
 * Чистая функция бинарного поиска.
 * Предусловие: массив отсортирован по возрастанию.
 */
export function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }

  return -1;
}

/** Индексы вне [low, high] — для затемнения на визуализаторе */
function eliminatedOutside(length: number, low: number, high: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < length; i++) {
    if (i < low || i > high) out.push(i);
  }
  return out;
}

/** Генератор шагов — не мутирует исходный массив; ожидает отсортированный input */
export function* binarySearchSteps(
  arr: number[],
  target: number,
): Generator<SearchStep> {
  const items = [...arr];

  yield {
    array: [...items],
    target,
    action: "compare",
    low: 0,
    high: items.length - 1,
    message: `Ищем ${target} в отсортированном массиве (бинарный поиск)`,
  };

  let low = 0;
  let high = items.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    yield {
      array: [...items],
      target,
      action: "compare",
      checking: mid,
      low,
      high,
      eliminated: eliminatedOutside(items.length, low, high),
      message: `Середина mid=${mid}: a[${mid}]=${items[mid]} ? ${target}`,
    };

    if (items[mid] === target) {
      yield {
        array: [...items],
        target,
        action: "found",
        checking: mid,
        foundIndex: mid,
        low,
        high,
        eliminated: eliminatedOutside(items.length, low, high),
        message: `Нашли ${target} на позиции ${mid}`,
      };

      yield {
        array: [...items],
        target,
        action: "done",
        foundIndex: mid,
        low: mid,
        high: mid,
        message: `Готово: индекс ${mid}`,
      };
      return;
    }

    if (items[mid] < target) {
      // Цель справа — отсекаем левую половину вместе с mid
      low = mid + 1;
      yield {
        array: [...items],
        target,
        action: "compare",
        low,
        high,
        eliminated: eliminatedOutside(items.length, low, high),
        message: `${items[mid]} < ${target} → ищем справа [${low}…${high}]`,
      };
    } else {
      high = mid - 1;
      yield {
        array: [...items],
        target,
        action: "compare",
        low,
        high,
        eliminated: eliminatedOutside(items.length, low, high),
        message: `${items[mid]} > ${target} → ищем слева [${low}…${high}]`,
      };
    }
  }

  yield {
    array: [...items],
    target,
    action: "done",
    eliminated: items.map((_, index) => index),
    message: `Значение ${target} в массиве не найдено (−1)`,
  };
}
