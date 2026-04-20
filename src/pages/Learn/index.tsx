import AlgorithmCard from "@/components/AlgorithmCard";
import { ALGORITHMS, CATEGORIES } from "@/data/algorithms";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useState } from "react";
import styles from "./Learn.module.css";

// ─── Big O данные для графика ────────────────────────────

const BIG_O_ITEMS = [
  {
    notation: "O(1)",
    label: "Константная",
    color: "var(--color-o1)",
    description: "Не зависит от размера данных. Идеал.",
    example: "Доступ к элементу массива по индексу",
  },
  {
    notation: "O(log n)",
    label: "Логарифмическая",
    color: "var(--color-ologn)",
    description: "Делит задачу пополам на каждом шаге. Очень быстро.",
    example: "Бинарный поиск",
  },
  {
    notation: "O(n)",
    label: "Линейная",
    color: "var(--color-on)",
    description: "Растёт пропорционально данным. Честно.",
    example: "Линейный поиск, один проход по массиву",
  },
  {
    notation: "O(n log n)",
    label: "Линейно-логарифмическая",
    color: "var(--color-onlogn)",
    description: "Лучшее, что можно получить для сортировки сравнениями.",
    example: "Merge Sort, Quick Sort (среднее)",
  },
  {
    notation: "O(n²)",
    label: "Квадратичная",
    color: "var(--color-on2)",
    description: "Цикл внутри цикла. Больно на крупных данных.",
    example: "Bubble Sort, Selection Sort",
  },
  {
    notation: "O(2ⁿ)",
    label: "Экспоненциальная",
    color: "var(--color-o2n)",
    description: "Взрывной рост. Только для очень маленьких n.",
    example: "Наивный Fibonacci, перебор подмножеств",
  },
] as const;

// ─── Анимации ────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

// ─── Компонент ───────────────────────────────────────────

export default function Learn() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredAlgorithms =
    activeCategory === "all" ? ALGORITHMS : ALGORITHMS.filter((algorithm) => algorithm.category === activeCategory);

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Интерактивный учебник
          <span className={styles.heroAccent}> по алгоритмам</span>
        </motion.h1>
        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Разбираем каждый алгоритм пошагово.
          <br />
          Логика, визуализация, код на JS и TS.
        </motion.p>
      </section>

      {/* ── Big O секция ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Сложность алгоритмов — Big O нотация</h2>
          <p className={styles.sectionSubtitle}>
            Прежде чем смотреть на алгоритмы — разберёмся, как измерять их скорость.
            <br />
            <strong>Big O</strong> нотация описывает, как растёт время выполнения при увеличении объёма данных.
          </p>

          <div className={styles.bigOGrid}>
            {BIG_O_ITEMS.map((item, index) => (
              <motion.div
                key={item.notation}
                className={styles.bigOCard}
                style={{ "--item-color": item.color } as React.CSSProperties}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
              >
                <div className={styles.bigOHeader}>
                  <span className={styles.bigONotation}>{item.notation}</span>
                  <span className={styles.bigOLabel}>{item.label}</span>
                </div>
                <p className={styles.bigODescription}>{item.description}</p>
                <p className={styles.bigOExample}>
                  <span className={styles.bigOExampleLabel}>Пример: </span>
                  {item.example}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Алгоритмы ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Все алгоритмы</h2>

          {/* Фильтры по категориям */}
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${activeCategory === "all" ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              Все
              <span className={styles.filterCount}>{ALGORITHMS.length}</span>
            </button>

            {CATEGORIES.map((category) => {
              const count = ALGORITHMS.filter((algorithm) => algorithm.category === category.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={category.id}
                  className={`${styles.filterBtn} ${activeCategory === category.id ? styles.filterBtnActive : ""}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                  <span className={styles.filterCount}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Сетка карточек */}
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={activeCategory} // перезапускаем анимацию при смене фильтра
          >
            <AnimatePresence mode="popLayout">
              {filteredAlgorithms.map((algorithm) => (
                <motion.div key={algorithm.slug} variants={cardVariants} layout>
                  <AlgorithmCard algorithm={algorithm} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredAlgorithms.length === 0 && (
            <p className={styles.empty}>В этой категории пока нет алгоритмов — скоро будут!</p>
          )}
        </div>
      </section>
    </div>
  );
}
