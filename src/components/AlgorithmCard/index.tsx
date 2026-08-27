import type { AlgorithmMeta } from "@/algorithms/types";
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
  "O(V + E)": "var(--color-on)",
  "O(V)": "var(--color-ologn)",
  "O(h)": "var(--color-ologn)",
  "O(n · m)": "var(--color-on2)",
  "O(n + m)": "var(--color-on)",
};

function getComplexityColor(value: string): string {
  return complexityColor[value] ?? "var(--color-text-muted)";
}

  // ─── Preview placeholder ─────────────────────────────────
// Статичные SVG-иллюстрации — "почерк" каждой категории.

function PreviewPlaceholder({ category }: { category: string }) {
  switch (category) {
    case "sorting":
      // Столбики разной высоты — намёк на сортировку
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[12, 30, 18, 42, 8, 36, 24, 44, 16, 38].map((height, index) => (
            <rect
              key={index}
              x={index * 8 + 1}
              y={48 - height}
              width={6}
              height={height}
              rx={2}
              fill="currentColor"
              opacity={0.3 + (height / 44) * 0.7}
            />
          ))}
        </svg>
      );

    case "searching":
      // Массив с выделенным элементом и лупой
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <rect
              key={index}
              x={index * 11 + 2}
              y={16}
              width={9}
              height={9}
              rx={2}
              fill="currentColor"
              opacity={index === 3 ? 1 : 0.25}
            />
          ))}
          {/* Лупа */}
          <circle cx="60" cy="34" r="8" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <line
            x1="66"
            y1="40"
            x2="72"
            y2="46"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      );

    case "tree":
      // Простое бинарное дерево
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Рёбра */}
          <line
            x1="40"
            y1="10"
            x2="20"
            y2="26"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <line
            x1="40"
            y1="10"
            x2="60"
            y2="26"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <line
            x1="20"
            y1="26"
            x2="10"
            y2="42"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <line
            x1="20"
            y1="26"
            x2="30"
            y2="42"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <line
            x1="60"
            y1="26"
            x2="50"
            y2="42"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <line
            x1="60"
            y1="26"
            x2="70"
            y2="42"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
          />
          {/* Узлы */}
          {[
            [40, 10],
            [20, 26],
            [60, 26],
            [10, 42],
            [30, 42],
            [50, 42],
            [70, 42],
          ].map(([cx, cy], index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={index === 0 ? 6 : 5}
              fill="currentColor"
              opacity={index === 0 ? 1 : 0.4}
            />
          ))}
        </svg>
      );

    case "graph":
      // Граф с несколькими узлами и рёбрами
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="15"
            y1="12"
            x2="45"
            y2="8"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <line
            x1="15"
            y1="12"
            x2="20"
            y2="38"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <line
            x1="45"
            y1="8"
            x2="68"
            y2="22"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <line
            x1="45"
            y1="8"
            x2="20"
            y2="38"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <line
            x1="68"
            y1="22"
            x2="55"
            y2="42"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <line
            x1="20"
            y1="38"
            x2="55"
            y2="42"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.35"
          />
          {[
            [15, 12],
            [45, 8],
            [68, 22],
            [20, 38],
            [55, 42],
          ].map(([cx, cy], index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={5}
              fill="currentColor"
              opacity={index === 1 ? 1 : 0.4}
            />
          ))}
        </svg>
      );

    case "dynamic-programming":
      // Таблица мемоизации
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3, 4].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={col * 15 + 5}
                y={row * 10 + 4}
                width={13}
                height={8}
                rx={1.5}
                fill="currentColor"
                opacity={row <= col ? 0.7 : 0.15}
              />
            )),
          )}
        </svg>
      );

    case "greedy":
      // Стрелка вверх — жадный выбор максимума
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[8, 20, 14, 38, 26, 44, 18, 30].map((height, index) => (
            <rect
              key={index}
              x={index * 9 + 4}
              y={48 - height}
              width={7}
              height={height}
              rx={2}
              fill="currentColor"
              opacity={index === 5 ? 1 : 0.25}
            />
          ))}
          {/* Стрелка над максимумом */}
          <polyline
            points="37,6 40,2 43,6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      );

    case "string":
      // Строка с выделенным паттерном
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Символы строки */}
          {["A", "B", "C", "A", "B", "D"].map((char, index) => (
            <g key={index}>
              <rect
                x={index * 12 + 4}
                y={10}
                width={10}
                height={12}
                rx={2}
                fill="currentColor"
                opacity={index >= 3 ? 0.8 : 0.2}
              />
              <text
                x={index * 12 + 9}
                y={20}
                textAnchor="middle"
                fontSize="7"
                fill="currentColor"
                opacity={index >= 3 ? 1 : 0.5}
                fontFamily="monospace"
              >
                {char}
              </text>
            </g>
          ))}
          {/* Паттерн снизу */}
          {["A", "B", "D"].map((char, index) => (
            <g key={index}>
              <rect
                x={(index + 3) * 12 + 4}
                y={30}
                width={10}
                height={12}
                rx={2}
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                opacity={0.7}
              />
              <text
                x={(index + 3) * 12 + 9}
                y={40}
                textAnchor="middle"
                fontSize="7"
                fill="currentColor"
                opacity={0.7}
                fontFamily="monospace"
              >
                {char}
              </text>
            </g>
          ))}
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="24" r="16" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        </svg>
      );
  }
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
          <PreviewPlaceholder category={category} />
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
