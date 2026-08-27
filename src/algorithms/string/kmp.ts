import type { StringStep } from "@/algorithms/types";

/** LPS (longest proper prefix which is also suffix) для KMP */
export function buildLps(pattern: string): number[] {
  const lps = Array.from({ length: pattern.length }, () => 0);
  let len = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }

  return lps;
}

/** Чистый KMP: индексы начал всех вхождений */
export function kmpSearch(text: string, pattern: string): number[] {
  const found: number[] = [];
  if (pattern.length === 0 || pattern.length > text.length) return found;

  const lps = buildLps(pattern);
  let i = 0;
  let j = 0;

  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) {
        found.push(i - j);
        j = lps[j - 1];
      }
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }

  return found;
}

/** Генератор шагов KMP (поиск; LPS считаем заранее и показываем) */
export function* kmpSearchSteps(
  text: string,
  pattern: string,
): Generator<StringStep> {
  const foundStarts: number[] = [];
  const lps = pattern.length > 0 ? buildLps(pattern) : [];

  yield {
    text,
    pattern,
    action: "shift",
    windowStart: 0,
    foundStarts: [],
    lps: [...lps],
    message: `Задача: найти «${pattern}» через KMP. LPS=[${lps.join(", ")}]`,
  };

  if (pattern.length === 0 || pattern.length > text.length) {
    yield {
      text,
      pattern,
      action: "done",
      windowStart: 0,
      foundStarts: [],
      lps: [...lps],
      message: "Паттерн пуст или длиннее текста — вхождений нет",
    };
    return;
  }

  let i = 0;
  let j = 0;

  while (i < text.length) {
    const windowStart = i - j;

    yield {
      text,
      pattern,
      action: "compare",
      windowStart,
      textIndex: i,
      patternIndex: j,
      matchedInWindow:
        j > 0
          ? Array.from({ length: j }, (_, k) => windowStart + k)
          : [],
      foundStarts: [...foundStarts],
      lps: [...lps],
      message: `Сравниваем text[${i}]='${text[i]}' и pattern[${j}]='${pattern[j]}'`,
    };

    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) {
        const start = i - j;
        foundStarts.push(start);
        yield {
          text,
          pattern,
          action: "match",
          windowStart: start,
          matchedInWindow: Array.from({ length: pattern.length }, (_, k) => start + k),
          foundStarts: [...foundStarts],
          lps: [...lps],
          message: `Вхождение с индекса ${start}. j ← LPS[${j - 1}]=${lps[j - 1]}`,
        };
        j = lps[j - 1];
      }
    } else if (j > 0) {
      const nextJ = lps[j - 1];
      yield {
        text,
        pattern,
        action: "shift",
        windowStart: i - j,
        textIndex: i,
        patternIndex: j,
        matchedInWindow: Array.from({ length: j }, (_, k) => i - j + k),
        foundStarts: [...foundStarts],
        lps: [...lps],
        message: `Несовпадение: j ← LPS[${j - 1}]=${nextJ} (умный сдвиг)`,
      };
      j = nextJ;
    } else {
      yield {
        text,
        pattern,
        action: "shift",
        windowStart: i,
        textIndex: i,
        patternIndex: 0,
        foundStarts: [...foundStarts],
        lps: [...lps],
        message: `Несовпадение при j=0 — двигаем i вперёд`,
      };
      i++;
    }
  }

  yield {
    text,
    pattern,
    action: "done",
    windowStart: Math.max(0, text.length - pattern.length),
    foundStarts: [...foundStarts],
    lps: [...lps],
    message:
      foundStarts.length > 0
        ? `Готово: вхождения на [${foundStarts.join(", ")}]`
        : "Готово: вхождений нет",
  };
}
