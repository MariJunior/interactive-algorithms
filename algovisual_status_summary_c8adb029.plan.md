---
name: AlgoVisual status summary
overview: "Steps 1–6c на main (f1a1553). Step 7 готов в working tree — ревью/commit. Далее Steps 8–10."
todos:
  - id: wire-visualizer
    content: "Step 1/10: SortVisualizer + PlaybackControls + интеграция на /algorithm/:slug"
    status: completed
  - id: how-it-works
    content: "Step 2/10: howItWorks в AlgorithmMeta + секция аккордеона"
    status: completed
  - id: merge-sort-cycle
    content: "Step 3/10: Merge Sort — теория + 3 варианта кода + TS + генератор + тесты"
    status: completed
  - id: rest-sorts
    content: "Step 4: Quick/Heap/Radix/Counting + UX-полировка каталога"
    status: completed
  - id: search-algorithms
    content: "Step 5: Linear/Binary Search + SearchVisualizer"
    status: completed
  - id: sandbox
    content: "Step 6: Sandbox /sandbox?a=&b= + real-time timer"
    status: completed
  - id: sandbox-ux-fixes
    content: "Step 6c: same-category, moves metric, binary hint — f1a1553"
    status: completed
  - id: polish-deploy
    content: "Step 7: Shiki, a11y, README, vercel.json — в working tree"
    status: completed
  - id: full-catalog
    content: "Step 8: полный каталог — структуры данных, деревья, графы, DP, жадные, строки"
    status: pending
  - id: css-art-quiz
    content: "Step 9: CSS-арт на карточках + мини-квиз «Угадай сложность»"
    status: pending
  - id: three-d
    content: "Step 10: 3D-режим (R3F) — bar chart, деревья, графы"
    status: pending
isProject: false
---

# Состояние AlgoVisual vs ТЗ и roadmap

> Актуализировано: 2026-08-27 21:02 · HEAD `f1a1553`, Step 7 в working tree.

**Режим:** staged delivery — один шаг → ревью/commit → отмашка → следующий.

См. `PROJECT_STATUS.md` и план в `.cursor/plans/algovisual_status_summary_c8adb029.plan.md`.

## Порядок шагов

1–6c. ~~Done~~
7. Shiki / a11y / README / vercel.json ← **готово к ревью**
8–10. Полный каталог → CSS-арт + квиз → 3D
