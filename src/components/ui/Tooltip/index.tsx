import type { ReactNode } from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  content: string;
  children: ReactNode;
  /** Позиция пузыря относительно триггера */
  placement?: "top" | "bottom";
}

/**
 * Кастомный тултип в стиле AlgoVisual.
 * Нативный title не используем — мешает кастомному UI.
 */
export default function Tooltip({ content, children, placement = "top" }: TooltipProps) {
  return (
    <span className={styles.wrap}>
      {children}
      <span
        className={`${styles.tip} ${placement === "bottom" ? styles.tipBottom : styles.tipTop}`}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}
