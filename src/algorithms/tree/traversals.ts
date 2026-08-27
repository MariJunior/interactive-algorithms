import type { BinaryTree, TreeStep } from "@/algorithms/types";
import { getTreeNode } from "./demoTree";

type VisitMoment = "pre" | "in" | "post";

/**
 * Общий каркас рекурсивного обхода с эмитом шагов.
 * moment — когда записываем узел: до детей / между / после.
 */
function* traverseSteps(
  tree: BinaryTree,
  moment: VisitMoment,
  orderName: string,
): Generator<TreeStep> {
  const visitOrder: string[] = [];
  const callStack: string[] = [];

  yield {
    tree,
    action: "descend",
    current: tree.rootId,
    callStack: [],
    visitOrder: [],
    message: `${orderName}: начинаем с корня ${tree.rootId}`,
  };

  function* walk(nodeId: string | undefined, parentId?: string): Generator<TreeStep> {
    if (!nodeId) return;
    const node = getTreeNode(tree, nodeId);
    if (!node) return;

    callStack.push(nodeId);

    yield {
      tree,
      action: "descend",
      current: nodeId,
      callStack: [...callStack],
      visitOrder: [...visitOrder],
      exploringEdge: parentId ? [parentId, nodeId] : undefined,
      message: `Спускаемся к узлу ${node.label}`,
    };

    const recordVisit = function* (): Generator<TreeStep> {
      visitOrder.push(nodeId);
      yield {
        tree,
        action: "visit",
        current: nodeId,
        callStack: [...callStack],
        visitOrder: [...visitOrder],
        message: `Посещаем ${node.label} → порядок: ${visitOrder.join(" → ")}`,
      };
    };

    if (moment === "pre") yield* recordVisit();
    yield* walk(node.leftId, nodeId);
    if (moment === "in") yield* recordVisit();
    yield* walk(node.rightId, nodeId);
    if (moment === "post") yield* recordVisit();

    callStack.pop();
  }

  yield* walk(tree.rootId);

  yield {
    tree,
    action: "done",
    callStack: [],
    visitOrder: [...visitOrder],
    message: `Готово (${orderName}): ${visitOrder.join(" → ")}`,
  };
}

/** Чистый preorder: корень → левое → правое */
export function preorder(tree: BinaryTree): string[] {
  const order: string[] = [];
  function walk(id: string | undefined) {
    if (!id) return;
    const node = getTreeNode(tree, id);
    if (!node) return;
    order.push(id);
    walk(node.leftId);
    walk(node.rightId);
  }
  walk(tree.rootId);
  return order;
}

export function* preorderSteps(tree: BinaryTree): Generator<TreeStep> {
  yield* traverseSteps(tree, "pre", "Preorder");
}

/** Чистый inorder: левое → корень → правое (для BST даёт sorted) */
export function inorder(tree: BinaryTree): string[] {
  const order: string[] = [];
  function walk(id: string | undefined) {
    if (!id) return;
    const node = getTreeNode(tree, id);
    if (!node) return;
    walk(node.leftId);
    order.push(id);
    walk(node.rightId);
  }
  walk(tree.rootId);
  return order;
}

export function* inorderSteps(tree: BinaryTree): Generator<TreeStep> {
  yield* traverseSteps(tree, "in", "Inorder");
}

/** Чистый postorder: левое → правое → корень */
export function postorder(tree: BinaryTree): string[] {
  const order: string[] = [];
  function walk(id: string | undefined) {
    if (!id) return;
    const node = getTreeNode(tree, id);
    if (!node) return;
    walk(node.leftId);
    walk(node.rightId);
    order.push(id);
  }
  walk(tree.rootId);
  return order;
}

export function* postorderSteps(tree: BinaryTree): Generator<TreeStep> {
  yield* traverseSteps(tree, "post", "Postorder");
}
