import { describe, expect, it } from "vitest";
import { createDemoTree } from "./demoTree";
import {
  inorder,
  inorderSteps,
  postorder,
  postorderSteps,
  preorder,
  preorderSteps,
} from "./traversals";

describe("tree traversals on demo tree", () => {
  const tree = createDemoTree();

  it("preorder: корень → левое → правое", () => {
    expect(preorder(tree)).toEqual(["4", "2", "1", "3", "6", "5", "7"]);
  });

  it("inorder: левое → корень → правое (sorted для BST)", () => {
    expect(inorder(tree)).toEqual(["1", "2", "3", "4", "5", "6", "7"]);
  });

  it("postorder: левое → правое → корень", () => {
    expect(postorder(tree)).toEqual(["1", "3", "2", "5", "7", "6", "4"]);
  });

  it("генераторы совпадают с чистыми функциями", () => {
    expect(Array.from(preorderSteps(tree)).at(-1)?.visitOrder).toEqual(preorder(tree));
    expect(Array.from(inorderSteps(tree)).at(-1)?.visitOrder).toEqual(inorder(tree));
    expect(Array.from(postorderSteps(tree)).at(-1)?.visitOrder).toEqual(postorder(tree));
  });

  it("не мутирует дерево", () => {
    const before = JSON.stringify(tree);
    Array.from(inorderSteps(tree));
    expect(JSON.stringify(tree)).toBe(before);
  });
});
