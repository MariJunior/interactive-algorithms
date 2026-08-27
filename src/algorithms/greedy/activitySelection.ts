import type { ActivityGreedyStep, ActivityItem } from "@/algorithms/types";

/** Жадный выбор: сортировка по finish ↑, берём если start ≥ lastFinish */
export function activitySelection(activities: ActivityItem[]): string[] {
  const sorted = [...activities].sort(
    (a, b) => a.finish - b.finish || a.start - b.start,
  );
  const selected: string[] = [];
  let lastFinish = -Infinity;

  for (const activity of sorted) {
    if (activity.start >= lastFinish) {
      selected.push(activity.id);
      lastFinish = activity.finish;
    }
  }

  return selected;
}

export function* activitySelectionSteps(
  activities: ActivityItem[],
): Generator<ActivityGreedyStep> {
  const sorted = [...activities].sort(
    (a, b) => a.finish - b.finish || a.start - b.start,
  );
  const orderIds = sorted.map((a) => a.id);

  yield {
    kind: "activity",
    action: "sort",
    activities: [...activities],
    orderIds,
    selectedIds: [],
    lastFinish: -Infinity,
    formula: "Сортируем по времени окончания ↑",
    message: "Задача: выбрать максимум непересекающихся активностей",
  };

  const selectedIds: string[] = [];
  let lastFinish = -Infinity;

  for (const activity of sorted) {
    yield {
      kind: "activity",
      action: "consider",
      activities: [...activities],
      orderIds,
      selectedIds: [...selectedIds],
      consideringId: activity.id,
      lastFinish,
      formula: `Смотрим ${activity.label}: [${activity.start}, ${activity.finish})`,
      message:
        lastFinish === -Infinity
          ? `Первая по окончанию — кандидат ${activity.label}`
          : `Свободно с ${lastFinish}? start=${activity.start}`,
    };

    if (activity.start >= lastFinish) {
      selectedIds.push(activity.id);
      lastFinish = activity.finish;
      yield {
        kind: "activity",
        action: "take",
        activities: [...activities],
        orderIds,
        selectedIds: [...selectedIds],
        consideringId: activity.id,
        lastFinish,
        formula: `Берём ${activity.label} → lastFinish=${lastFinish}`,
        message: `Совместима — добавляем в расписание`,
      };
    } else {
      yield {
        kind: "activity",
        action: "skip",
        activities: [...activities],
        orderIds,
        selectedIds: [...selectedIds],
        consideringId: activity.id,
        lastFinish,
        formula: `${activity.label} пересекается (start < ${lastFinish})`,
        message: `Пропускаем ${activity.label}`,
      };
    }
  }

  yield {
    kind: "activity",
    action: "done",
    activities: [...activities],
    orderIds,
    selectedIds: [...selectedIds],
    lastFinish,
    formula: `Выбрано: ${selectedIds.length}`,
    message: `Готово: ${selectedIds.length} активностей`,
  };
}
