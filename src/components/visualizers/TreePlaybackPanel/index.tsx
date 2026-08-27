import type { BinaryTree, TreeStep } from "@/algorithms/types";
import {
  createDemoTree,
  hasTreeVisualization,
  treeStepGenerators,
} from "@/algorithms/tree";
import PlaybackControls from "@/components/ui/PlaybackControls";
import TreeVisualizer from "@/components/visualizers/TreeVisualizer";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import { useMemo, useState } from "react";
import styles from "./TreePlaybackPanel.module.css";

interface TreePlaybackPanelProps {
  slug: string;
}

const TASK_BY_SLUG: Record<string, { task: string; formula: string }> = {
  "preorder-traversal": {
    task: "Обойти все узлы и показать порядок первого посещения (корень раньше детей)",
    formula: "Preorder = корень → левое поддерево → правое поддерево",
  },
  "inorder-traversal": {
    task: "Обойти все узлы; для BST порядок посещения = отсортированные значения",
    formula: "Inorder = левое поддерево → корень → правое поддерево",
  },
  "postorder-traversal": {
    task: "Обойти все узлы так, чтобы корень шёл после обоих поддеревьев",
    formula: "Postorder = левое поддерево → правое поддерево → корень",
  },
};

function collectSteps(slug: string, tree: BinaryTree): TreeStep[] {
  const create = treeStepGenerators[slug];
  if (!create) {
    return [
      {
        tree,
        action: "done",
        callStack: [],
        visitOrder: [],
        message: "Визуализация пока недоступна",
      },
    ];
  }
  return Array.from(create(tree));
}

/** Composition root: domain → player → TreeVisualizer */
export default function TreePlaybackPanel({ slug }: TreePlaybackPanelProps) {
  const [tree] = useState(() => createDemoTree());
  const copy = TASK_BY_SLUG[slug] ?? {
    task: "Обойти все узлы дерева",
    formula: "См. описание алгоритма",
  };

  const steps = useMemo(() => collectSteps(slug, tree), [slug, tree]);
  const stepsId = `${slug}:${tree.rootId}:${tree.nodes.length}`;
  const player = useAlgorithmPlayer(steps, stepsId);

  if (!hasTreeVisualization(slug)) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <TreeVisualizer
        step={player.currentStep}
        task={copy.task}
        formulaHint={copy.formula}
      />
      <PlaybackControls
        isPlaying={player.isPlaying}
        isAtStart={player.isAtStart}
        isAtEnd={player.isAtEnd}
        currentIndex={player.currentIndex}
        totalSteps={player.totalSteps}
        speed={player.speed}
        stats={player.stats}
        elapsedMs={player.elapsedMs}
        message={player.currentStep?.message}
        onToggle={player.toggle}
        onStepBack={player.stepBack}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onSpeedChange={player.setSpeed}
        comparisonsLabel="Спусков"
        movesLabel="Посещений"
        onRandom={player.reset}
      />
    </div>
  );
}
