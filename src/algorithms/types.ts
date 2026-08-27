// Действия, которые может совершить алгоритм за один шаг
export type StepAction =
  | "compare" // сравниваем два элемента
  | "swap" // меняем местами
  | "select" // выбираем элемент (Selection Sort и т.д.)
  | "insert" // вставляем элемент
  | "pivot" // отмечаем pivot (Quick Sort)
  | "merge" // сливаем (Merge Sort)
  | "done"; // алгоритм завершён

// Один шаг сортировки
export interface SortStep<T = number> {
  array: T[];
  action: StepAction;
  comparing?: [number, number]; // индексы сравниваемых элементов
  swapping?: [number, number]; // индексы переставляемых элементов
  sorted?: number[]; // индексы уже отсортированных элементов
  pivot?: number; // индекс pivot-элемента
  message?: string; // человекочитаемое описание шага
}

// Метаданные сложности
export interface Complexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

// Категории алгоритмов
export type AlgorithmCategory =
  | "sorting"
  | "searching"
  | "tree"
  | "graph"
  | "dynamic-programming"
  | "greedy"
  | "string";

// Метаданные алгоритма (для карточек и страниц)
export interface AlgorithmMeta {
  slug: string;
  name: string; // английское название (Bubble Sort)
  nameRu: string; // русское название (Пузырьковая сортировка)
  category: AlgorithmCategory;
  complexity: Complexity;
  shortDescription: string; // для карточки на /learn
  /** Пошаговое объяснение «Как работает» — опционально, пока не у всех алгоритмов */
  howItWorks?: string[];
  when: {
    use: string[]; // когда применять
    avoid: string[]; // когда не применять
  };
  stable?: boolean; // стабильная ли сортировка (для сортировок)
  inPlace?: boolean; // сортировка на месте?
}
