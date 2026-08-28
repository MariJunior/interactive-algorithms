# Step 9 — CSS-арт на карточках + квиз «Угадай сложность»

> Спека внедрения. После закрытия Step 9 файл можно удалить (как `CATALOG_EXPANSION.md`); backlog вне скоупа остаётся в Cursor-плане.

## Цель

1. **CSS-арт на карточках** — у каждого алгоритма узнаваемое **pure-CSS** превью (не общее на категорию), в духе алгоритмического CSS-арта.
2. **Мини-квиз** — закрепить Big O: по названию/подсказке угадать среднюю сложность.

## Контекст

- Сейчас `AlgorithmCard` рисует `PreviewPlaceholder` **по категории** (SVG). В коде раньше был комментарий: заменить на уникальные иллюстрации **по алгоритму**.
- На `/learn` уже есть секция Big O (`BIG_O_ITEMS`) — естественное место для квиза сразу после неё.
- Domain без React; UI в `components` / `pages`. Clean Architecture.
- Портфолио-контекст («алгоритмическая генерация в CSS»): Houdini Paint Worklets, **pure CSS сортировки** (`var` + `@keyframes` + `animation-delay`), CSS Grid / клеточные автоматы. Для карточек выбираем одну линию — см. ниже.

## Эстетика CSS-арта (выбор темы)

**Выбрано: Pure CSS algorithm demos** — визуализация «идеи» алгоритма только средствами CSS:

- custom properties (`--i`, `--h`, `--delay`, …);
- `@keyframes` + staggered `animation-delay`;
- по возможности **CSS Grid** как «поле» (ячейки DP, бакеты хеша, сетка k-NN) — без JS-логики внутри арта.

Почему не остальные варианты в Step 9:

| Тема | Вердикт |
|------|---------|
| Pure CSS + keyframes/delay (+ Grid как холст) | **В скоупе** — лёгко, узнаваемо, сильный сигнал в портфолио |
| CSS Houdini (Paint Worklet) | **Вне скоупа Step 9** — отдельный lab/эксперимент позже |
| Полноценный Game of Life / maze generator | **Вне скоупа** как отдельная демка; на карточке допустим лишь *намёк* сеткой |

Сортировки — витрина темы: **каждое превью кодирует идею алгоритма** (swap соседей, scan+min, insert ключа, merge половин, partition вокруг pivot, sift-down, бакеты radix, count→output). Не «анимация ради анимации». Остальные категории — тот же принцип (узнаваемый шаг), другой визуальный язык.

## Функциональность

### A. Превью-арт карточки

| Требование | Решение |
|------------|---------|
| Уникальность | Реестр `slug → Preview` (не `category → Preview`) |
| Техника | **Pure CSS**: markup (`div`/`span`) + CSS Modules; `var` + `@keyframes` + `animation-delay`; Grid где уместно |
| SVG | Только fallback / редкая геометрия, если pure CSS нечитаем в 80×48 |
| Цвет | Как сейчас: `--cat-color` от категории |
| Fallback | Если слага нет в реестре — текущий категорийный SVG |
| A11y | `aria-hidden` на декоративном превью; `prefers-reduced-motion: reduce` → статичный кадр (без loop) |
| Motion | Idle-loop на арте **разрешён и желателен** (pure CSS); hover карточки (Framer) не трогаем |

**Не в скоупе Step 9:** Houdini worklets, JS-driven анимация превью, Three.js, уникальный арт на `/algorithm/:slug`.

### B. Квиз «Угадай сложность»

| Требование | Решение |
|------------|---------|
| Маршрут | Секция на `/learn` после Big O (без отдельного URL в v1) |
| Вопрос | Название алгоритма (+ опционально `shortDescription`); **без** показа Big O |
| Ответ | Выбор из 4 вариантов нотаций; правильный = `complexity.average` |
| Пул | Все алгоритмы из `ALGORITHMS`; варианты — правильный + 3 случайных из набора уникальных average по каталогу |
| UX | Счёт (верно / всего), кнопка «Дальше», после ответа — кратко верно/неверно + ссылка на `/algorithm/:slug` |
| Состояние | Локальный React state; без бэкенда и localStorage в v1 |
| Domain | Чистые функции: `buildQuizQuestion(algorithms, rng)`, `checkAnswer(question, choice)` в `src/quiz/` (без React) |

**Не в скоупе:** таймер, рейтинг, несколько раундов с сохранением, скрытие сложности на карточке во время квиза.

## Архитектура (слои)

```
src/
├── quiz/                         # Domain квиза (чистый TS)
│   ├── types.ts
│   ├── buildQuestion.ts
│   └── buildQuestion.test.ts
├── components/
│   ├── AlgorithmCard/            # подключает Preview по slug
│   ├── AlgorithmPreview/         # реестр + pure-CSS арт (новый)
│   │   ├── index.tsx
│   │   ├── AlgorithmPreview.module.css
│   │   └── arts/                 # по категории / slug; анимации в CSS
│   └── ComplexityQuiz/           # Presentation квиза (новый)
│       ├── index.tsx
│       └── ComplexityQuiz.module.css
└── pages/Learn/                  # вставка секции квиза
```

## Пошаговый план внедрения

- [x] **9.1** Спека `STEP_9.md` — scope + тема Pure CSS
- [x] **9.2** `AlgorithmPreview`: реестр по slug, fallback; **pure-CSS арт для sorting** (8 шт., витрина темы)
- [x] **9.3** Pure-CSS арт для **searching + tree + graph**
- [ ] **9.4** Pure-CSS арт для **dp + greedy + string + data-structures + np-complete + ml**
- [ ] **9.5** Domain квиза (`src/quiz`) + тесты
- [ ] **9.6** UI `ComplexityQuiz` + секция на `/learn`; README; `npm test` / `npm run build`

После 9.6 — удалить `STEP_9.md` (по желанию), обновить `PROJECT_STATUS.md` / Cursor-план → Step 10.

## Критерии готовности

- На `/learn` у разных алгоритмов одной категории превью визуально различаются.
- Превью сортировок: по анимации можно угадать *какой* это алгоритм (не общий pulse).
- Техника — **pure CSS** (`var` / keyframes), без JS-анимации арта.
- Учтён `prefers-reduced-motion`.
- Квиз даёт ≥1 вопрос, считает score, не показывает правильный Big O до ответа.
- Domain квиза покрыт unit-тестами; build зелёный.

## Вне скоупа (не трогать)

- Houdini Paint Worklets / полноценный Game of Life или maze generator как отдельная страница.
- Backlog из плана: open addressing / Robin Hood; A*, Bellman–Ford, Floyd–Warshall; Held–Karp TSP; k-NN regression / KD-tree; Step 10 (R3F).
