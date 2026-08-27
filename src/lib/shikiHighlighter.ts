import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { HighlighterCore } from "shiki/core";

/** Языки вкладок CodeBlock → id грамматики Shiki */
export type CodeLang = "javascript" | "typescript";

let highlighterPromise: Promise<HighlighterCore> | null = null;

/**
 * Singleton highliter: один раз грузим темы/языки, дальше codeToHtml синхронный.
 * Fine-grained bundle + JS-engine — меньше веса для Vite SPA, чем полный `shiki`.
 */
export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [import("@shikijs/themes/github-dark")],
      langs: [
        import("@shikijs/langs/javascript"),
        import("@shikijs/langs/typescript"),
      ],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

/** Маппинг id вкладки UI → язык подсветки */
export function langFromTabId(tabId: string): CodeLang {
  return tabId === "typescript" ? "typescript" : "javascript";
}

export async function highlightCode(code: string, lang: CodeLang): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark",
  });
}
