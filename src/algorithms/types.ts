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

/** Действия шага поиска (отдельно от сортировки — другая семантика) */
export type SearchStepAction =
  | "compare" // проверяем элемент / mid
  | "found" // цель найдена
  | "done"; // поиск завершён (в т.ч. «не найдено»)

/** Один шаг линейного / бинарного поиска */
export interface SearchStep<T = number> {
  array: T[];
  target: T;
  action: SearchStepAction;
  /** Индекс, который сейчас сравниваем с target */
  checking?: number;
  /** Бинарный поиск: левая граница включительно */
  low?: number;
  /** Бинарный поиск: правая граница включительно */
  high?: number;
  /** Индекс найденного элемента (если есть) */
  foundIndex?: number;
  /** Индексы вне текущего окна поиска (для затемнения) */
  eliminated?: number[];
  message?: string;
}

/** Вершина графа с координатами для 2D-раскладки */
export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

/** Небольшой учебный граф (список смежности строится из edges) */
export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** false = неориентированный (ребро в обе стороны) */
  directed?: boolean;
}

export type GraphStepAction =
  | "explore" // смотрим ребро / кладём в frontier
  | "visit" // посещаем вершину
  | "done";

/** Один шаг обхода графа (BFS / DFS) */
export interface GraphStep {
  graph: Graph;
  action: GraphStepAction;
  /** Вершина в фокусе */
  current?: string;
  /** Очередь (BFS) или стек (DFS) */
  frontier: string[];
  visited: string[];
  /** Порядок посещения на текущий момент */
  visitOrder: string[];
  /** Ребро, которое сейчас рассматриваем */
  exploringEdge?: [string, string];
  message?: string;
}

/** Узел бинарного дерева с координатами для SVG */
export interface TreeNodeLayout {
  id: string;
  label: string;
  x: number;
  y: number;
  leftId?: string;
  rightId?: string;
}

export interface BinaryTree {
  rootId: string;
  nodes: TreeNodeLayout[];
}

export type TreeStepAction =
  | "descend" // спускаемся к ребёнку / смотрим узел
  | "visit" // записываем узел в порядок обхода
  | "done";

/** Один шаг обхода бинарного дерева */
export interface TreeStep {
  tree: BinaryTree;
  action: TreeStepAction;
  current?: string;
  /** Стек вызовов / путь от корня (для наглядности) */
  callStack: string[];
  visitOrder: string[];
  /** Ребро parent→child, по которому спускаемся */
  exploringEdge?: [string, string];
  message?: string;
}

/** Шаг заполнения DP-таблицы (1D) */
export type DpStepAction =
  | "init" // задаём базу
  | "compute" // считаем очередную ячейку
  | "done";

export interface DpStep {
  /** Ячейки dp[0..n]; null — ещё не заполнена */
  table: Array<number | null>;
  action: DpStepAction;
  n: number;
  /** Индекс, который заполняем */
  focusIndex?: number;
  /** Индексы, из которых читаем (подсветка зависимостей) */
  reading?: number[];
  /** Человекочитаемая формула текущего шага */
  formula?: string;
  /** Итоговый ответ (когда done) */
  result?: number;
  message?: string;
}

/** Шаг поиска подстроки */
export type StringStepAction =
  | "compare" // сравниваем символы
  | "match" // нашли вхождение
  | "shift" // сдвигаем окно / паттерн
  | "done";

export interface StringStep {
  text: string;
  pattern: string;
  action: StringStepAction;
  /** Сдвиг паттерна относительно текста (индекс начала окна) */
  windowStart: number;
  /** Индекс в тексте, который сравниваем */
  textIndex?: number;
  /** Индекс в паттерне, который сравниваем */
  patternIndex?: number;
  /** Совпавшие позиции в текущем окне (индексы текста) */
  matchedInWindow?: number[];
  /** Старты найденных вхождений */
  foundStarts: number[];
  /** LPS для KMP (если есть) */
  lps?: number[];
  message?: string;
}

/** Жадный шаг — общая оболочка для activity / knapsack */
export type GreedyStepAction =
  | "sort" // упорядочили кандидатов
  | "consider" // смотрим кандидата
  | "take" // берём
  | "skip" // пропускаем
  | "done";

export interface ActivityItem {
  id: string;
  label: string;
  start: number;
  finish: number;
}

export interface KnapsackItem {
  id: string;
  label: string;
  weight: number;
  value: number;
}

export interface ActivityGreedyStep {
  kind: "activity";
  action: GreedyStepAction;
  activities: ActivityItem[];
  /** Порядок после сортировки по finish */
  orderIds: string[];
  selectedIds: string[];
  consideringId?: string;
  /** Время окончания последней выбранной */
  lastFinish: number;
  message?: string;
  formula?: string;
}

export interface KnapsackGreedyStep {
  kind: "knapsack";
  action: GreedyStepAction;
  items: KnapsackItem[];
  /** Порядок по value/weight убыв. */
  orderIds: string[];
  capacity: number;
  remaining: number;
  totalValue: number;
  /** Доля взятого предмета 0..1 */
  takenFraction: Record<string, number>;
  consideringId?: string;
  message?: string;
  formula?: string;
}

export type GreedyStep = ActivityGreedyStep | KnapsackGreedyStep;

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
