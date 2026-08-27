import type {
  AlgorithmCategory,
  DpStep,
  GraphStep,
  GreedyStep,
  HashTableStep,
  SearchStep,
  SortStep,
  StringStep,
  TreeStep,
} from "@/algorithms/types";
import { hasDpVisualization } from "@/algorithms/dp";
import { hasGraphVisualization } from "@/algorithms/graph";
import { hasGreedyVisualization } from "@/algorithms/greedy";
import { hasHashTableVisualization } from "@/algorithms/hashtable";
import { hasSearchingVisualization } from "@/algorithms/searching";
import { hasSortingVisualization } from "@/algorithms/sorting";
import { hasStringVisualization } from "@/algorithms/string";
import { hasTreeVisualization } from "@/algorithms/tree";
import ActivitySelectionVisualizer from "@/components/visualizers/ActivitySelectionVisualizer";
import DpTableVisualizer from "@/components/visualizers/DpTableVisualizer";
import FractionalKnapsackVisualizer from "@/components/visualizers/FractionalKnapsackVisualizer";
import GraphVisualizer from "@/components/visualizers/GraphVisualizer";
import HashTableVisualizer from "@/components/visualizers/HashTableVisualizer";
import SearchVisualizer from "@/components/visualizers/SearchVisualizer";
import SortVisualizer from "@/components/visualizers/SortVisualizer";
import StringMatchVisualizer from "@/components/visualizers/StringMatchVisualizer";
import TreeVisualizer from "@/components/visualizers/TreeVisualizer";
import Slider from "@/components/ui/Slider";
import { ALGORITHMS, CATEGORIES, getAlgorithmBySlug } from "@/data/algorithms";
import { formatElapsedMs, type PlayerStats } from "@/hooks/useAlgorithmPlayer";
import { createRandomArray } from "@/utils/createRandomArray";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { buildCompareSummary, finalStatsFromActions } from "./compareSummary";
import styles from "./Sandbox.module.css";
import {
  DEMO_DP_N,
  DEMO_GRAPH_START,
  DEMO_PATTERN,
  DEMO_TEXT,
  createDemoGraph,
  createDemoTree,
  useSandboxLane,
  type SandboxLaneKind,
} from "./useSandboxLane";

const DEFAULT_A = "bubble-sort";
const DEFAULT_B = "quick-sort";

const COMPARABLE = ALGORITHMS.filter(
  (algo) =>
    hasSortingVisualization(algo.slug) ||
    hasSearchingVisualization(algo.slug) ||
    hasGraphVisualization(algo.slug) ||
    hasTreeVisualization(algo.slug) ||
    hasDpVisualization(algo.slug) ||
    hasStringVisualization(algo.slug) ||
    hasGreedyVisualization(algo.slug) ||
    hasHashTableVisualization(algo.slug),
);

const COMPARABLE_SLUGS = new Set(COMPARABLE.map((algo) => algo.slug));

/** Категории, в которых сейчас есть ≥2 сравниваемых алгоритма */
const COMPARABLE_CATEGORIES = CATEGORIES.filter(
  (category) => COMPARABLE.filter((algo) => algo.category === category.id).length >= 1,
);

function resolveSlug(raw: string | null, fallback: string): string {
  if (raw && COMPARABLE_SLUGS.has(raw)) return raw;
  return fallback;
}

/** Первый алгоритм той же категории, отличный от exclude (если есть) */
function peerInCategory(category: AlgorithmCategory, excludeSlug: string): string {
  const peers = COMPARABLE.filter((algo) => algo.category === category);
  const other = peers.find((algo) => algo.slug !== excludeSlug);
  return (other ?? peers[0])?.slug ?? excludeSlug;
}

function pickTarget(array: number[]): number {
  if (array.length === 0) return 0;
  if (Math.random() < 0.8) {
    return array[Math.floor(Math.random() * array.length)];
  }
  return Math.max(...array) + 1 + Math.floor(Math.random() * 9);
}

