import type { BinaryTree, TreeNodeLayout } from "@/algorithms/types";

/** Учебное BST-подобное дерево — удобно сравнивать три порядка обхода */
export function createDemoTree(): BinaryTree {
  const nodes: TreeNodeLayout[] = [
    { id: "4", label: "4", x: 200, y: 36, leftId: "2", rightId: "6" },
    { id: "2", label: "2", x: 100, y: 110, leftId: "1", rightId: "3" },
    { id: "6", label: "6", x: 300, y: 110, leftId: "5", rightId: "7" },
    { id: "1", label: "1", x: 50, y: 190 },
    { id: "3", label: "3", x: 150, y: 190 },
    { id: "5", label: "5", x: 250, y: 190 },
    { id: "7", label: "7", x: 350, y: 190 },
  ];

  return { rootId: "4", nodes };
}

export function getTreeNode(
  tree: BinaryTree,
  id: string,
): TreeNodeLayout | undefined {
  return tree.nodes.find((node) => node.id === id);
}

/** Список рёбер parent→child для отрисовки */
export function treeEdges(tree: BinaryTree): Array<{ from: string; to: string }> {
  const edges: Array<{ from: string; to: string }> = [];
  for (const node of tree.nodes) {
    if (node.leftId) edges.push({ from: node.id, to: node.leftId });
    if (node.rightId) edges.push({ from: node.id, to: node.rightId });
  }
  return edges;
}
