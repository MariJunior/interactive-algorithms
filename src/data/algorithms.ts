import type { AlgorithmMeta } from "@/algorithms/types";

export const ALGORITHMS: AlgorithmMeta[] = [
  // ─── СОРТИРОВКИ ───────────────────────────────────────────
  {
    slug: "bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
    shortDescription:
      "Простейшая сортировка — соседние элементы меняются местами, пока массив не отсортирован.",
    when: {
      use: [
        "Учебные цели — идеален для понимания принципа сортировки",
        "Почти отсортированные массивы (best case O(n))",
        "Очень маленькие массивы, где простота важнее скорости",
      ],
      avoid: ["Любые реальные задачи с n > 1000", "Производительный код"],
    },
    stable: true,
    inPlace: true,
  },
  {
    slug: "selection-sort",
    name: "Selection Sort",
    category: "sorting",
    complexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
    shortDescription:
      "На каждом шаге находит минимальный элемент в оставшейся части и ставит его на нужное место.",
    when: {
      use: [
        "Когда запись в память дорогостоящая — минимум перестановок (O(n) свапов)",
        "Маленькие массивы",
        "Учебные цели",
      ],
      avoid: ["Большие массивы", "Когда нужна стабильная сортировка"],
    },
    stable: false,
    inPlace: true,
  },
  {
    slug: "insertion-sort",
    name: "Insertion Sort",
    category: "sorting",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
    shortDescription:
      "Строит отсортированный массив по одному элементу, вставляя каждый новый на правильную позицию.",
    when: {
      use: [
        "Почти отсортированные данные — работает близко к O(n)",
        "Маленькие массивы (< 20 элементов) — на практике быстрее Quick Sort",
        "Online-сортировка: данные приходят по одному",
        "Используется внутри TimSort и Intro Sort как финальный шаг",
      ],
      avoid: ["Большие случайные массивы"],
    },
    stable: true,
    inPlace: true,
  },
  {
    slug: "merge-sort",
    name: "Merge Sort",
    category: "sorting",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
    },
    shortDescription: "Делит массив пополам, рекурсивно сортирует части, затем сливает их вместе.",
    when: {
      use: [
        "Нужна гарантированная O(n log n) в любом случае",
        "Нужна стабильная сортировка",
        "Сортировка связных списков",
        "Внешняя сортировка (данные не влезают в память)",
      ],
      avoid: [
        "Ограниченная память — требует O(n) доп. пространства",
        "Маленькие массивы — накладные расходы на рекурсию",
      ],
    },
    stable: true,
    inPlace: false,
  },
  {
    slug: "quick-sort",
    name: "Quick Sort",
    category: "sorting",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)",
    },
    shortDescription:
      "Выбирает опорный элемент (pivot) и делит массив на элементы меньше и больше него, рекурсивно сортируя части.",
    when: {
      use: [
        "Общий случай — на практике быстрее Merge Sort из-за cache locality",
        "Сортировка на месте важна (O(log n) space)",
        "Большие массивы случайных данных",
      ],
      avoid: [
        "Нужна стабильная сортировка",
        "Почти отсортированные данные без рандомизации pivot (деградирует до O(n²))",
        "Гарантированное время выполнения критично",
      ],
    },
    stable: false,
    inPlace: true,
  },
  {
    slug: "heap-sort",
    name: "Heap Sort",
    category: "sorting",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(1)",
    },
    shortDescription:
      "Превращает массив в кучу (heap), затем последовательно извлекает максимальный элемент.",
    when: {
      use: [
        "Нужна O(n log n) worst case при O(1) памяти",
        "Системы с жёсткими требованиями по памяти",
        "Частичная сортировка — найти k наибольших элементов",
      ],
      avoid: [
        "Нужна стабильная сортировка",
        "На практике медленнее Quick Sort из-за плохой cache locality",
      ],
    },
    stable: false,
    inPlace: true,
  },
  {
    slug: "radix-sort",
    name: "Radix Sort",
    category: "sorting",
    complexity: {
      best: "O(nk)",
      average: "O(nk)",
      worst: "O(nk)",
      space: "O(n + k)",
    },
    shortDescription:
      "Сортирует по цифрам (или символам) — сначала по младшему разряду, затем по старшему.",
    when: {
      use: [
        "Целые числа или строки фиксированной длины",
        "Когда k (длина числа/строки) мало — быстрее O(n log n)",
        "Большие массивы однотипных данных: IP-адреса, даты, номера",
      ],
      avoid: [
        "Числа с плавающей точкой",
        "Данные переменной длины с большим k",
        "Когда важна простота реализации",
      ],
    },
    stable: true,
    inPlace: false,
  },
  {
    slug: "counting-sort",
    name: "Counting Sort",
    category: "sorting",
    complexity: {
      best: "O(n + k)",
      average: "O(n + k)",
      worst: "O(n + k)",
      space: "O(k)",
    },
    shortDescription:
      "Считает количество каждого значения, затем восстанавливает отсортированный массив по счётчикам.",
    when: {
      use: [
        "Целые числа в известном небольшом диапазоне k",
        "Сортировка оценок, возрастов, символов ASCII",
        "Используется внутри Radix Sort",
      ],
      avoid: [
        "Большой диапазон значений — O(k) памяти становится проблемой",
        "Числа с плавающей точкой или строки",
        "Когда диапазон значений неизвестен",
      ],
    },
    stable: true,
    inPlace: false,
  },

  // ─── ПОИСК ────────────────────────────────────────────────
  {
    slug: "linear-search",
    name: "Linear Search",
    category: "searching",
    complexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
    },
    shortDescription: "Перебирает элементы один за другим, пока не найдёт нужный.",
    when: {
      use: [
        "Несортированные данные",
        "Маленькие массивы",
        "Поиск один раз — не стоит сортировать ради одного запроса",
        "Связные списки — нет произвольного доступа",
      ],
      avoid: [
        "Большие отсортированные массивы — используй Binary Search",
        "Частые запросы по одним данным",
      ],
    },
  },
  {
    slug: "binary-search",
    name: "Binary Search",
    category: "searching",
    complexity: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1)",
    },
    shortDescription: "На каждом шаге делит отсортированный массив пополам, сужая область поиска.",
    when: {
      use: [
        "Отсортированный массив",
        "Частые запросы — O(log n) каждый раз",
        "Поиск границы: первый элемент >= X",
      ],
      avoid: [
        "Несортированные данные",
        "Связные списки — нет O(1) доступа по индексу",
        "Часто меняющиеся данные — нужна поддержка сортировки",
      ],
    },
  },
];

// Хелперы для удобного доступа
export const getAlgorithmBySlug = (slug: string): AlgorithmMeta | undefined =>
  ALGORITHMS.find((algorithm) => algorithm.slug === slug);

export const getAlgorithmsByCategory = (category: string): AlgorithmMeta[] =>
  ALGORITHMS.filter((algorithm) => algorithm.category === category);

export const CATEGORIES = [
  { id: "sorting", label: "Сортировки" },
  { id: "searching", label: "Поиск" },
  { id: "tree", label: "Деревья" },
  { id: "graph", label: "Графы" },
  { id: "dynamic-programming", label: "Динамическое программирование" },
  { id: "greedy", label: "Жадные алгоритмы" },
  { id: "string", label: "Строки" },
] as const;
