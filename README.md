# AlgoVisual

**Интерактивный учебник по алгоритмам и структурам данных** — теория, код и пошаговая визуализация в одном месте.

Разбирай алгоритмы не по сухим формулам, а через анимацию, короткую теорию и код на JavaScript / TypeScript — от Big O до сортировок, поиска и сравнения в песочнице.

---

## Зачем это

Не справочник «прочитать и забыть», а **живая рабочая тетрадь**:

- смотришь, как алгоритм «думает» шаг за шагом;
- рядом — Big O, когда использовать / когда нет;
- три варианта кода: JS базовый, JS современный, TypeScript (подсветка Shiki);
- чистые реализации отдельно от UI — удобно читать и тестировать;
- песочница `/sandbox` — сравнение двух алгоритмов одной категории side-by-side.

---

## Текущее состояние

| Область | Статус |
|--------|--------|
| Лендинг `/`, учебник `/learn`, страницы алгоритмов | Готово |
| Big O + реестр: 8 сортировок + Linear/Binary Search | Готово |
| Сортировки: код, TS, генераторы, `SortVisualizer` | Готово |
| Секция «Как работает» в аккордеоне | Готово |
| Поиск + `SearchVisualizer` | Готово |
| Песочница `/sandbox?a=&b=` (same category, moves, timer) | Готово |
| Подсветка кода (Shiki), a11y-база, `vercel.json` | Готово |
| Полный каталог (деревья, графы, DP…), CSS-арт, квиз | В планах |
| 3D (React Three Fiber) | Финальный этап |

**Примеры:** `/algorithm/bubble-sort`, `/algorithm/merge-sort`, `/algorithm/binary-search`, `/sandbox?a=bubble-sort&b=insertion-sort`.

---

## Roadmap

1. ~~Оболочка, Big O, реестр, дизайн-система~~
2. ~~Первые 3 сортировки + живой визуализатор~~
3. ~~Секция «Как работает» в аккордеоне~~
4. ~~Остальные сортировки (Merge → Quick → Heap → Radix → Counting)~~
5. ~~Linear / Binary Search + отдельный визуализатор~~
6. ~~Песочница сравнения (`/sandbox?a=&b=`)~~
7. ~~Полировка: Shiki, a11y, адаптив, конфиг Vercel~~
8. Расширенный каталог: структуры данных, деревья, графы, DP, жадные, строки
9. CSS-арт на карточках + мини-квиз «Угадай сложность»
10. **3D-режим** для избранных алгоритмов

---

## Стек

| Слой | Технологии |
|------|------------|
| Сборка | Vite 8, TypeScript 6 |
| UI | React 19, React Router 7 |
| Анимации | Framer Motion 12 |
| Стили | CSS Modules + design tokens |
| Подсветка кода | Shiki 4 (fine-grained core + JS engine) |
| Тесты | Vitest 4, Testing Library, jsdom |
| Качество | ESLint 9, Prettier 3 |
| Деплой | Vercel (`vercel.json` SPA rewrites) |
| 3D (план) | Three.js + React Three Fiber + Drei |

---

## Архитектура

Clean Architecture в упрощённом виде для фронта:

```
src/
├── algorithms/          # Domain: чистый TS, генераторы шагов, без React
│   ├── sorting/
│   └── searching/
├── hooks/               # Application: runner + player
├── data/                # Метаданные и код для отображения
├── lib/                 # Инфра (Shiki highlighter singleton)
├── components/
│   ├── visualizers/     # Presentation: SortStep / SearchStep
│   └── ui/              # Глупые UI-контролы
└── pages/               # Composition / маршруты
```

Каждый алгоритм — в двух видах:

1. **чистая функция** — для тестов и проверки корректности;
2. **генератор шагов** (`*Steps`) — для визуализации.

Визуализатор **только рисует** текущий шаг, без алгоритмической логики внутри.

---

## Быстрый старт

Требования: **Node.js 20+** (рекомендуется LTS).

```bash
cd interactive-algorithms
npm install
npm run dev
```

Откроется http://localhost:5173.

---

## Деплой на Vercel

Проект — Vite SPA. В корне лежит `vercel.json` с rewrite всех путей на `/index.html` (deep links вроде `/algorithm/merge-sort` работают после деплоя).

Варианты:

1. **CLI:** `npx vercel` (preview) / `npx vercel --prod` (production).
2. **Dashboard:** Import Git-репозитория → Framework Preset: Vite → Deploy.

Framework detection у Vercel для Vite обычно сам выставляет `npm run build` и output `dist`.

---

## Команды

| Команда | Что делает |
|---------|------------|
| `npm run dev` | Dev-сервер Vite с HMR |
| `npm run build` | Проверка типов (`tsc`) + production-сборка |
| `npm run preview` | Локальный просмотр production-сборки |
| `npm test` | Юнит-тесты один раз (Vitest) |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run test:ui` | Vitest UI |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint с автофиксом |
| `npm run format:check` | Проверка Prettier |
| `npm run format:fix` | Форматирование Prettier |
| `npm run check` | lint + format:check |
| `npm run check:fix` | автофикс lint + format |
| `npm run clean` | Удалить `dist` и `node_modules` |

---

## Страницы

| Путь | Назначение |
|------|------------|
| `/` | Лендинг |
| `/learn` | Big O + каталог алгоритмов с фильтрами |
| `/algorithm/:slug` | Теория, визуализация, код |
| `/sandbox` | Сравнение двух алгоритмов одной категории |

Примеры slug: `bubble-sort`, `merge-sort`, `counting-sort`, `linear-search`, `binary-search`.

---

## Лицензия

Private / учебный портфолио-проект. При публикации на GitHub лицензию можно добавить отдельно.
