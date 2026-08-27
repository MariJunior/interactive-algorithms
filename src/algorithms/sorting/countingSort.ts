import type { SortStep } from "@/algorithms/types";

/**
 * Counting Sort для целых чисел (в т.ч. отрицательных — сдвиг на min).
 * Стабильная реализация через префиксные суммы.
 */
export function countingSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr];

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min + 1;
  const counts = new Array<number>(range).fill(0);

  for (const value of arr) {
    counts[value - min] += 1;
  }

  for (let i = 1; i < counts.length; i++) {
    counts[i] += counts[i - 1];
  }

  const result = new Array<number>(arr.length);

  // Справа налево — сохраняем стабильность
  for (let i = arr.length - 1; i >= 0; i--) {
    const value = arr[i];
    const bucket = value - min;
    counts[bucket] -= 1;
    result[counts[bucket]] = value;
  }

  return result;
}

export function* countingSortSteps(arr: number[]): Generator<SortStep> {
  const source = [...arr];

  yield {
    array: [...source],
    action: "compare",
    message: "Начальное состояние массива",
  };

  if (source.length <= 1) {
    yield {
      array: [...source],
      action: "done",
      sorted: source.map((_, index) => index),
      message: "Массив уже отсортирован",
    };
    return;
  }

  const min = Math.min(...source);
  const max = Math.max(...source);
  const range = max - min + 1;
  const counts = new Array<number>(range).fill(0);

  yield {
    array: [...source],
    action: "select",
    message: `Диапазон значений: [${min}..${max}], счётчиков: ${range}`,
  };

  for (let i = 0; i < source.length; i++) {
    counts[source[i] - min] += 1;
    yield {
      array: [...source],
      action: "select",
      comparing: [i, i],
      message: `Считаем ${source[i]} → counts[${source[i] - min}] = ${counts[source[i] - min]}`,
    };
  }

  for (let i = 1; i < counts.length; i++) {
    counts[i] += counts[i - 1];
  }

  yield {
    array: [...source],
    action: "merge",
    message: "Префиксные суммы готовы — собираем результат справа налево",
  };

  const result = new Array<number>(source.length);
  const filled: number[] = [];
  // Пока позиция не заполнена — показываем исходное значение (для плавной анимации)
  const view = [...source];

  for (let i = source.length - 1; i >= 0; i--) {
    const value = source[i];
    const bucket = value - min;
    counts[bucket] -= 1;
    const pos = counts[bucket];
    result[pos] = value;
    view[pos] = value;
    filled.push(pos);

    yield {
      array: [...view],
      action: "insert",
      comparing: [pos, i],
      sorted: [...filled],
      message: `Ставим ${value} на позицию ${pos}`,
    };
  }

  yield {
    array: [...result],
    action: "done",
    sorted: result.map((_, index) => index),
    message: "Массив отсортирован",
  };
}
