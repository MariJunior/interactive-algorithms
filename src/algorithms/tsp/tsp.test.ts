import { describe, expect, it } from "vitest";
import { createDemoTspCities, DEMO_TSP_START } from "./demo";
import {
  tspBruteForce,
  tspBruteForceSteps,
  tspNearestNeighbor,
  tspNearestNeighborSteps,
  tourLength,
} from "./tsp";

describe("tspBruteForce", () => {
  it("перебирает (n-1)! туров и находит оптимум на демо", () => {
    const cities = createDemoTspCities();
    const result = tspBruteForce(cities, DEMO_TSP_START);
    expect(result.toursChecked).toBe(24);
    expect(result.path[0]).toBe(DEMO_TSP_START);
    expect(result.path).toHaveLength(cities.length);
    expect(result.length).toBe(tourLength(cities, result.path));
  });

  it("шаги заканчиваются тем же оптимумом", () => {
    const cities = createDemoTspCities();
    const expected = tspBruteForce(cities, DEMO_TSP_START);
    const last = Array.from(tspBruteForceSteps(cities, DEMO_TSP_START)).at(-1);
    expect(last?.action).toBe("done");
    expect(last?.bestLength).toBe(expected.length);
    expect(last?.bestPath).toEqual(expected.path);
  });
});

describe("tspNearestNeighbor", () => {
  it("строит полный тур от старта", () => {
    const cities = createDemoTspCities();
    const result = tspNearestNeighbor(cities, DEMO_TSP_START);
    expect(result.path[0]).toBe(DEMO_TSP_START);
    expect(result.path).toHaveLength(cities.length);
    expect(new Set(result.path).size).toBe(cities.length);
  });

  it("эвристика не лучше полного перебора", () => {
    const cities = createDemoTspCities();
    const brute = tspBruteForce(cities, DEMO_TSP_START);
    const nn = tspNearestNeighbor(cities, DEMO_TSP_START);
    expect(nn.length).toBeGreaterThanOrEqual(brute.length);
  });

  it("шаги заканчиваются done", () => {
    const last = Array.from(
      tspNearestNeighborSteps(createDemoTspCities(), DEMO_TSP_START),
    ).at(-1);
    expect(last?.action).toBe("done");
    expect(last?.path).toHaveLength(5);
  });
});
