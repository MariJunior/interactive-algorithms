import type { TspCity } from "@/algorithms/types";

/** 5 городов — (5-1)! = 24 тура при фиксированном старте, удобно для playback */
export function createDemoTspCities(): TspCity[] {
  return [
    { id: "A", label: "A", x: 70, y: 50 },
    { id: "B", label: "B", x: 220, y: 40 },
    { id: "C", label: "C", x: 330, y: 110 },
    { id: "D", label: "D", x: 280, y: 210 },
    { id: "E", label: "E", x: 90, y: 200 },
  ];
}

export const DEMO_TSP_START = "A";
