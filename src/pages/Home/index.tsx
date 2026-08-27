import { ALGORITHMS, CATEGORIES } from "@/data/algorithms";
import { motion, type Easing, type MotionProps, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

// ─── Фоновая анимация сортировки ─────────────────────────

const mockBars = [
  28, 12, 42, 7, 35, 19, 48, 23, 38, 5, 31, 16, 44, 10, 27, 41, 14, 37, 22, 46, 9, 33, 18, 40, 25,
  43, 11, 36, 20, 47,
];

/** Палитра Big O / категорий — столбики читаются на тёмном фоне */
const BAR_COLORS = [
  "var(--color-sorting)",
  "var(--color-o1)",
  "var(--color-ologn)",
  "var(--color-on)",
  "var(--color-onlogn)",
  "var(--color-on2)",
  "var(--color-searching)",
  "var(--color-o2n)",
  "var(--color-tree)",
  "var(--color-graph)",
];

function SortingBackground() {
  return (
    <div className={styles.bgBars} aria-hidden="true">
      {mockBars.map((height, index) => (
        <div
          key={index}
          className={styles.bgBar}
          style={
            {
              "--bar-height": `${height * 1.8}px`,
              "--bar-delay": `${index * 0.12}s`,
              "--bar-dur": `${2.2 + (index % 5) * 0.35}s`,
              "--bar-color": BAR_COLORS[index % BAR_COLORS.length],
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// ─── Призыв проскроллить ─────────────────────────────────

const SCROLL_CUE_TEXT = "скроль вниз · смотри дальше · ";

function ScrollCue() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setHidden(window.scrollY > 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    document.getElementById("home-features")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <button
      type="button"
      className={`${styles.scrollCue} ${hidden ? styles.scrollCueHidden : ""}`}
      onClick={handleClick}
      aria-label="Проскроллить вниз"
    >
      <svg className={styles.scrollCueRing} viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path
            id="scroll-cue-circle"
            d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
          />
        </defs>
        <text className={styles.scrollCueText}>
          <textPath href="#scroll-cue-circle">{SCROLL_CUE_TEXT.repeat(2)}</textPath>
        </text>
      </svg>

      <span className={styles.scrollCueArrow} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3v10M4 9l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

// ─── Карточки фич ────────────────────────────────────────

const FEATURES = [
  {
    icon: "🎬",
    title: "Визуализация",
    description: "Пошаговые анимации — смотришь как алгоритм думает, а не читаешь описание.",
  },
  {
    icon: "📖",
    title: "Теория",
    description: "Big O, когда использовать, когда нет — коротко и по делу, без воды.",
  },
  {
    icon: "💻",
    title: "Код",
    description: "Три варианта для каждого: JS базовый, JS современный и TypeScript.",
  },
  {
    icon: "⚡",
    title: "Сравнение",
    description: "Песочница — запусти два алгоритма на одних данных и сравни вживую.",
  },
];

// ─── Статистика ──────────────────────────────────────────

const categoriesWithAlgos = CATEGORIES.filter((category) =>
  ALGORITHMS.some((algorithm) => algorithm.category === category.id),
);

const STATS = [
  { value: ALGORITHMS.length, label: "алгоритмов" },
  { value: categoriesWithAlgos.length, label: "категории" },
  { value: 3, label: "варианта кода" },
  { value: "2D + 3D", label: "визуализация" },
];

// ─── Анимации ────────────────────────────────────────────

const easeOutNamed: Easing = "easeOut";

type FadeUpMotionProps = Pick<MotionProps, "initial" | "animate" | "transition">;

const fadeUp = (delay = 0): FadeUpMotionProps => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: easeOutNamed },
});

const stagger: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } },
};

const staggerChild: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOutNamed },
  },
};

// ─── Компонент ───────────────────────────────────────────

export default function Home() {
  return (
    <div className={styles.page}>
      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className={styles.hero}>
        <SortingBackground />
        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={styles.heroContent}>
          <motion.div {...fadeUp(0)} className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Интерактивный визуализатор алгоритмов
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className={styles.heroTitle}>
            Алгоритмы —<br />
            <span className={styles.heroTitleAccent}>это не скучно.</span>
            <br />
            Это красиво.
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className={styles.heroSubtitle}>
            Пошаговые визуализации, разбор логики, код на JS и TypeScript — всё в одном месте. Учись
            смотря, а не читая.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className={styles.heroCtas}>
            <Link to="/learn" className={styles.ctaPrimary}>
              Открыть учебник
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link to="/sandbox" className={styles.ctaSecondary}>
              Песочница
            </Link>
          </motion.div>
        </div>

        <ScrollCue />
      </section>

      {/* ══ ФИЧИ ══════════════════════════════════════════ */}
      <section id="home-features" className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.sectionTitle}
            {...fadeUp(0)}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
          >
            Что внутри
          </motion.h2>

          <motion.div
            className={styles.featuresGrid}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
          >
            {FEATURES.map(({ icon, title, description }) => (
              <motion.div key={title} className={styles.featureCard} variants={staggerChild}>
                <span className={styles.featureIcon}>{icon}</span>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDescription}>{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ СТАТИСТИКА ════════════════════════════════════ */}
      <section className={styles.statsSection}>
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.statsGrid}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
          >
            {STATS.map(({ value, label }) => (
              <motion.div key={label} className={styles.statItem} variants={staggerChild}>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.ctaBlock}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.ctaBars} aria-hidden="true">
              {[30, 60, 45, 80, 55, 70, 40, 90, 35, 65].map((height, index) => (
                <div
                  key={index}
                  className={styles.ctaBar}
                  style={
                    {
                      "--bar-height": `${height}%`,
                      "--bar-delay": `${index * 0.08}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Готов(–а) хакнуть алгоритмы?</h2>
              <p className={styles.ctaSubtitle}>
                Начни с основ — разберём Big O нотацию, а потом пройдём каждый алгоритм по шагам.
              </p>
              <Link to="/learn" className={styles.ctaPrimary}>
                Начать с Big O
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
