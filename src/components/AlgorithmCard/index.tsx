import type { AlgorithmMeta } from "@/algorithms/types";
import AlgorithmPreview from "@/components/AlgorithmPreview";
import { InPlaceBadge, StableBadge } from "@/components/ui/InfoBadge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./AlgorithmCard.module.css";

// ─── Конфиги ────────────────────────────────────────────

const categoryConfig: Record<string, { label: string; colorVar: string }> = {
  sorting: { label: "Сортировка", colorVar: "--color-sorting" },
  searching: { label: "Поиск", colorVar: "--color-searching" },
  tree: { label: "Деревья", colorVar: "--color-tree" },
  graph: { label: "Графы", colorVar: "--color-graph" },
  "dynamic-programming": { label: "DP", colorVar: "--color-dp" },
  greedy: { label: "Жадные", colorVar: "--color-greedy" },
  string: { label: "Строки", colorVar: "--color-string" },
  "data-structures": { label: "Структуры", colorVar: "--color-ds" },
  "np-complete": { label: "NP", colorVar: "--color-np" },
  ml: { label: "ML", colorVar: "--color-ml" },
};

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
  "O(n · m)": "var(--color-on2)",
  "O(n + m)": "var(--color-on)",
  "O(V + E)": "var(--color-on)",
  "O(V)": "var(--color-ologn)",
  "O(V²)": "var(--color-on2)",
  "O(h)": "var(--color-ologn)",
  "O(n!)": "var(--color-o2n)",
};

function getComplexityColor(value: string): string {
  return complexityColor[value] ?? "var(--color-text-muted)";
}

// ─── Сама карточка ───────────────────────────────────────

export default function AlgorithmCard({ algorithm }: { algorithm: AlgorithmMeta }) {
  const { slug, name, nameRu, category, complexity, shortDescription, stable, inPlace } = algorithm;
  const catConfig = categoryConfig[category];

  return (
    <motion.div
      className={styles.cardMotion}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link to={`/algorithm/${slug}`} className={styles.card}>
        {/* Превью */}
        <div
          className={styles.preview}
          style={
            {
              "--cat-color": `var(${catConfig.colorVar})`,
            } as React.CSSProperties
          }
        >
          <AlgorithmPreview slug={slug} category={category} />
        </div>

        {/* Тело карточки */}
        <div className={styles.body}>
          {/* Шапка: название + категория */}
          <div className={styles.cardHeader}>
            <div className={styles.titleBlock}>
              <h3 className={styles.name}>{name}</h3>
              <p className={styles.nameRu}>{nameRu}</p>
            </div>
            <span
              className={styles.category}
              style={
                { "--cat-color": `var(${catConfig.colorVar})` } as React.CSSProperties
              }
            >
              {catConfig.label}
            </span>
          </div>

          {/* Описание */}
          <p className={styles.description}>{shortDescription}</p>

          {/* Big O строка */}
          <div className={styles.complexity}>
            <ComplexityItem label="Средн." value={complexity.average} />
            <ComplexityItem label="Худш." value={complexity.worst} />
            <ComplexityItem label="Память" value={complexity.space} />
          </div>
          {(complexity.average.includes("V") ||
            complexity.average.includes("E") ||
            complexity.space.includes("V")) && (
            <p className={styles.complexityNote} title="Vertices / Edges">
              V — вершины, E — рёбра
            </p>
          )}
          {complexity.space === "O(h)" && (
            <p className={styles.complexityNote} title="nodes / height">
              n — узлы, h — высота дерева
            </p>
          )}
          {(complexity.average.includes("n · m") ||
            complexity.average.includes("n + m")) && (
            <p className={styles.complexityNote} title="text / pattern lengths">
              n — текст, m — паттерн
            </p>
          )}

          {/* Бейджи */}
          <div className={styles.badges}>
            {stable !== undefined && <StableBadge stable={stable} />}
            {inPlace !== undefined && <InPlaceBadge inPlace={inPlace} />}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Вспомогательный компонент ───────────────────────────

function ComplexityItem({ label, value }: { label: string; value: string }) {
  const hint =
    value.includes("V") || value.includes("E")
      ? "V — число вершин (Vertices), E — число рёбер (Edges)"
      : value === "O(h)"
        ? "h — высота дерева (height)"
        : undefined;

  return (
    <div className={styles.complexityItem}>
      <span className={styles.complexityLabel}>{label}</span>
      <span
        className={styles.complexityValue}
        style={{ color: getComplexityColor(value) }}
        title={hint}
      >
        {value}
      </span>
    </div>
  );
}
