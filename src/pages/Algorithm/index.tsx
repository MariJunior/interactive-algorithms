import { useParams } from "react-router-dom";

/** Страница одного алгоритма; `slug` приходит из маршрута `/algorithm/:slug`. */
export default function Algorithm() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <main>
      <p>Algorithm: {slug ?? "—"}</p>
    </main>
  );
}
