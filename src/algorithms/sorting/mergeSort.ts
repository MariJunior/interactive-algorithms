import type { SortStep } from "@/algorithms/types";

/** Чистая функция — divide & conquer без побочных эффектов */
export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr];

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    // <= сохраняет стабильность при равных ключах
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i += 1;
    } else {
      result.push(right[j]);
      j += 1;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i += 1;
  }

  while (j < right.length) {
    result.push(right[j]);
    j += 1;
  }

  return result;
}

/**
 * Генератор шагов: рекурсивно делим диапазон [lo, hi), затем сливаем в рабочий массив.
 * Не мутирует исходный input.
 */
export function* mergeSortSteps(arr: number[]): Generator<SortStep> {
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

  yield* mergeSortRange(items, 0, items.length);

  yield {
    array: [...items],
    action: "done",
    sorted: items.map((_, index) => index),
    message: "Массив отсортирован",
  };
}

/** Рекурсивная сортировка полуинтервала [lo, hi) */
function* mergeSortRange(
  items: number[],
  lo: number,
  hi: number,
): Generator<SortStep> {
  if (hi - lo <= 1) return;

  const mid = Math.floor((lo + hi) / 2);

  yield {
    array: [...items],
    action: "merge",
    comparing: [lo, hi - 1],
    message: `Делим диапазон [${lo}, ${hi}) по индексу ${mid}`,
  };

  yield* mergeSortRange(items, lo, mid);
  yield* mergeSortRange(items, mid, hi);
  yield* mergeRange(items, lo, mid, hi);
}

/** Слияние двух отсортированных половин обратно в items[lo..hi) */
function* mergeRange(
  items: number[],
  lo: number,
  mid: number,
  hi: number,
): Generator<SortStep> {
  const leftPart = items.slice(lo, mid);
  const rightPart = items.slice(mid, hi);
  let i = 0;
  let j = 0;
  let writeAt = lo;

  yield {
    array: [...items],
    action: "merge",
    comparing: [lo, hi - 1],
    message: `Сливаем [${lo}, ${mid}) и [${mid}, ${hi})`,
  };

  while (i < leftPart.length && j < rightPart.length) {
    // После начала записи индексы в items уже «битые» — подсвечиваем только цель записи
    yield {
      array: [...items],
      action: "compare",
      comparing: [writeAt, writeAt],
      message: `Сравниваем ${leftPart[i]} и ${rightPart[j]} (пишем в ${writeAt})`,
    };

    if (leftPart[i] <= rightPart[j]) {
      items[writeAt] = leftPart[i];
      i += 1;
    } else {
      items[writeAt] = rightPart[j];
      j += 1;
    }

    yield {
      array: [...items],
      action: "merge",
      comparing: [writeAt, writeAt],
      message: `Пишем ${items[writeAt]} на позицию ${writeAt}`,
    };

    writeAt += 1;
  }

  while (i < leftPart.length) {
    items[writeAt] = leftPart[i];
    yield {
      array: [...items],
      action: "merge",
      comparing: [writeAt, writeAt],
      message: `Дописываем остаток слева: ${items[writeAt]}`,
    };
    i += 1;
    writeAt += 1;
  }

  while (j < rightPart.length) {
    items[writeAt] = rightPart[j];
    yield {
      array: [...items],
      action: "merge",
      comparing: [writeAt, writeAt],
      message: `Дописываем остаток справа: ${items[writeAt]}`,
    };
    j += 1;
    writeAt += 1;
  }
}
