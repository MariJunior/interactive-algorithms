import { formatElapsedMs, type PlayerStats } from "@/hooks/useAlgorithmPlayer";

export interface CompareSideStats {
  name: string;
  totalSteps: number;
  comparisons: number;
  moves: number;
  /** Wall-clock время воспроизведения до финиша, ms */
  elapsedMs: number;
}

/** Чистый хелпер итога сравнения — без React */
export function buildCompareSummary(
  left: CompareSideStats,
  right: CompareSideStats,
): string {
  const leftLine = formatSide(left);
  const rightLine = formatSide(right);
  const lines = [leftLine, rightLine];

  lines.push(verdictByMetric("шагам", left, right, (side) => side.totalSteps));
  lines.push(verdictByMetric("времени", left, right, (side) => side.elapsedMs));

  return lines.join("\n");
}

function formatSide(side: CompareSideStats): string {
  return `${side.name}: ${side.totalSteps} шагов, ${side.comparisons} сравн., ${side.moves} перем., ${formatElapsedMs(side.elapsedMs)}`;
}

function verdictByMetric(
  label: string,
  left: CompareSideStats,
  right: CompareSideStats,
  metric: (side: CompareSideStats) => number,
): string {
  const leftValue = metric(left);
  const rightValue = metric(right);

  if (leftValue === rightValue) {
    return `Ничья по ${label}.`;
  }

  const faster = leftValue < rightValue ? left : right;
  const slowerValue = Math.max(leftValue, rightValue);
  const fasterValue = Math.min(leftValue, rightValue);
  const percent =
    slowerValue === 0 ? 0 : Math.round(((slowerValue - fasterValue) / slowerValue) * 100);

  return `${faster.name} быстрее на ${percent}% по ${label}.`;
}

/** Финальная статистика по всем шагам (не по текущему индексу плеера) */
export function finalStatsFromActions(
  actions: Array<{ action?: string }>,
): PlayerStats {
  return {
    comparisons: actions.filter(
      (step) =>
        step.action === "compare" ||
        step.action === "select" ||
        step.action === "explore" ||
        step.action === "descend" ||
        step.action === "init",
    ).length,
    moves: actions.filter(
      (step) =>
        step.action === "swap" ||
        step.action === "insert" ||
        step.action === "merge" ||
        step.action === "visit" ||
        step.action === "compute",
    ).length,
  };
}
