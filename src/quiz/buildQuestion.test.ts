import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "@/data/algorithms";
import {
  buildNextQuizQuestion,
  buildQuizQuestion,
  checkAnswer,
  collectAverageNotations,
  type QuizAlgorithm,
  type Rng,
} from "./index";

/** Детерминированный rng: выдаёт значения из очереди, потом 0 */
function queueRng(values: number[]): Rng {
  const queue = [...values];
  return () => (queue.length > 0 ? queue.shift()! : 0);
}

const fixture: QuizAlgorithm[] = [
  {
    slug: "alpha",
    name: "Alpha",
    nameRu: "Альфа",
    shortDescription: "Тест A",
    complexity: { best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)" },
  },
  {
    slug: "beta",
    name: "Beta",
    nameRu: "Бета",
    shortDescription: "Тест B",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
  },
  {
    slug: "gamma",
    name: "Gamma",
    nameRu: "Гамма",
    shortDescription: "Тест C",
    complexity: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(n)",
      space: "O(1)",
    },
  },
  {
    slug: "delta",
    name: "Delta",
    nameRu: "Дельта",
    shortDescription: "Тест D",
    complexity: {
      best: "O(n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(n)",
    },
  },
];

describe("collectAverageNotations", () => {
  it("собирает уникальные average из каталога", () => {
    const set = new Set(collectAverageNotations(ALGORITHMS));
    expect(set.size).toBeGreaterThanOrEqual(4);
    expect(set.has("O(n²)")).toBe(true);
    expect(set.has("O(n log n)")).toBe(true);
  });
});

describe("buildQuizQuestion", () => {
  it("бросает на пустом списке", () => {
    expect(() => buildQuizQuestion([])).toThrow(/empty/);
  });

  it("даёт ровно 4 уникальных варианта и один правильный", () => {
    // 0 → берём alpha; дальше shuffle/distractors предсказуемы нулями
    const q = buildQuizQuestion(fixture, queueRng([0, 0, 0, 0, 0, 0, 0, 0]));
    expect(q.slug).toBe("alpha");
    expect(q.correctNotation).toBe("O(n)");
    expect(q.choices).toHaveLength(4);
    const notations = q.choices.map((c) => c.notation);
    expect(new Set(notations).size).toBe(4);
    expect(notations).toContain("O(n)");
    // В вопросе нет сырого complexity-объекта — только нужные поля
    expect(q).not.toHaveProperty("complexity");
    expect(q.nameRu).toBe("Альфа");
    expect(q.shortDescription).toBe("Тест A");
  });

  it("работает на полном каталоге ALGORITHMS", () => {
    const q = buildQuizQuestion(ALGORITHMS, queueRng([0.5, 0.1, 0.2, 0.3, 0.4]));
    expect(q.choices).toHaveLength(4);
    expect(q.choices.some((c) => c.notation === q.correctNotation)).toBe(true);
    const meta = ALGORITHMS.find((a) => a.slug === q.slug);
    expect(meta?.complexity.average).toBe(q.correctNotation);
  });

  it("добирает fallback-дистракторы при узком пуле", () => {
    const tiny: QuizAlgorithm[] = [
      {
        slug: "only",
        name: "Only",
        nameRu: "Единственный",
        shortDescription: "один average во всём пуле",
        complexity: {
          best: "O(1)",
          average: "O(42)",
          worst: "O(1)",
          space: "O(1)",
        },
      },
    ];
    const q = buildQuizQuestion(tiny, queueRng([0, 0, 0, 0, 0, 0, 0]));
    expect(q.choices).toHaveLength(4);
    expect(q.choices.map((c) => c.notation)).toContain("O(42)");
    expect(new Set(q.choices.map((c) => c.notation)).size).toBe(4);
  });
});

describe("buildNextQuizQuestion", () => {
  it("избегает того же slug подряд, если есть альтернативы", () => {
    // Первый pickIndex по others (без alpha): 0 → beta
    const q = buildNextQuizQuestion(fixture, "alpha", queueRng([0, 0, 0, 0, 0, 0]));
    expect(q.slug).not.toBe("alpha");
  });
});

describe("checkAnswer", () => {
  const question = buildQuizQuestion(fixture, queueRng([0, 0, 0, 0, 0, 0, 0]));

  it("верно при совпадении нотации", () => {
    const result = checkAnswer(question, question.correctNotation);
    expect(result.correct).toBe(true);
    expect(result.correctNotation).toBe(question.correctNotation);
  });

  it("неверно при другой нотации", () => {
    const wrong =
      question.choices.find((c) => c.notation !== question.correctNotation)
        ?.notation ?? "O(??)";
    const result = checkAnswer(question, wrong);
    expect(result.correct).toBe(false);
    expect(result.chosenNotation).toBe(wrong);
  });

  it("игнорирует пробелы по краям", () => {
    expect(checkAnswer(question, `  ${question.correctNotation}  `).correct).toBe(
      true,
    );
  });
});
