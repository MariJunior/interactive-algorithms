import { describe, expect, it } from "vitest";
import { createDemoGraph, DEMO_GRAPH_START } from "./demoGraph";
import { dijkstra, dijkstraSteps } from "./dijkstra";

describe("dijkstra", () => {
  it("считает кратчайшие расстояния на демо-графе от A", () => {
    const { distances, order } = dijkstra(createDemoGraph(), DEMO_GRAPH_START);
    expect(order).toEqual(["A", "B", "E", "C", "D", "F", "G"]);
    expect(distances).toEqual({
      A: 0,
      B: 2,
      C: 4,
      D: 5,
      E: 3,
      F: 6,
      G: 9,
    });
  });

  it("шаги заканчиваются теми же расстояниями", () => {
    const graph = createDemoGraph();
    const expected = dijkstra(graph, DEMO_GRAPH_START);
    const last = Array.from(dijkstraSteps(graph, DEMO_GRAPH_START)).at(-1);
    expect(last?.action).toBe("done");
    expect(last?.distances).toEqual(expected.distances);
    expect(last?.visitOrder).toEqual(expected.order);
  });

  it("есть шаги relax при улучшении оценки", () => {
    const steps = Array.from(dijkstraSteps(createDemoGraph(), DEMO_GRAPH_START));
    expect(steps.some((s) => s.action === "relax")).toBe(true);
  });
});
