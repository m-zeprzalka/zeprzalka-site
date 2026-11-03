import type { CSSProperties } from "react"
import { Count } from "../../forma/Count"

/** Pozycje i tempo „kursorów studentów” — stałe, więc HTML jest deterministyczny. */
const CURSORS = [
  { x: 14, y: 30, dx: 18, dy: 10, dur: 7.2, delay: -1.3 },
  { x: 70, y: 22, dx: -14, dy: 16, dur: 8.6, delay: -4.1 },
  { x: 58, y: 66, dx: 12, dy: -12, dur: 6.4, delay: -2.2 },
  { x: 26, y: 72, dx: -10, dy: -14, dur: 9.1, delay: -5.6 },
]

/**
 * Wykłady: slajd z sali — rola i lata, a wokół dryfują kursory „studentów”
 * (sam CSS, rozsynchronizowane ujemnymi opóźnieniami). Pod spodem wynik
 * z ankiet studenckich, który przyniósł Nagrodę Rektora.
 */
export function LectureTile({
  subjects,
  role,
  place,
  period,
  score,
  labels,
}: {
  /** Przedmioty z doświadczenia — „tematy” na slajdzie. */
  subjects: readonly string[]
  role: string
  place: string
  period: string
  score: number
  labels: { award: string; scoreCaption: string }
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 p-2">
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-fm-lg bg-fm-surface p-5 shadow-fm-ring">
        <div>
          <p className="text-fm-micro font-medium text-fm-ink-3">{place}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {subjects.map((subject) => (
              <li
                key={subject}
                className="rounded-full bg-fm-fill px-2.5 py-1 text-fm-micro text-fm-ink-2"
              >
                {subject}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[2rem] leading-none font-semibold tracking-[-0.04em] tabular-nums md:text-[2.5rem]">
            {period}
          </p>
          <p className="mt-2 text-sm text-fm-ink-2">{role}</p>
        </div>
        {CURSORS.map((cursor, index) => (
          <svg
            key={index}
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="zi-cursor absolute size-4 text-fm-ink drop-shadow-sm"
            style={
              {
                left: `${cursor.x}%`,
                top: `${cursor.y}%`,
                "--dx": `${cursor.dx}px`,
                "--dy": `${cursor.dy}px`,
                animationDuration: `${cursor.dur}s`,
                animationDelay: `${cursor.delay}s`,
              } as CSSProperties
            }
          >
            <path
              d="M2 1.5 13.5 7 8.2 8.4 6 13.8z"
              fill="currentColor"
              stroke="var(--fm-surface)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
      <div className="flex items-end justify-between gap-4 rounded-fm-lg bg-fm-surface px-5 py-4 shadow-fm-ring">
        <div>
          <p className="text-sm font-medium">{labels.award}</p>
          <p className="mt-0.5 text-fm-micro text-fm-ink-3">{labels.scoreCaption}</p>
        </div>
        <Count
          value={score / 100}
          format={{ style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 }}
          className="text-[1.75rem] leading-none font-semibold tracking-[-0.03em] tabular-nums"
        />
      </div>
    </div>
  )
}
