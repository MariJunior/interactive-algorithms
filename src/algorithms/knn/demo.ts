import type { KnnPoint } from "@/algorithms/types";

/** Учебный 2D-набор двух классов (как «апельсины / грейпфруты» в книге) */
export function createDemoKnnPoints(): KnnPoint[] {
  return [
    { id: "p1", x: 80, y: 70, label: "A" },
    { id: "p2", x: 110, y: 95, label: "A" },
    { id: "p3", x: 95, y: 130, label: "A" },
    { id: "p4", x: 140, y: 80, label: "A" },
    { id: "p5", x: 160, y: 120, label: "A" },
    { id: "p6", x: 260, y: 160, label: "B" },
    { id: "p7", x: 290, y: 140, label: "B" },
    { id: "p8", x: 310, y: 190, label: "B" },
    { id: "p9", x: 240, y: 200, label: "B" },
    { id: "p10", x: 280, y: 210, label: "B" },
  ];
}

/** Запрос по умолчанию — в «спорной» зоне между кластерами */
export const DEMO_KNN_QUERY = { x: 200, y: 140 };

export const DEMO_KNN_K = 3;
