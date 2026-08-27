import { describe, expect, it } from "vitest";
import { climbingStairs, climbingStairsSteps } from "./climbingStairs";
import { fibonacci, fibonacciSteps } from "./fibonacci";

describe("fibonacci", () => {
  it("считает известные значения", () => {
    expect(fibonacci(0)).toBe(0);
    expect(fibonacci(1)).toBe(1);
    expect(fibonacci(7)).toBe(13);
    expect(fibonacci(10)).toBe(55);
  });

  it("шаги заканчиваются тем же ответом", () => {
    for (const n of [0, 1, 5, 8]) {
      const last = Array.from(fibonacciSteps(n)).at(-1);
      expect(last?.action).toBe("done");
      expect(last?.result).toBe(fibonacci(n));
    }
  });
});

describe("climbingStairs", () => {
  it("считает известные значения", () => {
    expect(climbingStairs(1)).toBe(1);
    expect(climbingStairs(2)).toBe(2);
    expect(climbingStairs(3)).toBe(3);
    expect(climbingStairs(5)).toBe(8);
  });

  it("шаги совпадают с чистой функцией", () => {
    for (const n of [1, 2, 4, 7]) {
      const last = Array.from(climbingStairsSteps(n)).at(-1);
      expect(last?.result).toBe(climbingStairs(n));
    }
  });

  it("связан с Fibonacci: ways(n) = F(n+1)", () => {
    // F(1)=1,F(2)=1,F(3)=2,F(4)=3,F(5)=5,F(6)=8 → ways(5)=8=F(6)
    expect(climbingStairs(5)).toBe(fibonacci(6));
  });
});
