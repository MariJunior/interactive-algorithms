import { useState } from "react";
import styles from "./CodeBlock.module.css";

interface CodeTab {
  id: string;
  label: string;
  code: string;
}

interface CodeBlockProps {
  tabs: CodeTab[];
}

const TABS: Array<{ id: string; label: string }> = [
  { id: "jsBasic", label: "JS базовый" },
  { id: "jsModern", label: "JS современный" },
  { id: "typescript", label: "TypeScript" },
];

export default function CodeBlock({ tabs }: CodeBlockProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "jsBasic");

  const activeTab = tabs.find((t) => t.id === activeId);

  function handleCopy() {
    if (!activeTab) return;
    navigator.clipboard.writeText(activeTab.code).then(() => {
      // Небольшой визуальный фидбек — через state
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const [copied, setCopied] = useState(false);

  return (
    <div className={styles.wrapper}>
      {/* Шапка с вкладками */}
      <div className={styles.header}>
        <div className={styles.tabs}>
          {TABS.map((tab) => {
            const exists = tabs.some((t) => t.id === tab.id);
            if (!exists) return null;
            return (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeId === tab.id ? styles.tabActive : ""}`}
                onClick={() => setActiveId(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ""}`}
          onClick={handleCopy}
          title="Скопировать код"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8l4 4 6-7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Скопировано
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect
                  x="5"
                  y="5"
                  width="8"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 5V4a1 1 0 00-1-1H4a1 1 0 00-1 1v6a1 1 0 001 1h1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Скопировать
            </>
          )}
        </button>
      </div>

      {/* Код */}
      <div className={styles.codeArea}>
        <pre className={styles.pre}>
          <code>{activeTab?.code ?? ""}</code>
        </pre>
      </div>
    </div>
  );
}
