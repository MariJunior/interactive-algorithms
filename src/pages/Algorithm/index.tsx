import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAlgorithmBySlug } from "@/data/algorithms";
import { algorithmCode } from "@/data/algorithmCode";
import Accordion from "@/components/Accordion";
import CodeBlock from "@/components/CodeBlock";
import styles from "./Algorithm.module.css";

// ─── Таблица сложности ───────────────────────────────────

function ComplexityTable({
  complexity,
}: {
  complexity: { best: string; average: string; worst: string; space: string };
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
  };

  const rows = [
    { label: "Лучший случай", value: complexity.best },
    { label: "Средний случай", value: complexity.average },
    { label: "Худший случай", value: complexity.worst },
    { label: "Память", value: complexity.space },
  ];

  return (
    <div className={styles.complexityTable}>
      {rows.map(({ label, value }) => (
        <div key={label} className={styles.complexityRow}>
          <span className={styles.complexityLabel}>{label}</span>
          <span
            className={styles.complexityValue}
            style={{ color: complexityColor[value] ?? "var(--color-text-muted)" }}
          >
            {value}
          </span>
        </div>
      ))}
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
      {stable !== undefined && (
        <span
          className={styles.badge}
          style={
            {
              "--badge-color": stable ? "var(--color-o1)" : "var(--color-on2)",
            } as React.CSSProperties
          }
        >
          {stable ? "stable" : "unstable"}
        </span>
      )}
      {inPlace !== undefined && (
        <span
          className={styles.badge}
          style={
            {
              "--badge-color": inPlace ? "var(--color-ologn)" : "var(--color-text-muted)",
            } as React.CSSProperties
          }
        >
          {inPlace ? "in-place" : "out-of-place"}
        </span>
      )}
    </div>
  );
}

// ─── Главный компонент ───────────────────────────────────

export default function Algorithm() {
  const { slug } = useParams<{ slug: string }>();

  const algorithm = slug ? getAlgorithmBySlug(slug) : undefined;
  const code = slug ? algorithmCode[slug] : undefined;

  // Если алгоритм не найден — редирект на /learn
  if (!algorithm) return <Navigate to="/learn" replace />;

  const { name, complexity, shortDescription, when, stable, inPlace } = algorithm;

  // Собираем вкладки кода — только те что есть
  const codeTabs = code
    ? [
        { id: "jsBasic", label: "JS базовый", code: code["jsBasic"] },
        { id: "jsModern", label: "JS современный", code: code["jsModern"] },
        { id: "typescript", label: "TypeScript", code: code["typescript"] },
      ]
    : [];

  // Аккордеон-секции
  const accordionItems = [
    {
      id: "complexity",
      title: "⏱ Big O — сложность",
      content: <ComplexityTable complexity={complexity} />,
    },
    {
      id: "when",
      title: "🎯 Когда использовать",
      content: <WhenToUse use={when.use} avoid={when.avoid} />,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* ── Хлебные крошки ── */}
        <motion.div
          className={styles.breadcrumbs}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/learn" className={styles.breadcrumbLink}>
            ← Учебник
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{name}</span>
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
          {/* Левая колонка — визуализация (заглушка пока) */}
          <div className={styles.visualizerCol}>
            <div className={styles.visualizerPlaceholder}>
              <span className={styles.visualizerPlaceholderIcon}>🎬</span>
              <p className={styles.visualizerPlaceholderText}>Визуализация появится здесь</p>
              <p className={styles.visualizerPlaceholderSub}>— в следующем этапе</p>
            </div>
          </div>

          {/* Правая колонка — описание */}
          <div className={styles.infoCol}>
            <Accordion items={accordionItems} defaultOpen={["complexity", "when"]} />
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
