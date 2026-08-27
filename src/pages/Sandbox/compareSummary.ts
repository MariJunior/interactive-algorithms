import type { PlayerStats } from "@/hooks/useAlgorithmPlayer";

export interface CompareSideStats {
  name: string;
  totalSteps: number;
  comparisons: number;
  swaps: number;
}

/** Чистый хелпер итога сравнения — без React */
export function buildCompareSummary(
  left: CompareSideStats,
  right: CompareSideStats,
): string {
  const leftLine = formatSide(left);
  const rightLine = formatSide(right);

  if (left.totalSteps === right.totalSteps) {
    return `${leftLine}\n${rightLine}\nНичья по числу шагов.`;
  }

  const faster = left.totalSteps < right.totalSteps ? left : right;
  const slower = left.totalSteps < right.totalSteps ? right : left;
  const diffRatio = (slower.totalSteps - faster.totalSteps) / slower.totalSteps;
  const percent = Math.round(diffRatio * 100);

  return `${leftLine}\n${rightLine}\n${faster.name} быстрее на ${percent}% по числу шагов.`;
}

function formatSide(side: CompareSideStats): string {
  return `${side.name}: ${side.totalSteps} шагов, ${side.comparisons} сравн., ${side.swaps} перест.`;
}

/** Финальная статистика по всем шагам (не по текущему индексу плеера) */
export function finalStatsFromActions(
  actions: Array<{ action?: string }>,
): PlayerStats {
  return {
    comparisons: actions.filter((step) => step.action === "compare" || step.action === "select")
      .length,
    swaps: actions.filter((step) => step.action === "swap").length,
  };
}
