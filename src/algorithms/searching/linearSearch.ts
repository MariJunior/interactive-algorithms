import type { SearchStep } from "@/algorithms/types";

/** Чистая функция линейного поиска — индекс или -1 */
export function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

/** Генератор шагов для визуализации — не мутирует исходный массив */
export function* linearSearchSteps(
  arr: number[],
  target: number,
): Generator<SearchStep> {
  const items = [...arr];

  yield {
    array: [...items],
    target,
    action: "compare",
    message: `Ищем значение ${target} линейным проходом слева направо`,
  };

  for (let i = 0; i < items.length; i++) {
    yield {
      array: [...items],
      target,
      action: "compare",
      checking: i,
      // Уже просмотренные слева считаем «отсеянными»
      eliminated: Array.from({ length: i }, (_, index) => index),
      message: `Сравниваем a[${i}] = ${items[i]} с целью ${target}`,
    };

    if (items[i] === target) {
      yield {
        array: [...items],
        target,
        action: "found",
        checking: i,
        foundIndex: i,
        eliminated: Array.from({ length: i }, (_, index) => index),
        message: `Нашли ${target} на позиции ${i}`,
      };

      yield {
        array: [...items],
        target,
        action: "done",
        foundIndex: i,
        message: `Готово: индекс ${i}`,
      };
      return;
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
