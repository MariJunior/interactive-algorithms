import Tooltip from "@/components/ui/Tooltip";
import { BADGE_TOOLTIPS } from "@/data/badgeTooltips";
import type { CSSProperties, ReactNode } from "react";
import styles from "./InfoBadge.module.css";

interface InfoBadgeProps {
  children: ReactNode;
  tooltip: string;
  color: string;
}

/** Бейдж с кастомным тултипом — общий для карточки и страницы алгоритма */
export default function InfoBadge({ children, tooltip, color }: InfoBadgeProps) {
  return (
    <Tooltip content={tooltip}>
      <span
        className={styles.badge}
        style={{ "--badge-color": color } as CSSProperties}
        tabIndex={0}
      >
        {children}
      </span>
    </Tooltip>
  );
}

export function StableBadge({ stable }: { stable: boolean }) {
  return (
    <InfoBadge
      tooltip={stable ? BADGE_TOOLTIPS.stable : BADGE_TOOLTIPS.unstable}
      color={stable ? "var(--color-o1)" : "var(--color-on2)"}
    >
      {stable ? "стабильная" : "нестабильная"}
    </InfoBadge>
  );
}

export function InPlaceBadge({ inPlace }: { inPlace: boolean }) {
  return (
    <InfoBadge
      tooltip={inPlace ? BADGE_TOOLTIPS.inPlace : BADGE_TOOLTIPS.outOfPlace}
      color={inPlace ? "var(--color-ologn)" : "var(--color-text-muted)"}
    >
      {inPlace ? "на месте" : "не на месте"}
    </InfoBadge>
  );
}
