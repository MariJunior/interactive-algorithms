import CategoryFallback from "./CategoryFallback";
import { AdvancedPreview, ADVANCED_PREVIEW_SLUGS } from "./advancedArts";
import { CorePreview, CORE_PREVIEW_SLUGS } from "./coreArts";
import { SortingPreview, SORTING_PREVIEW_SLUGS } from "./sortingArts";
import styles from "./AlgorithmPreview.module.css";

const SORTING_SLUG_SET: Set<string> = new Set(SORTING_PREVIEW_SLUGS);
const CORE_SLUG_SET: Set<string> = new Set(CORE_PREVIEW_SLUGS);
const ADVANCED_SLUG_SET: Set<string> = new Set(ADVANCED_PREVIEW_SLUGS);

type AlgorithmPreviewProps = {
  slug: string;
  category: string;
};

/**
 * Превью карточки: unique pure-CSS арт по slug, иначе категорийный SVG.
 * Декоративно — aria-hidden (текст карточки уже в ссылке).
 */
export default function AlgorithmPreview({ slug, category }: AlgorithmPreviewProps) {
  let preview = <CategoryFallback category={category} />;
  if (SORTING_SLUG_SET.has(slug)) {
    preview = <SortingPreview slug={slug} />;
  } else if (CORE_SLUG_SET.has(slug)) {
    preview = <CorePreview slug={slug} />;
  } else if (ADVANCED_SLUG_SET.has(slug)) {
    preview = <AdvancedPreview slug={slug} />;
  }

  return (
    <div className={styles.root} aria-hidden>
      {preview}
    </div>
  );
}
