import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { hasDpVisualization } from "@/algorithms/dp";
import { hasGraphVisualization } from "@/algorithms/graph";
import { hasGreedyVisualization } from "@/algorithms/greedy";
import { hasHashTableVisualization } from "@/algorithms/hashtable";
import { hasSearchingVisualization } from "@/algorithms/searching";
import { hasSortingVisualization } from "@/algorithms/sorting";
import { hasStringVisualization } from "@/algorithms/string";
import { hasTreeVisualization } from "@/algorithms/tree";
import { getAdjacentAlgorithms, getAlgorithmBySlug } from "@/data/algorithms";
import { algorithmCode } from "@/data/algorithmCode";
import Accordion from "@/components/Accordion";
import CodeBlock from "@/components/CodeBlock";
import { InPlaceBadge, StableBadge } from "@/components/ui/InfoBadge";
import DpPlaybackPanel from "@/components/visualizers/DpPlaybackPanel";
import GraphPlaybackPanel from "@/components/visualizers/GraphPlaybackPanel";
import GreedyPlaybackPanel from "@/components/visualizers/GreedyPlaybackPanel";
import HashTablePlaybackPanel from "@/components/visualizers/HashTablePlaybackPanel";
import SearchPlaybackPanel from "@/components/visualizers/SearchPlaybackPanel";
import SortPlaybackPanel from "@/components/visualizers/SortPlaybackPanel";
import StringMatchPlaybackPanel from "@/components/visualizers/StringMatchPlaybackPanel";
import TreePlaybackPanel from "@/components/visualizers/TreePlaybackPanel";
import styles from "./Algorithm.module.css";

// ─── Таблица сложности ───────────────────────────────────

function ComplexityTable({
  complexity,
  category,
}: {
  complexity: { best: string; average: string; worst: string; space: string };
  category?: string;
}) {
  const complexityColor: Record<string, string> = {
    "O(1)": "var(--color-o1)",
    "O(log n)": "var(--color-ologn)",
    "O(n)": "var(--color-on)",
    "O(n log n)": "var(--color-onlogn)",
    "O(n logn)": "var(--color-onlogn)",
    "O(n²)": "var(--color-on2)",
    "O(2ⁿ)": "var(--color-o2n)",
    "O(nk)": "var(--color-on)",
    "O(n + k)": "var(--color-onlogn)",
    "O(V + E)": "var(--color-on)",
    "O(V)": "var(--color-ologn)",
    "O(V²)": "var(--color-on2)",
    "O(h)": "var(--color-ologn)",
    "O(n · m)": "var(--color-on2)",
    "O(n + m)": "var(--color-on)",
  };

  const rows = [
    { label: "Лучший случай", value: complexity.best },
    { label: "Средний случай", value: complexity.average },
    { label: "Худший случай", value: complexity.worst },
    { label: "Память", value: complexity.space },
  ];

  const showTreeHint = rows.some((r) => r.value === "O(h)");
  const showGraphHint = rows.some(
    (row) => row.value.includes("V") || row.value.includes("E"),
  );
  // DP / лестница: все метрики O(n) — поясняем, что такое n
  const showDpNHint =
    !showTreeHint &&
    !showGraphHint &&
    rows.every((r) => r.value === "O(n)") &&
    rows.length > 0;
  const showStringNMHint =
    category === "string" &&
    rows.some((r) => r.value.includes("n · m") || r.value.includes("n + m"));
  const showSetCoverHint =
    category === "greedy" && rows.some((r) => r.value.includes("n · m"));
  const showGreedyNHint =
    category === "greedy" && !showSetCoverHint;
  const showHashHint = category === "data-structures";

  return (
    <div className={styles.complexityTable}>
      {rows.map(({ label, value }) => (
        <div key={label} className={styles.complexityRow}>
          <span className={styles.complexityLabel}>{label}</span>
          <span
            className={styles.complexityValue}
            style={{ color: complexityColor[value] ?? "var(--color-text-muted)" }}
            title={
              value.includes("V") || value.includes("E")
                ? "V — число вершин (Vertices), E — число рёбер (Edges)"
                : value === "O(h)"
                  ? "h — высота дерева (height)"
                  : value === "O(n)" && showTreeHint
                    ? "n — число узлов дерева"
                    : undefined
            }
          >
            {value}
          </span>
        </div>
      ))}
      {showGraphHint && (
        <p className={styles.complexityHint}>
          <span className={styles.complexityHintStrong}>V</span> — число вершин
          (vertices), <span className={styles.complexityHintStrong}>E</span> — число
          рёбер (edges). Например, O(V + E) значит: время растёт с числом вершин и
          рёбер вместе.
        </p>
      )}
      {showTreeHint && (
        <p className={styles.complexityHint}>
          <span className={styles.complexityHintStrong}>n</span> — число узлов дерева,{" "}
          <span className={styles.complexityHintStrong}>h</span> — высота (длиннейший
          путь от корня до листа). O(h) — память под стек рекурсии.
        </p>
      )}
      {showDpNHint && (
        <p className={styles.complexityHint}>
          <span className={styles.complexityHintStrong}>n</span> — размер задачи (индекс
          Фибоначчи или число ступеней). O(n) значит: один проход по таблице из n+1
          ячеек.
        </p>
      )}
      {showStringNMHint && (
        <p className={styles.complexityHint}>
          <span className={styles.complexityHintStrong}>n</span> — длина текста,{" "}
          <span className={styles.complexityHintStrong}>m</span> — длина паттерна.
          O(n·m) — наивный перебор окон; O(n+m) — KMP с предобработкой LPS.
        </p>
      )}
      {showSetCoverHint && (
        <p className={styles.complexityHint}>
          <span className={styles.complexityHintStrong}>n</span> — размер универсума,{" "}
          <span className={styles.complexityHintStrong}>m</span> — число кандидатных
          множеств. На каждом раунде смотрим все оставшиеся кандидаты.
        </p>
      )}
      {showGreedyNHint && (
        <p className={styles.complexityHint}>
          <span className={styles.complexityHintStrong}>n</span> — число заявок
          (интервалов) или предметов. O(n log n) — сортировка по жадному ключу (конец /
          value÷weight); дальше один линейный проход.
        </p>
      )}
      {showHashHint && (
        <p className={styles.complexityHint}>
          <span className={styles.complexityHintStrong}>O(1)</span> в среднем — один
          расчёт индекса и короткая цепочка.{" "}
          <span className={styles.complexityHintStrong}>O(n)</span> в худшем — все ключи
          попали в один бакет (длинная цепочка).
        </p>
      )}
    </div>
  );
}

