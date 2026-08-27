# Project status

> Updated: 2026-08-27 20:22 (local)
> Branch: `main` · HEAD: `6e05a20` · ahead of `origin/main` by 1 (timer commit)

## Current goals

- Закрыть мелкие UX-фиксы песочницы (в working tree) → commit.
- Дальше **Step 7:** Shiki, a11y, финальный адаптив, README, деплой Vercel.
- Режим: staged delivery. Scope — «роскошный максимум».

## Completed (committed)

| Step | Commit | Что |
|------|--------|-----|
| 1–4 | … → `6a5b8e9` | 8 сортировок, viz, howItWorks, UX каталога |
| 5 | `672e32e` | Linear/Binary Search + SearchVisualizer |
| 6 | `5fc3b70` | Sandbox `/sandbox?a=&b=` |
| 6b | `6e05a20` | Real-time elapsed timer (ms) + итог по времени |

Тесты на момент таймера: 73 passed.

## In progress / uncommitted

Sandbox UX fixes (эта сессия):

- Hint про Binary Search — только если binary выбран
- Метрика **Перемещений** (`swap|insert|merge`) вместо ложных «Перестановок: 0» у Merge/Counting
- Сравнение **только внутри одной категории** + табы группы

## Next steps (ordered)

1. Commit sandbox UX fixes (после ревью).
2. **Step 7:** Shiki, a11y, адаптив, README, Vercel.
3. **Steps 8–10:** полный каталог → CSS-арт + квиз → 3D.

## Key decisions

| Decision | Rationale |
|----------|-----------|
| Domain без React | Clean Architecture |
| Отдельный `SearchStep` | Не смешивать с SortStep |
| Sandbox: same category only | Иначе apples-to-oranges (input/target/метрики) |
| `moves` = swap\|insert\|merge | Merge/Counting не эмитят swap |
| 3D в конце | Staged delivery |

## Known issues

- Timer commit ещё не на `origin` (ahead by 1) — push по желанию.
- Shiki в CodeBlock не подключён (Step 7).
- Trees/graphs/3d — заготовки.

## References

- План: `algovisual_status_summary_c8adb029.plan.md`
- ТЗ: `Перезапуск изучения алгоритмов.md`
- Remote: `git@github.com:MariJunior/interactive-algorithms.git`
