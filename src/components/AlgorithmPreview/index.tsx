import CategoryFallback from "./CategoryFallback";
import { SortingPreview, SORTING_PREVIEW_SLUGS } from "./sortingArts";
import styles from "./AlgorithmPreview.module.css";

const SORTING_SLUG_SET: Set<string> = new Set(SORTING_PREVIEW_SLUGS);

type AlgorithmPreviewProps = {
  slug: string;
  category: string;
};

/**
 * Превью карточки: unique pure-CSS арт по slug, иначе категорийный SVG.
 * Декоративно — aria-hidden (текст карточки уже в ссылке).
 */
export default function AlgorithmPreview({ slug, category }: AlgorithmPreviewProps) {
  return (
    <div className={styles.root} aria-hidden>
      {SORTING_SLUG_SET.has(slug) ? (
        <SortingPreview slug={slug} />
      ) : (
        <CategoryFallback category={category} />
      )}
    </div>
  );
}
