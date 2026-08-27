# Project status

> Updated: 2026-08-27 19:52 (local)
> Branch: `main` · Last commit: `6a5b8e9` · Steps 5–6 **в working tree, не закоммичены**

## Current goals

- Ревью → commit Steps 5–6 (Search + Sandbox).
- Дальше: Step 7 (Shiki, a11y, адаптив, README, Vercel) → каталог → CSS-арт/квиз → 3D.
- Режим: один шаг → ревью/commit → отмашка → следующий. Scope — «роскошный максимум».

## Completed this phase

- Steps 1–4 на `main` (8 сортировок + UX).
- **Step 5 (принят):** Linear/Binary + `SearchVisualizer` / `SearchPlaybackPanel`.
- **Step 6 (к ревью):** `/sandbox?a=&b=` side-by-side, общий input, sync playback, итог сравнения.
- Тесты: **72 passed** / 13 files.

## Key technical decisions

| Decision | Rationale |
|----------|-----------|
| Domain без React | Clean Architecture |
| `*PlaybackPanel` composition root | generator → runner → player → viz |
| Отдельный `SearchStep` | Не смешивать с `SortStep` |
| Sandbox: 2× player + общий speed/input | Как wireframe ТЗ |
| Binary в sandbox — sorted-копия | Предусловие без ломки linear |
| 3D в конце | Staged delivery |

## Next steps (ordered)

1. Ревью + commit Steps 5–6.
2. **Step 7:** Shiki, a11y, адаптив, README, Vercel.
3. **Steps 8–10:** полный каталог → CSS-арт + квиз → 3D.

## References

- План: `algovisual_status_summary_c8adb029.plan.md`
- ТЗ: `Перезапуск изучения алгоритмов.md`
- Remote: `git@github.com:MariJunior/interactive-algorithms.git`
