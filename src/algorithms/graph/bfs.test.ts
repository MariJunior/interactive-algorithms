import { describe, expect, it } from "vitest";
import { bfs, bfsSteps } from "./bfs";
import { createDemoGraph, DEMO_GRAPH_START, buildAdjacency } from "./demoGraph";
import { dfs, dfsSteps } from "./dfs";

describe("buildAdjacency", () => {
  it("строит неориентированный список смежности с сортировкой", () => {
    const adj = buildAdjacency(createDemoGraph());
    expect(adj.get("A")).toEqual(["B", "C"]);
    expect(adj.get("E")).toEqual(["B", "F"]);
  });
});

describe("bfs", () => {
  it("обходит demo-граф в порядке очереди", () => {
    expect(bfs(createDemoGraph(), DEMO_GRAPH_START)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
    ]);
  });

  it("возвращает [] для неизвестной вершины", () => {
    expect(bfs(createDemoGraph(), "Z")).toEqual([]);
  });
});

describe("bfsSteps", () => {
  it("финальный visitOrder совпадает с bfs()", () => {
    const graph = createDemoGraph();
    const steps = Array.from(bfsSteps(graph, DEMO_GRAPH_START));
    const last = steps.at(-1);

    expect(last?.action).toBe("done");
    expect(last?.visitOrder).toEqual(bfs(graph, DEMO_GRAPH_START));
  });

  it("не мутирует исходный граф", () => {
    const graph = createDemoGraph();
    const edgesBefore = JSON.stringify(graph.edges);
    Array.from(bfsSteps(graph, "B"));
    expect(JSON.stringify(graph.edges)).toBe(edgesBefore);
  });
});

describe("dfs", () => {
  it("обходит demo-граф в порядке стека", () => {
    // Соседи A: B, C → в стек reverse → pop даёт B первым
    expect(dfs(createDemoGraph(), DEMO_GRAPH_START)).toEqual([
      "A",
      "B",
      "D",
      "E",
      "F",
      "C",
      "G",
    ]);
  });
});

describe("dfsSteps", () => {
  it("финальный visitOrder совпадает с dfs()", () => {
    const graph = createDemoGraph();
    const steps = Array.from(dfsSteps(graph, DEMO_GRAPH_START));
    const last = steps.at(-1);

    expect(last?.action).toBe("done");
    expect(last?.visitOrder).toEqual(dfs(graph, DEMO_GRAPH_START));
  });
});
