import { langFromTabId, highlightCode } from "@/lib/shikiHighlighter";
import { useEffect, useId, useState } from "react";
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
  const baseId = useId();
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "jsBasic");
  const [copied, setCopied] = useState(false);
  // HTML от Shiki; null — ещё грузим / fallback на plain text
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  const activeTab = tabs.find((t) => t.id === activeId);
  const panelId = `${baseId}-panel`;
  const tablistId = `${baseId}-tablist`;

  useEffect(() => {
    if (!activeTab?.code) {
      setHighlightedHtml(null);
      return;
    }

    let cancelled = false;
    const lang = langFromTabId(activeTab.id);

    // Пока грузится highlighter — показываем предыдущий HTML или plain
    highlightCode(activeTab.code, lang)
      .then((html) => {
        if (!cancelled) setHighlightedHtml(html);
      })
      .catch(() => {
        // Shiki недоступен — оставляем plain <pre>
        if (!cancelled) setHighlightedHtml(null);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab?.code, activeTab?.id]);

  function handleCopy() {
    if (!activeTab) return;
    navigator.clipboard.writeText(activeTab.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div
          className={styles.tabs}
          role="tablist"
          id={tablistId}
          aria-label="Вариант реализации"
        >
          {TABS.map((tab) => {
            const exists = tabs.some((t) => t.id === tab.id);
            if (!exists) return null;
            const selected = activeId === tab.id;
            const tabId = `${baseId}-tab-${tab.id}`;
            return (
              <button
                key={tab.id}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
                onClick={() => setActiveId(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ""}`}
          onClick={handleCopy}
          aria-label={copied ? "Код скопирован" : "Скопировать код"}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

      {/* tabpanel: Shiki HTML или plain fallback */}
      <div
        className={styles.codeArea}
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${baseId}-tab-${activeId}`}
      >
        {highlightedHtml ? (
          <div
            className={styles.shikiHost}
            // Shiki отдаёт безопасный HTML только из нашего исходника кода
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className={styles.pre}>
            <code>{activeTab?.code ?? ""}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
