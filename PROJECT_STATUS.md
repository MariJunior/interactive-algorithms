# Project status

> Updated: 2026-08-27 21:02 (local)
> Branch: `main` · HEAD: `f1a1553` · ahead of `origin/main` by 2
> Working tree: **dirty** — Step 7 (Shiki / a11y / README / vercel) готов к ревью

## Current goals

- Ревью / commit **Step 7**, затем push по желанию.
- Дальше Steps 8–10 по staged delivery.
- Scope — «роскошный максимум».

## Completed (committed)

| Step | Commit | Что |
|------|--------|-----|
| 1–4 | … → `6a5b8e9` | 8 сортировок, viz, howItWorks, UX |
| 5 | `672e32e` | Linear/Binary Search + SearchVisualizer |
| 6 | `5fc3b70` | Sandbox `/sandbox?a=&b=` |
| 6b | `6e05a20` | Real-time elapsed timer (ms) |
| 6c | `f1a1553` | Sandbox: same category, moves, binary hint |

## In progress / uncommitted

**Step 7** — полировка:

- Shiki fine-grained в `CodeBlock` (`src/lib/shikiHighlighter.ts`)
- a11y: skip-link, tablist/tabpanel, accordion region, focus-visible, reduced-motion
- README актуализирован; `vercel.json` SPA rewrites; `index.html` lang=ru

Тесты: 73 passed. Build OK.

## Next steps (ordered)

1. Commit Step 7 после ревью / отмашки
2. Steps 8–10: каталог → CSS-арт/квиз → 3D
3. Фактический `npx vercel --prod` — вручную (MCP Vercel не авторизован)

## Key decisions

| Decision | Rationale |
|----------|-----------|
| Domain без React | Clean Architecture |
| Sandbox: same category only | Честное сравнение |
| `moves` = swap\|insert\|merge | Merge/Counting не эмитят swap |
| Shiki core + JS engine | Меньше бандл для Vite SPA |
| 3D в конце | Staged delivery |

## Known issues

- Push: `main` ahead of origin by 2 (+ Step 7 после commit).
- Chunk size warning на main bundle (~616 kB) — допустимо на этом этапе.
- Trees/graphs/3d — заготовки.

## References

- План: `algovisual_status_summary_c8adb029.plan.md`
- Remote: `git@github.com:MariJunior/interactive-algorithms.git`
