# Project status

> Updated: 2026-08-27 23:07 (local)
> Branch: `main` · HEAD: `dd256f8` · ahead of `origin/main` by 3
> Working tree: **dirty** — Step 8 (BFS/DFS graphs) готов к ревью

## Current goals

- Ревью / commit **Step 8** (графы: BFS + DFS).
- Дальше: деревья / DP / greedy / strings → Step 9 (CSS-арт+квиз) → Step 10 (3D).
- Scope — «роскошный максимум»; Step 8 = одна вертикаль категории (как Step 5).

## Completed (committed)

| Step | Commit | Что |
|------|--------|-----|
| 1–6c | … → `f1a1553` | Сортировки, поиск, sandbox, timer, UX |
| 7 | `dd256f8` | Shiki, a11y, README, vercel.json |

## In progress / uncommitted

**Step 8** — графы:

- Domain: `GraphStep`, `bfs`/`dfs` + generators + tests
- UI: `GraphVisualizer` + `GraphPlaybackPanel`
- Каталог: meta + code; Learn покажет фильтр «Графы»
- Sandbox: категория graph, общий граф + старт, сравнение BFS↔DFS

Тесты: 80 passed. Build OK.

## Next steps (ordered)

1. Commit Step 8 после ревью
2. Step 8b+ или Step 9: деревья / DP / … или CSS-арт+квиз (уточнить приоритет)
3. Push / Vercel deploy — по желанию

## Key decisions

| Decision | Rationale |
|----------|-----------|
| Step 8 = BFS+DFS, не весь каталог сразу | Staged delivery, как Step 5 |
| Общий demo-граф в sandbox | Честное сравнение порядка обхода |
| `explore`→comparisons, `visit`→moves | Метрики плеера без ломки API |

## Known issues

- Push: ahead of origin (Step 7 + Step 8 после commit).
- Trees / DP / greedy / string — ещё пустые категории.
- Chunk size warning на main bundle.

## References

- План: `algovisual_status_summary_c8adb029.plan.md`
- Remote: `git@github.com:MariJunior/interactive-algorithms.git`
