import { describe, expect, it } from "vitest";
import {
  createDemoSetCoverCandidates,
  createDemoSetCoverUniverse,
} from "./demo";
import { setCover, setCoverSteps } from "./setCover";

describe("setCover", () => {
  it("жадно покрывает демо-универсум", () => {
    const selected = setCover(
      createDemoSetCoverUniverse(),
      createDemoSetCoverCandidates(),
    );
    expect(selected).toEqual(["s1", "s2", "s3", "s5"]);
  });

  it("шаги заканчиваются тем же набором", () => {
    const universe = createDemoSetCoverUniverse();
    const candidates = createDemoSetCoverCandidates();
    const last = Array.from(setCoverSteps(universe, candidates)).at(-1);
    expect(last?.action).toBe("done");
    expect(last?.selectedIds).toEqual(setCover(universe, candidates));
    expect(last?.uncoveredIds).toEqual([]);
  });
});
