import type { BinaryTree, TreeStep } from "@/algorithms/types";
import {
  inorderSteps,
  postorderSteps,
  preorderSteps,
} from "./traversals";

export { createDemoTree, getTreeNode, treeEdges } from "./demoTree";
export {
  inorder,
  inorderSteps,
  postorder,
  postorderSteps,
  preorder,
  preorderSteps,
} from "./traversals";

/** Реестр генераторов обхода дерева — ключ = slug */
export const treeStepGenerators: Record<
  string,
  (tree: BinaryTree) => Generator<TreeStep>
> = {
  "preorder-traversal": preorderSteps,
  "inorder-traversal": inorderSteps,
  "postorder-traversal": postorderSteps,
};

export function hasTreeVisualization(slug: string): boolean {
  return slug in treeStepGenerators;
}

export function collectTreeSteps(slug: string, tree: BinaryTree): TreeStep[] | null {
  const create = treeStepGenerators[slug];
  if (!create) return null;
  return Array.from(create(tree));
}