// ─── Секция "Когда использовать" ─────────────────────────

function WhenToUse({ use, avoid }: { use: string[]; avoid: string[] }) {
  return (
    <div className={styles.whenGrid}>
      <div className={styles.whenBlock}>
        <p className={styles.whenBlockTitle}>
          <span className={styles.whenIconYes}>✓</span>
          Когда использовать
        </p>
        <ul className={styles.whenList}>
          {use.map((item, i) => (
            <li key={i} className={styles.whenItemYes}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.whenBlock}>
        <p className={styles.whenBlockTitle}>
          <span className={styles.whenIconNo}>✕</span>
          Когда не использовать
        </p>
        <ul className={styles.whenList}>
          {avoid.map((item, i) => (
            <li key={i} className={styles.whenItemNo}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Бейджи стабильности ─────────────────────────────────

function AlgorithmBadges({ stable, inPlace }: { stable?: boolean; inPlace?: boolean }) {
  if (stable === undefined && inPlace === undefined) return null;

  return (
    <div className={styles.badges}>
      {stable !== undefined && <StableBadge stable={stable} />}
      {inPlace !== undefined && <InPlaceBadge inPlace={inPlace} />}
    </div>
  );
}

// ─── Секция "Как работает" ───────────────────────────────

function HowItWorks({ steps }: { steps: string[] }) {
  return (
    <ol className={styles.howList}>
      {steps.map((step, index) => (
        <li key={index} className={styles.howItem}>
          <span className={styles.howIndex} aria-hidden="true">
            {index + 1}
          </span>
          <span className={styles.howText}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

// ─── Главный компонент ───────────────────────────────────

export default function Algorithm() {
  const { slug } = useParams<{ slug: string }>();

  const algorithm = slug ? getAlgorithmBySlug(slug) : undefined;
  const code = slug ? algorithmCode[slug] : undefined;
  const { prev, next } = slug ? getAdjacentAlgorithms(slug) : { prev: null, next: null };

  // Если алгоритм не найден — редирект на /learn
  if (!algorithm) return <Navigate to="/learn" replace />;

  const { name, nameRu, complexity, shortDescription, howItWorks, when, stable, inPlace } =
    algorithm;

  // Собираем вкладки кода — только те что есть
  const codeTabs = code
    ? [
        { id: "jsBasic", label: "JS базовый", code: code["jsBasic"] },
        { id: "jsModern", label: "JS современный", code: code["jsModern"] },
        { id: "typescript", label: "TypeScript", code: code["typescript"] },
      ]
    : [];

  // Порядок как в wireframe: Как работает → Big O → Когда использовать
  const accordionItems = [
    ...(howItWorks?.length
      ? [
          {
            id: "how",
            title: "📖 Как работает",
            content: <HowItWorks steps={howItWorks} />,
          },
        ]
      : []),
    {
      id: "complexity",
      title: "⏱ Big O — сложность",
      content: <ComplexityTable complexity={complexity} category={algorithm.category} />,
    },
    {
      id: "when",
      title: "🎯 Когда использовать",
      content: <WhenToUse use={when.use} avoid={when.avoid} />,
    },
  ];

  const defaultOpen = howItWorks?.length
    ? ["how", "complexity", "when"]
    : ["complexity", "when"];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* ── Хлебные крошки + соседние алгоритмы ── */}
        <motion.div
          className={styles.topNav}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.breadcrumbs}>
            <Link to="/learn" className={styles.breadcrumbLink}>
              ← Учебник
            </Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>{name}</span>
          </div>

          <nav className={styles.adjacentNav} aria-label="Соседние алгоритмы">
            {prev ? (
              <Link
                to={`/algorithm/${prev.slug}`}
                className={styles.adjacentLink}
                title={prev.name}
              >
                <span className={styles.adjacentArrow} aria-hidden="true">
                  ←
                </span>
                <span className={styles.adjacentLabel}>{prev.nameRu}</span>
              </Link>
            ) : (
              <span className={styles.adjacentDisabled} aria-hidden="true" />
            )}

            {next ? (
              <Link
                to={`/algorithm/${next.slug}`}
                className={`${styles.adjacentLink} ${styles.adjacentLinkNext}`}
                title={next.name}
              >
                <span className={styles.adjacentLabel}>{next.nameRu}</span>
                <span className={styles.adjacentArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ) : (
              <span className={styles.adjacentDisabled} aria-hidden="true" />
            )}
          </nav>
        </motion.div>

        {/* ── Шапка страницы ── */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>{name}</h1>
            <p className={styles.titleRu}>{nameRu}</p>
            <p className={styles.description}>{shortDescription}</p>
            <AlgorithmBadges stable={stable} inPlace={inPlace} />
          </div>

          <Link to={`/sandbox?a=${slug}`} className={styles.sandboxBtn}>
            Сравнить в песочнице
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>

        {/* ── Основной контент ── */}
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Левая колонка — визуализация (только для алгоритмов с генератором шагов) */}
          <div className={`${styles.visualizerCol} ${styles.stickyPanel}`}>
            {slug && hasSortingVisualization(slug) ? (
              <SortPlaybackPanel key={slug} slug={slug} />
            ) : slug && hasSearchingVisualization(slug) ? (
              <SearchPlaybackPanel key={slug} slug={slug} />
            ) : slug && hasGraphVisualization(slug) ? (
              <GraphPlaybackPanel key={slug} slug={slug} />
            ) : slug && hasTreeVisualization(slug) ? (
              <TreePlaybackPanel key={slug} slug={slug} />
            ) : slug && hasDpVisualization(slug) ? (
              <DpPlaybackPanel key={slug} slug={slug} />
            ) : slug && hasStringVisualization(slug) ? (
              <StringMatchPlaybackPanel key={slug} slug={slug} />
            ) : slug && hasGreedyVisualization(slug) ? (
              <GreedyPlaybackPanel key={slug} slug={slug} />
            ) : slug && hasHashTableVisualization(slug) ? (
              <HashTablePlaybackPanel key={slug} slug={slug} />
            ) : (
              <div className={styles.visualizerPlaceholder}>
                <span className={styles.visualizerPlaceholderIcon}>🎬</span>
                <p className={styles.visualizerPlaceholderText}>Визуализация появится здесь</p>
                <p className={styles.visualizerPlaceholderSub}>— алгоритм ещё в разработке</p>
              </div>
            )}
          </div>

          {/* Правая колонка — описание */}
          <div className={`${styles.infoCol} ${styles.stickyPanel}`}>
            <Accordion items={accordionItems} defaultOpen={defaultOpen} />
          </div>
        </motion.div>

        {/* ── Код ── */}
        {codeTabs.length > 0 && (
          <motion.div
            className={styles.codeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h2 className={styles.codeSectionTitle}>Реализация</h2>
            <CodeBlock tabs={codeTabs} />
          </motion.div>
        )}

        {/* ── Кнопка 3D (задел на будущее) ── */}
        <motion.div
          className={styles.threeDSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button className={styles.threeDBtn} disabled title="Скоро">
            <span>🌐</span>
            Посмотреть в 3D
            <span className={styles.threeDSoon}>скоро</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
