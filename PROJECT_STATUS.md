# Project status

> Updated: 2026-08-27 19:26 (local)
> Branch: `main` · Commit: `6a5b8e9`

## Current goals

- Закрыть этап поиска: Linear + Binary Search + `SearchVisualizer` (Step 5).
- Дальше по staged delivery: Sandbox → полировка/деплой → расширенный каталог → CSS-арт/квиз → 3D в конце.
- Режим: один шаг → ревью/commit → отмашка → следующий. Целевой scope — «роскошный максимум», не урезать roadmap.

## Completed this phase

- Все **8 сортировок** end-to-end: теория, 3 варианта кода, чистые TS-функции, генераторы шагов, тесты, визуализация через `SortPlaybackPanel`.
- `howItWorks` в аккордеоне для всех 8 сортировок.
- UX-полировка (`6a5b8e9`):
  - `nameRu`, бейджи, `Tooltip` / `InfoBadge`, tooltips для Big O / stable / inPlace;
  - prev/next через `getAdjacentAlgorithms`;
  - мобильный layout (overflow header, grid `minmax`, sticky opaque panels);
  - Home: разноцветные фоновые bars + анимированный scroll cue, выровненный по `--page-max-width` / `--page-padding`.
- Working tree clean; `main` синхронизирован с `origin/main`.
- Тесты: **55 passed** / 10 files (`npm test`).

## Key technical decisions

| Decision | Rationale | Files / ADR |
|----------|-----------|-------------|
| Domain в `src/algorithms/` без React | Clean Architecture; UI только рендерит `currentStep` | `src/algorithms/`, hooks runner/player |
| `SortPlaybackPanel` как composition root | Склейка generator → runner → player → viz | `src/components/visualizers/SortPlaybackPanel/` |
| Placeholder на Algorithm page, если нет генератора | Searching ещё без шагов | `hasSortingVisualization`, `Algorithm/index.tsx` |
| Scroll cue `right: calc(max(0px, (100% - page-max)/2) + page-padding)` | Ритм отступов как у контент-колонки | `Home.module.css` |
| 3D (R3F) — только в конце roadmap | Не отвлекаться до полного 2D-каталога | README, plan |

## Changed files (main)

Недавний UX-коммит и база сортировок (ключевое):

- `src/algorithms/sorting/*` — 8 алгоритмов + `*Steps` + тесты
- `src/components/visualizers/SortVisualizer|SortPlaybackPanel` — bar chart + playback
- `src/components/ui/{Tooltip,InfoBadge,PlaybackControls,Slider}` — UI primitives
- `src/data/algorithms.ts`, `badgeTooltips.ts` — meta, `nameRu`, adjacent nav
- `src/pages/Algorithm/*` — аккордеон, sticky, placeholder поиска
- `src/pages/Home/*` — hero bars + scroll cue
- `src/components/Layout/Layout.module.css` — mobile overflow fix
- `README.md` — статус проекта / roadmap

## Testing & verification

- [x] `npm test` — 55/55 passed (2026-08-27)
- [ ] Ручной просмотр Home (bars + scroll cue) на desktop / tablet / mobile
- [ ] `/algorithm/*` для всех 8 сортировок + placeholder на linear/binary-search

## Known issues

- Linear/Binary Search: meta + `nameRu` есть, **нет** кода/генераторов/`SearchVisualizer` — на странице placeholder.
- `/sandbox` — заглушка `<main>Sandbox</main>`.
- Shiki в зависимостях, в UI CodeBlock ещё не интегрирован как полноценная подсветка (по roadmap Step 7).
- Папки `algorithms/searching`, `trees`, `graphs` и `visualizers3d` — заготовки под будущие шаги.
- Windows + Git push: если agent не видит ssh-agent, нужен `GIT_SSH_COMMAND` / `core.sshCommand` на Windows OpenSSH (не Git bundled SSH).

## Rejected approaches (do not retry)

| Approach | Why it failed | Evidence |
|----------|---------------|----------|
| Лечить «съехавший» layout только padding’ами страниц | Корневая причина — overflow у header/Layout | `Layout.module.css` fix в UX-коммите |
| Позиционировать scroll cue через `clamp(...vw...)` от края viewport | Ломает ритм с `--page-padding` / колонкой | `Home.module.css` → формула от max-width |
| Push через дефолтный Git SSH на Windows без OpenSSH agent | Auth fails при живом агенте OpenSSH | session note; `GIT_SSH_COMMAND=ssh` |
| Делать 3D / полный каталог до Search + Sandbox | Нарушает staged delivery и ТЗ-порядок | plan Step 5→10 |

## Next steps (ordered)

1. **Step 5:** Linear Search + Binary Search — теория, 3 кода, TS, генераторы шагов, тесты, `SearchVisualizer`, проводка в Algorithm page (вместо placeholder).
2. **Step 6:** Sandbox `/sandbox?a=&b=` — side-by-side сравнение.
3. **Step 7:** Shiki, a11y, финальный адаптив, деплой Vercel; при необходимости обновить README под Search.
4. **Steps 8–10:** полный каталог → CSS-арт + квиз → 3D (R3F).

## References

- ТЗ: `c:\Users\mari_banana\Documents\GitHub\Перезапуск изучения алгоритмов.md`
- План/roadmap session: `c:\Users\mari_banana\.cursor\plans\algovisual_status_summary_c8adb029.plan.md`
- Устаревший roadmap (не источник истины): `c:\Users\mari_banana\.cursor\plans\algovisual_roadmap_6a8cc470.plan.md`
- Remote: `git@github.com:MariJunior/interactive-algorithms.git`
- Latest commit: `6a5b8e9` — `✨ feat(ui): polish catalog UX and home hero`
