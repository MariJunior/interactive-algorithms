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
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Логотип */}
          <NavLink to="/" className={styles.logo}>
            <span className={styles.logoBracket}>&lt;</span>
            algo
            <span className={styles.logoAccent}>visual</span>
            <span className={styles.logoBracket}>/&gt;</span>
          </NavLink>

          {/* Навигация */}
          <nav className={styles.nav}>
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
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Контент страниц */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