function parseArrayDraft(draft: string): number[] | null {
  const parts = draft
    .split(/[\s,;]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return null;

  const values = parts.map((part) => Number(part));
  if (values.some((value) => !Number.isFinite(value))) return null;
  return values.map((value) => Math.trunc(value));
}

/**
 * Песочница: сравнение только внутри одной категории (sorting / searching / …).
 * URL ?a=&b= — шаринг ссылки; при конфликте категорий B подстраивается под A.
 */
export default function Sandbox() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawA = resolveSlug(searchParams.get("a"), DEFAULT_A);
  const rawB = resolveSlug(searchParams.get("b"), DEFAULT_B);

  const metaARaw = getAlgorithmBySlug(rawA);
  const metaBRaw = getAlgorithmBySlug(rawB);

  // Если в URL смешаны категории — принудительно выравниваем B под A
  const slugA = rawA;
  const slugB =
    metaARaw && metaBRaw && metaARaw.category !== metaBRaw.category
      ? peerInCategory(metaARaw.category, slugA)
      : rawB;

  const [input, setInput] = useState(() => createRandomArray(12, 1, 40));
  const [target, setTarget] = useState(() => pickTarget(input));
  const [speed, setSpeed] = useState(400);
  const [editDraft, setEditDraft] = useState(() => input.join(", "));
  const [graph] = useState(() => createDemoGraph());
  const [graphStartId, setGraphStartId] = useState(DEMO_GRAPH_START);
  const [tree] = useState(() => createDemoTree());
  const [dpN, setDpN] = useState(DEMO_DP_N);
  const [text, setText] = useState(DEMO_TEXT);
  const [pattern, setPattern] = useState(DEMO_PATTERN);

  const metaA = getAlgorithmBySlug(slugA);
  const metaB = getAlgorithmBySlug(slugB);
  const activeCategory: AlgorithmCategory = metaA?.category ?? "sorting";

  const optionsInCategory = useMemo(
    () => COMPARABLE.filter((algo) => algo.category === activeCategory),
    [activeCategory],
  );

  const needsTarget = activeCategory === "searching";
  const needsBinaryHint = slugA === "binary-search" || slugB === "binary-search";
  const isGraphCategory = activeCategory === "graph";
  const isTreeCategory = activeCategory === "tree";
  const isDpCategory = activeCategory === "dynamic-programming";
  const isStringCategory = activeCategory === "string";
  const isGreedyCategory = activeCategory === "greedy";
  const isHashCategory = activeCategory === "data-structures";

  const laneA = useSandboxLane(
    slugA,
    input,
    target,
    graph,
    graphStartId,
    tree,
    dpN,
    text,
    pattern,
  );
  const laneB = useSandboxLane(
    slugB,
    input,
    target,
    graph,
    graphStartId,
    tree,
    dpN,
    text,
    pattern,
  );

  // Запись выровненных slug в URL (конфликт категорий / пустой query)
  useEffect(() => {
    const aParam = searchParams.get("a");
    const bParam = searchParams.get("b");
    if (aParam === slugA && bParam === slugB) return;
    setSearchParams({ a: slugA, b: slugB }, { replace: true });
  }, [slugA, slugB, searchParams, setSearchParams]);

  // Общая скорость → оба плеера
  useEffect(() => {
    laneA.player.setSpeed(speed);
    laneB.player.setSpeed(speed);
  }, [speed, laneA.player.setSpeed, laneB.player.setSpeed]);

  const setSlug = useCallback(
    (side: "a" | "b", nextSlug: string) => {
      const nextMeta = getAlgorithmBySlug(nextSlug);
      if (!nextMeta) return;

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(side, nextSlug);

          const otherKey = side === "a" ? "b" : "a";
          const otherSlug = next.get(otherKey) ?? (side === "a" ? slugB : slugA);
          const otherMeta = getAlgorithmBySlug(otherSlug);

          // Смена категории на одной стороне → подбираем peer той же группы для второй
          if (!otherMeta || otherMeta.category !== nextMeta.category) {
            next.set(otherKey, peerInCategory(nextMeta.category, nextSlug));
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams, slugA, slugB],
  );

  /** Переключение группы целиком (оба селекта остаются согласованы) */
  const setCategory = useCallback(
    (category: AlgorithmCategory) => {
      const first = COMPARABLE.find((algo) => algo.category === category);
      if (!first) return;
      const second = peerInCategory(category, first.slug);
      setSearchParams({ a: first.slug, b: second }, { replace: true });
    },
    [setSearchParams],
  );

  const handleRandom = useCallback(() => {
    const next = createRandomArray(12, 1, 40);
    setInput(next);
    setEditDraft(next.join(", "));
    setTarget(pickTarget(next));
  }, []);

  const handleApplyEdit = useCallback(() => {
    const parsed = parseArrayDraft(editDraft);
    if (!parsed || parsed.length === 0) return;
    setInput(parsed);
    setTarget(pickTarget(parsed));
  }, [editDraft]);

  const eitherPlaying = laneA.player.isPlaying || laneB.player.isPlaying;
  const bothAtStart = laneA.player.isAtStart && laneB.player.isAtStart;
  const bothAtEnd =
    laneA.player.isAtEnd &&
    laneB.player.isAtEnd &&
    laneA.player.totalSteps > 0 &&
    laneB.player.totalSteps > 0;

  const handleToggleBoth = useCallback(() => {
    if (eitherPlaying) {
      laneA.player.pause();
      laneB.player.pause();
      return;
    }
    laneA.player.play();
    laneB.player.play();
  }, [eitherPlaying, laneA.player, laneB.player]);

  const handleResetBoth = useCallback(() => {
    laneA.player.reset();
    laneB.player.reset();
  }, [laneA.player, laneB.player]);

  const summary = useMemo(() => {
    if (!bothAtEnd || !metaA || !metaB) return null;

    const statsA = finalStatsFromActions(laneA.steps);
    const statsB = finalStatsFromActions(laneB.steps);

    return buildCompareSummary(
      {
        name: metaA.name,
        totalSteps: laneA.player.totalSteps,
        comparisons: statsA.comparisons,
        moves: statsA.moves,
        elapsedMs: laneA.player.elapsedMs,
      },
      {
        name: metaB.name,
        totalSteps: laneB.player.totalSteps,
        comparisons: statsB.comparisons,
        moves: statsB.moves,
        elapsedMs: laneB.player.elapsedMs,
      },
    );
  }, [
    bothAtEnd,
    metaA,
    metaB,
    laneA.steps,
    laneB.steps,
    laneA.player.totalSteps,
    laneB.player.totalSteps,
    laneA.player.elapsedMs,
    laneB.player.elapsedMs,
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className={styles.title}>Песочница сравнения</h1>
          <p className={styles.subtitle}>
            Сравнивай алгоритмы одной группы на общем входе: шаги, время, сравнения и
            перемещения (для графов — посещения вершин).
          </p>

          <div className={styles.categoryTabs} role="tablist" aria-label="Группа алгоритмов">
            {COMPARABLE_CATEGORIES.map((category) => {
              const enabled = COMPARABLE.some((algo) => algo.category === category.id);
              if (!enabled) return null;
              const isActive = category.id === activeCategory;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.categoryTab} ${isActive ? styles.categoryTabActive : ""}`}
                  onClick={() => setCategory(category.id)}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </motion.header>

        <motion.div
          className={styles.lanes}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <SandboxLane
            sideLabel="Алгоритм A"
            slug={slugA}
            options={optionsInCategory}
            onSlugChange={(next) => setSlug("a", next)}
            kind={laneA.kind}
            step={laneA.player.currentStep}
            currentIndex={laneA.player.currentIndex}
            totalSteps={laneA.player.totalSteps}
            stats={laneA.player.stats}
            elapsedMs={laneA.player.elapsedMs}
            message={laneA.player.currentStep?.message}
            graphStartId={graphStartId}
          />
          <SandboxLane
            sideLabel="Алгоритм B"
            slug={slugB}
            options={optionsInCategory}
            onSlugChange={(next) => setSlug("b", next)}
            kind={laneB.kind}
            step={laneB.player.currentStep}
            currentIndex={laneB.player.currentIndex}
            totalSteps={laneB.player.totalSteps}
            stats={laneB.player.stats}
            elapsedMs={laneB.player.elapsedMs}
            message={laneB.player.currentStep?.message}
            graphStartId={graphStartId}
          />
        </motion.div>

        <motion.section
          className={styles.shared}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          aria-label="Общее управление"
        >
          <h2 className={styles.sharedTitle}>
            {isGraphCategory
              ? "Общий граф"
              : isTreeCategory
                ? "Общее дерево"
                : isDpCategory
                  ? "Общий размер n"
                  : isStringCategory
                    ? "Общий текст и паттерн"
                    : isGreedyCategory
                      ? "Жадные демо"
                      : isHashCategory
                        ? "Хеш-таблица"
                        : "Общий input"}
          </h2>

          {isGraphCategory ? (
            <div className={styles.targetRow}>
              <label className={styles.targetLabel} htmlFor="sandbox-graph-start">
                Стартовая вершина
              </label>
              <select
                id="sandbox-graph-start"
                className={styles.select}
                value={graphStartId}
                onChange={(event) => setGraphStartId(event.target.value)}
              >
                {graph.nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
              <p className={styles.hint}>
                BFS, DFS и Dijkstra бегут по одному учебному графу (у рёбер есть веса).
                BFS/DFS веса игнорируют; Dijkstra считает кратчайшие пути по сумме весов.
              </p>
            </div>
          ) : isTreeCategory ? (
            <p className={styles.hint}>
              Preorder / Inorder / Postorder бегут по одному BST-демо (корень 4). Сравнивай,
              как меняется порядок посещения при одном и том же дереве.
            </p>
          ) : isDpCategory ? (
            <div className={styles.targetRow}>
              <label className={styles.targetLabel} htmlFor="sandbox-dp-n">
                n
              </label>
              <input
                id="sandbox-dp-n"
                className={styles.targetInput}
                type="number"
                min={1}
                max={15}
                value={dpN}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (!Number.isFinite(next)) return;
                  setDpN(Math.min(15, Math.max(1, Math.trunc(next))));
                }}
              />
              <p className={styles.hint}>
                Fibonacci и Climbing Stairs на одном n: одна рекуррентность, разная
                интерпретация ответа.
              </p>
            </div>
          ) : isStringCategory ? (
            <div className={styles.editRow} style={{ flexDirection: "column", alignItems: "stretch" }}>
              <input
                className={styles.editInput}
                value={text}
                onChange={(event) => setText(event.target.value.toUpperCase())}
                aria-label="Текст"
                placeholder="Текст"
              />
              <input
                className={styles.editInput}
                value={pattern}
                onChange={(event) => setPattern(event.target.value.toUpperCase())}
                aria-label="Паттерн"
                placeholder="Паттерн"
              />
              <p className={styles.hint}>
                Naive и KMP ищут один и тот же паттерн — сравни число сравнений и сдвигов.
              </p>
            </div>
          ) : isGreedyCategory ? (
            <p className={styles.hint}>
              Расписание и рюкзак — разные задачи; у каждой своё учебное демо. Сравнивай
              число шагов и «взятий» жадного правила.
            </p>
          ) : isHashCategory ? (
            <p className={styles.hint}>
              Учебный сценарий: вставки (в т.ч. коллизия apple/mango) и поиск. Пока один
              алгоритм в категории — обе полосы показывают одно и то же демо.
            </p>
          ) : (
            <>
              <div className={styles.inputRow}>
                <div className={styles.chips} aria-label="Текущий массив">
                  {input.map((value, index) => (
                    <span key={`${index}-${value}`} className={styles.chip}>
                      {value}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={handleRandom}
                  title="Случайный массив"
                >
                  🎲 Random
                </button>
              </div>

              <div className={styles.editRow}>
                <input
                  className={styles.editInput}
                  value={editDraft}
                  onChange={(event) => setEditDraft(event.target.value)}
                  aria-label="Редактировать массив"
                  placeholder="1, 5, 3, 9…"
                />
                <button type="button" className={styles.btn} onClick={handleApplyEdit}>
                  ✏ Применить
                </button>
              </div>

              {needsTarget && (
                <div className={styles.targetRow}>
                  <label className={styles.targetLabel} htmlFor="sandbox-target">
                    Цель поиска
                  </label>
                  <input
                    id="sandbox-target"
                    className={styles.targetInput}
                    type="number"
                    value={target}
                    onChange={(event) => setTarget(Number(event.target.value))}
                  />
                </div>
              )}

              {needsBinaryHint && (
                <p className={styles.hint}>
                  Binary Search получает отсортированную копию того же набора чисел.
                </p>
              )}
            </>
          )}

          <div className={styles.controlsRow}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleToggleBoth}
              disabled={
                (laneA.player.totalSteps === 0 && laneB.player.totalSteps === 0) ||
                (bothAtEnd && !eitherPlaying)
              }
            >
              {eitherPlaying ? "⏸ Пауза" : "▶ Запустить оба"}
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={handleResetBoth}
              disabled={bothAtStart && !eitherPlaying}
              title="Сброс"
            >
              ↺ Сброс
            </button>
            <div className={styles.speedWrap}>
              <Slider
                id="sandbox-speed"
                label="Скорость"
                min={50}
                max={1000}
                step={50}
                value={1050 - speed}
                valueLabel={`${speed} ms`}
                onChange={(uiValue) => setSpeed(1050 - uiValue)}
              />
            </div>
          </div>
        </motion.section>

        {summary && (
          <motion.section
            className={styles.summary}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className={styles.summaryTitle}>📊 Итог после завершения</h2>
            <p className={styles.summaryBody}>{summary}</p>
          </motion.section>
        )}
      </div>
    </div>
  );
}

interface SandboxLaneProps {
  sideLabel: string;
  slug: string;
  options: typeof COMPARABLE;
  onSlugChange: (slug: string) => void;
  kind: SandboxLaneKind;
  step:
    | SortStep
    | SearchStep
    | GraphStep
    | TreeStep
    | DpStep
    | StringStep
    | GreedyStep
    | HashTableStep
    | null;
  currentIndex: number;
  totalSteps: number;
  stats: PlayerStats;
  elapsedMs: number;
  message?: string;
  graphStartId?: string;
}

function SandboxLane({
  sideLabel,
  slug,
  options,
  onSlugChange,
  kind,
  step,
  currentIndex,
  totalSteps,
  stats,
  elapsedMs,
  message,
  graphStartId,
}: SandboxLaneProps) {
  const stepLabel = totalSteps === 0 ? "0 / 0" : `${currentIndex + 1} / ${totalSteps}`;
  const movesLabel =
    kind === "graph" || kind === "tree"
      ? slug === "dijkstra"
        ? "Фиксаций"
        : "Посещений"
      : kind === "dp"
        ? "Заполнений"
        : kind === "string"
          ? "Сдвигов / находок"
          : kind === "greedy"
            ? "Взятий"
            : kind === "hashtable"
              ? "Записей / коллизий"
              : "Перемещений";
  const compareLabel =
    kind === "graph"
      ? slug === "dijkstra"
        ? "Релаксаций / рёбер"
        : "Просмотров рёбер"
      : kind === "tree"
        ? "Спусков"
        : kind === "dp"
          ? "Базовых шагов"
          : kind === "string"
            ? "Сравнений символов"
            : kind === "greedy"
              ? "Рассмотрений"
              : kind === "hashtable"
                ? "Хешей / поисков"
                : "Сравнений";

  const treeCopy =
    slug === "preorder-traversal"
      ? {
          task: "Обойти все узлы; корень раньше детей",
          formula: "Preorder = корень → левое → правое",
        }
      : slug === "inorder-traversal"
        ? {
            task: "Обойти все узлы; для BST — отсортированный порядок",
            formula: "Inorder = левое → корень → правое",
          }
        : {
            task: "Обойти все узлы; корень после обоих поддеревьев",
            formula: "Postorder = левое → правое → корень",
          };

  const dpCopy =
    slug === "climbing-stairs"
      ? {
          task: "Сколько способов подняться на n ступеней (шаг +1 или +2)",
          recurrence: "ways(i) = ways(i−1) + ways(i−2)",
          indexLabel: "ст.",
        }
      : {
          task: "Найти F(n), заполняя таблицу снизу вверх",
          recurrence: "F(i) = F(i−1) + F(i−2)",
          indexLabel: "i",
        };

  const stringCopy =
    slug === "kmp-search"
      ? {
          task: "Найти все вхождения паттерна в тексте",
          strategy: "KMP: сдвиг по LPS при несовпадении",
        }
      : {
          task: "Найти все вхождения паттерна в тексте",
          strategy: "Наивно: после попытки сдвигаем окно на 1",
        };

  const greedyCopy =
    slug === "fractional-knapsack"
      ? {
          task: "Задача о рюкзаке: максимум ценности при ограниченной вместимости",
          strategy: "Брать по убыванию ценности/веса; долю — если не влезает целиком",
        }
      : {
          task: "Задача составления расписания: максимум непересекающихся интервалов",
          strategy: "Сортировка по концу; брать, если старт ≥ конца последней взятой",
        };

  return (
    <article className={styles.lane}>
      <div className={styles.laneHeader}>
        <span className={styles.laneLabel}>{sideLabel}</span>
        <select
          className={styles.select}
          value={slug}
          onChange={(event) => onSlugChange(event.target.value)}
          aria-label={sideLabel}
        >
          {options.map((algo) => (
            <option key={algo.slug} value={algo.slug}>
              {algo.name} — {algo.nameRu}
            </option>
          ))}
        </select>
      </div>

      {kind === "searching" ? (
        <SearchVisualizer step={step as SearchStep | null} />
      ) : kind === "graph" ? (
        <GraphVisualizer
          step={step as GraphStep | null}
          startId={graphStartId}
          frontierLabel={
            slug === "dijkstra"
              ? "Кандидаты PQ (по возрастанию dist)"
              : slug === "dfs"
                ? "Стек (ожидают, последний сверху)"
                : "Очередь (ожидают, первые слева)"
          }
          task={
            slug === "dijkstra"
              ? "Кратчайшие пути от старта во взвешенном графе"
              : slug === "dfs"
                ? "Обойти граф вглубь от старта и показать порядок первого посещения"
                : "Обойти граф слоями от старта и показать порядок первого посещения"
          }
          visitOrderHint={
            slug === "dijkstra"
              ? "порядок фиксации (extract-min)"
              : "результат обхода — последовательность вершин"
          }
          showDistances={slug === "dijkstra"}
        />
      ) : kind === "tree" ? (
        <TreeVisualizer
          step={step as TreeStep | null}
          task={treeCopy.task}
          formulaHint={treeCopy.formula}
        />
      ) : kind === "dp" ? (
        <DpTableVisualizer
          step={step as DpStep | null}
          task={dpCopy.task}
          recurrenceHint={dpCopy.recurrence}
          indexLabel={dpCopy.indexLabel}
        />
      ) : kind === "string" ? (
        <StringMatchVisualizer
          step={step as StringStep | null}
          task={stringCopy.task}
          strategyHint={stringCopy.strategy}
        />
      ) : kind === "greedy" && slug === "activity-selection" ? (
        <ActivitySelectionVisualizer
          step={
            step && "kind" in step && step.kind === "activity"
              ? step
              : null
          }
          task={greedyCopy.task}
          ruleHint={greedyCopy.strategy}
        />
      ) : kind === "greedy" && slug === "fractional-knapsack" ? (
        <FractionalKnapsackVisualizer
          step={
            step && "kind" in step && step.kind === "knapsack"
              ? step
              : null
          }
          task={greedyCopy.task}
          ruleHint={greedyCopy.strategy}
        />
      ) : kind === "hashtable" ? (
        <HashTableVisualizer
          step={
            step && "kind" in step && step.kind === "hashtable"
              ? step
              : null
          }
        />
      ) : (
        <SortVisualizer step={step as SortStep | null} />
      )}

      <p className={styles.laneMessage}>{message ?? " "}</p>

      <div className={styles.laneMeta}>
        <span>
          Шаг: <span className={styles.laneMetaStrong}>{stepLabel}</span>
        </span>
        <span>
          Время:{" "}
          <span className={styles.laneMetaStrong} aria-live="polite">
            {formatElapsedMs(elapsedMs)}
          </span>
        </span>
        <span>
          {compareLabel}: <span className={styles.laneMetaStrong}>{stats.comparisons}</span>
        </span>
        <span>
          {movesLabel}: <span className={styles.laneMetaStrong}>{stats.moves}</span>
        </span>
      </div>
    </article>
  );
}
