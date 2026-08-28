/**
 * Категорийный SVG-fallback, пока для слага нет unique pure-CSS арта.
 * Вынесено из AlgorithmCard — карточка только композирует Preview.
 */
export default function CategoryFallback({ category }: { category: string }) {
  switch (category) {
    case "sorting":
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[12, 30, 18, 42, 8, 36, 24, 44, 16, 38].map((height, index) => (
            <rect
              key={index}
              x={index * 8 + 1}
              y={48 - height}
              width={6}
              height={height}
              rx={2}
              fill="currentColor"
              opacity={0.3 + (height / 44) * 0.7}
            />
          ))}
        </svg>
      );

    case "searching":
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <rect
              key={index}
              x={index * 11 + 2}
              y={16}
              width={9}
              height={9}
              rx={2}
              fill="currentColor"
              opacity={index === 3 ? 1 : 0.25}
            />
          ))}
          <circle cx="60" cy="34" r="8" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <line
            x1="66"
            y1="40"
            x2="72"
            y2="46"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      );

    case "tree":
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="40" y1="10" x2="20" y2="26" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="40" y1="10" x2="60" y2="26" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="20" y1="26" x2="10" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="20" y1="26" x2="30" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="60" y1="26" x2="50" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="60" y1="26" x2="70" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          {[
            [40, 10],
            [20, 26],
            [60, 26],
            [10, 42],
            [30, 42],
            [50, 42],
            [70, 42],
          ].map(([cx, cy], index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={index === 0 ? 6 : 5}
              fill="currentColor"
              opacity={index === 0 ? 1 : 0.4}
            />
          ))}
        </svg>
      );

    case "graph":
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="15" y1="12" x2="45" y2="8" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          <line x1="15" y1="12" x2="20" y2="38" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          <line x1="45" y1="8" x2="68" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          <line x1="45" y1="8" x2="20" y2="38" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          <line x1="68" y1="22" x2="55" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          <line x1="20" y1="38" x2="55" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          {[
            [15, 12],
            [45, 8],
            [68, 22],
            [20, 38],
            [55, 42],
          ].map(([cx, cy], index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={5}
              fill="currentColor"
              opacity={index === 1 ? 1 : 0.4}
            />
          ))}
        </svg>
      );

    case "dynamic-programming":
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3, 4].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={col * 15 + 5}
                y={row * 10 + 4}
                width={13}
                height={8}
                rx={1.5}
                fill="currentColor"
                opacity={row <= col ? 0.7 : 0.15}
              />
            )),
          )}
        </svg>
      );

    case "greedy":
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[8, 20, 14, 38, 26, 44, 18, 30].map((height, index) => (
            <rect
              key={index}
              x={index * 9 + 4}
              y={48 - height}
              width={7}
              height={height}
              rx={2}
              fill="currentColor"
              opacity={index === 5 ? 1 : 0.25}
            />
          ))}
          <polyline
            points="37,6 40,2 43,6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      );

    case "string":
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {["A", "B", "C", "A", "B", "D"].map((char, index) => (
            <g key={index}>
              <rect
                x={index * 12 + 4}
                y={10}
                width={10}
                height={12}
                rx={2}
                fill="currentColor"
                opacity={index >= 3 ? 0.8 : 0.2}
              />
              <text
                x={index * 12 + 9}
                y={20}
                textAnchor="middle"
                fontSize="7"
                fill="currentColor"
                opacity={index >= 3 ? 1 : 0.5}
                fontFamily="monospace"
              >
                {char}
              </text>
            </g>
          ))}
          {["A", "B", "D"].map((char, index) => (
            <g key={`p-${index}`}>
              <rect
                x={(index + 3) * 12 + 4}
                y={30}
                width={10}
                height={12}
                rx={2}
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                opacity={0.7}
              />
              <text
                x={(index + 3) * 12 + 9}
                y={40}
                textAnchor="middle"
                fontSize="7"
                fill="currentColor"
                opacity={0.7}
                fontFamily="monospace"
              >
                {char}
              </text>
            </g>
          ))}
        </svg>
      );

    case "data-structures":
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0, 1, 2, 3].map((index) => (
            <rect
              key={`b-${index}`}
              x={6}
              y={index * 11 + 4}
              width={14}
              height={9}
              rx={2}
              fill="currentColor"
              opacity={index === 1 ? 0.85 : 0.25}
            />
          ))}
          <rect x={28} y={15} width={20} height={9} rx={2} fill="currentColor" opacity={0.7} />
          <rect x={54} y={15} width={20} height={9} rx={2} fill="currentColor" opacity={0.45} />
          <path d="M22 19.5 H28" stroke="currentColor" strokeWidth="1.5" opacity={0.7} />
          <path d="M48 19.5 H54" stroke="currentColor" strokeWidth="1.5" opacity={0.5} />
        </svg>
      );

    case "np-complete":
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline
            points="16,36 28,12 52,18 64,34 40,40 16,36"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity={0.55}
          />
          {[
            [16, 36],
            [28, 12],
            [52, 18],
            [64, 34],
            [40, 40],
          ].map(([cx, cy], index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={3.5}
              fill="currentColor"
              opacity={index === 0 ? 1 : 0.7}
            />
          ))}
        </svg>
      );

    case "ml":
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[
            [18, 16],
            [28, 22],
            [22, 30],
          ].map(([cx, cy], index) => (
            <circle key={`a-${index}`} cx={cx} cy={cy} r={4} fill="currentColor" opacity={0.45} />
          ))}
          {[
            [58, 14],
            [66, 24],
            [54, 28],
          ].map(([cx, cy], index) => (
            <circle key={`b-${index}`} cx={cx} cy={cy} r={4} fill="currentColor" opacity={0.75} />
          ))}
          <circle cx={40} cy={24} r={5} stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle
            cx={40}
            cy={24}
            r={14}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            fill="none"
            opacity={0.4}
          />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="24" r="16" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        </svg>
      );
  }
}
