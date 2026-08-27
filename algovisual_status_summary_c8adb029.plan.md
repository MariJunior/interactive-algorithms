---
name: AlgoVisual status summary
overview: "Steps 1–6 + timer закоммичены на main. Дальше Step 7 (Shiki/a11y/Vercel). Sandbox UX-фиксы в working tree."
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
    content: "Sandbox UX: same-category, moves metric, binary hint — в working tree"
    status: pending
  - id: polish-deploy
    content: "Step 7: Shiki, a11y, финальный адаптив, README, деплой Vercel"
    status: pending
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

> Актуализировано: 2026-08-27 20:22 · сверка с `git log` (`672e32e`, `5fc3b70`, `6e05a20`).

**Режим:** staged delivery — один шаг → ревью/commit → отмашка → следующий.

**Источник требований:** [Перезапуск изучения алгоритмов.md](c:\Users\mari_banana\Documents\GitHub\Перезапуск изучения алгоритмов.md). Handoff: `PROJECT_STATUS.md`.

```mermaid
flowchart LR
  subgraph done [Закоммичено]
    Sorts["8 сортировок"]
    Search["Linear/Binary"]
    Sandbox["Sandbox + timer"]
  end
  subgraph wip [Working tree]
    Fixes["Sandbox UX fixes"]
  end
  subgraph next [Следующий крупный шаг]
    Polish["Step 7: Shiki / a11y / Vercel"]
  end
  Sorts --> Search --> Sandbox --> Fixes --> Polish
```

---

## Коммиты (факты)

- `672e32e` — ✨ feat(searching): Linear/Binary + SearchVisualizer
- `5fc3b70` — ✨ feat(sandbox): side-by-side comparison
- `6e05a20` — ✨ feat(player): real-time elapsed timer (ms)
- `main` ahead of `origin/main` by 1 (timer) — остальное уже на remote

---

## Порядок шагов

1–6. ~~Done (в т.ч. timer)~~
6+. Sandbox UX fixes — **код готов → ревью/commit**
7. Shiki, адаптив, a11y, README, Vercel ← после отмашки
8–10. Полный каталог → CSS-арт + квиз → 3D

Целевой scope — **роскошный максимум**.

---

## Решения

| Решение | Зачем |
|---------|--------|
| Same category only в sandbox | Честное сравнение на одном типе задачи |
| `moves` = swap\|insert\|merge | Merge/Counting не делают swap |
| Binary hint только при binary | Не засорять UI сортировок |
| 3D в конце | ТЗ / staged delivery |

---

## Чек-лист

### Сейчас
- [ ] Ревью sandbox UX fixes
- [ ] Commit
- [ ] Push timer (+ fixes) при желании

### Step 7
- [ ] Shiki в CodeBlock
- [ ] a11y + финальный адаптив
- [ ] README
- [ ] Vercel

### Steps 8–10
- [ ] Полный каталог / CSS-арт+квиз / 3D
