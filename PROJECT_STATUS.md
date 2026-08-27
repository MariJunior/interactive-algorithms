# Project status

> Updated: 2026-08-27 23:25 (local)
> Branch: `main` · HEAD: `0b09e5d` · ahead of `origin/main` by 3+
> Working tree: **dirty** — Step 8b (tree traversals) готов к ревью

## Current goals

- Ревью / commit **Step 8b** (деревья: Preorder / Inorder / Postorder).
- Дальше: DP / greedy / strings → Step 9 → Step 10.
- Scope — «роскошный максимум»; одна вертикаль за шаг + понятные подписи задачи.

## Completed (committed)

| Step | Commit | Что |
|------|--------|-----|
| 1–7 | … → `dd256f8` | Сортировки, поиск, sandbox, polish |
| 8 | `0b09e5d` | BFS/DFS + GraphVisualizer + UX (задача, V/E) |

## In progress / uncommitted

**Step 8b** — обходы дерева:

- Domain: `TreeStep`, preorder/inorder/postorder + tests
- UI: `TreeVisualizer` + `TreePlaybackPanel` (задача, правило, легенда)
- Sandbox: категория tree на общем BST-демо
- Подсказки Big O: n / h

## Next steps (ordered)

1. Commit Step 8b после ревью
2. Step 8c: DP или greedy или strings
3. Step 9: CSS-арт + квиз; Step 10: 3D

## Key decisions

| Decision | Rationale |
|----------|-----------|
| Три обхода на одном BST | Как BFS↔DFS: сравнимый порядок на одном входе |
| `descend`→comparisons, `visit`→moves | Единые метрики плеера |
| Формула обхода в UI | «В том же духе», что задача у графов |

## References

- План: `algovisual_status_summary_c8adb029.plan.md`
- Remote: `git@github.com:MariJunior/interactive-algorithms.git`
