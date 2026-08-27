import type { StringStep } from "@/algorithms/types";

/** Чистый наивный поиск: индексы начал всех вхождений */
export function naiveSearch(text: string, pattern: string): number[] {
  const found: number[] = [];
  if (pattern.length === 0 || pattern.length > text.length) return found;

  for (let i = 0; i <= text.length - pattern.length; i++) {
    let j = 0;
    while (j < pattern.length && text[i + j] === pattern[j]) j++;
    if (j === pattern.length) found.push(i);
  }
  return found;
}

/** Генератор шагов наивного поиска подстроки */
export function* naiveSearchSteps(
  text: string,
  pattern: string,
): Generator<StringStep> {
  const foundStarts: number[] = [];

  yield {
    text,
    pattern,
    action: "shift",
    windowStart: 0,
    foundStarts: [],
    message: `Задача: найти все вхождения «${pattern}» в тексте (наивный перебор окон)`,
  };

  if (pattern.length === 0 || pattern.length > text.length) {
    yield {
      text,
      pattern,
      action: "done",
      windowStart: 0,
      foundStarts: [],
      message: "Паттерн пуст или длиннее текста — вхождений нет",
    };
    return;
  }

  for (let i = 0; i <= text.length - pattern.length; i++) {
    yield {
      text,
      pattern,
      action: "shift",
      windowStart: i,
      foundStarts: [...foundStarts],
      message: `Окно с позиции ${i}: сравниваем с паттерном`,
    };

    const matched: number[] = [];
    let j = 0;
    let mismatch = false;

    while (j < pattern.length) {
      const ti = i + j;
      yield {
        text,
        pattern,
        action: "compare",
        windowStart: i,
        textIndex: ti,
        patternIndex: j,
        matchedInWindow: [...matched],
        foundStarts: [...foundStarts],
        message: `Сравниваем text[${ti}]='${text[ti]}' и pattern[${j}]='${pattern[j]}'`,
      };

      if (text[ti] !== pattern[j]) {
        mismatch = true;
        yield {
          text,
          pattern,
          action: "shift",
          windowStart: i,
          textIndex: ti,
          patternIndex: j,
          matchedInWindow: [...matched],
          foundStarts: [...foundStarts],
          message: `Несовпадение — сдвигаем окно на 1 (наивно)`,
        };
        break;
      }

      matched.push(ti);
      j++;
    }

    if (!mismatch && j === pattern.length) {
      foundStarts.push(i);
      yield {
        text,
        pattern,
        action: "match",
        windowStart: i,
        matchedInWindow: [...matched],
        foundStarts: [...foundStarts],
        message: `Вхождение с индекса ${i}`,
      };
    }
  }

  yield {
    text,
    pattern,
    action: "done",
    windowStart: Math.max(0, text.length - pattern.length),
    foundStarts: [...foundStarts],
    message:
      foundStarts.length > 0
        ? `Готово: вхождения на [${foundStarts.join(", ")}]`
        : "Готово: вхождений нет",
  };
}
