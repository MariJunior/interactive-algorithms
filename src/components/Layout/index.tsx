import { motion } from "framer-motion";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const navItems = [
  { to: "/", label: "Главная", end: true },
  { to: "/learn", label: "Учебник" },
  { to: "/sandbox", label: "Песочница" },
];

export default function Layout() {
  return (
    <div className={styles.root}>
      {/* Skip-link: первый фокусируемый элемент для клавиатуры */}
      <a href="#main-content" className={styles.skipLink}>
        Перейти к содержимому
      </a>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" className={styles.logo} aria-label="AlgoVisual — на главную">
            <span className={styles.logoBracket} aria-hidden="true">
              &lt;
            </span>
            algo
            <span className={styles.logoAccent}>visual</span>
            <span className={styles.logoBracket} aria-hidden="true">
              /&gt;
            </span>
          </NavLink>

          <nav className={styles.nav} aria-label="Основная навигация">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.span
                        className={styles.navIndicator}
                        layoutId="nav-indicator"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
