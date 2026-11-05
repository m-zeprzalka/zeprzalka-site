import { ArrowUpRight } from "lucide-react"
import { GlyphMedia } from "@/components/demo/shared/glyph"
import type { Frame, Peek, PeekLink } from "./types"
import { UI } from "./ui-strings"

export interface PeekWork {
  title: string
  src: string
  video?: string
}

/**
 * Treść karty pod słowem (dotyk, kliknięcie, laptop) — ta sama informacja,
 * którą mysz widzi w prawym torze: oś czasu, opis albo obraz. Karta ma
 * szerokość kolumny, więc obraz stoi w pełnym kadrze i — jak na marginesie —
 * gra wideo realizacji, wyłaniając się ze znaków. Mozaika: jeden kadr
 * z wideo pierwszej realizacji i dwie miniatury pod nim.
 */
export function PeekBody({
  peek,
  work,
  onNavigate,
}: {
  peek: Peek
  /** Realizacja dla podglądu „work” (tytuł, plakat, klip). */
  work?: PeekWork
  onNavigate?: () => void
}) {
  if (peek.kind === "info") {
    return (
      <div>
        <p className="flex items-baseline justify-between gap-4">
          <span className="font-medium text-fm-ink">{peek.heading}</span>
          {peek.meta && <span className="shrink-0 text-fm-ink-3 tabular-nums">{peek.meta}</span>}
        </p>
        {peek.body && <p className="mt-1.5 max-w-[34rem] text-pretty text-fm-ink-2">{peek.body}</p>}
        {peek.entries && (
          <ol className="mt-3 space-y-2.5">
            {peek.entries.map((entry) => (
              <li key={entry.role} className="grid grid-cols-[6.5rem_1fr] gap-4">
                <span className="text-fm-ink-3 tabular-nums">{entry.period}</span>
                <span>
                  <span className="block leading-snug text-fm-ink">{entry.role}</span>
                  <span className="block text-fm-ink-3">{entry.company}</span>
                </span>
              </li>
            ))}
          </ol>
        )}
        {peek.link && <PeekAnchor link={peek.link} onNavigate={onNavigate} />}
      </div>
    )
  }
  if (peek.kind === "mosaic") {
    const [first, ...rest] = peek.items
    return (
      <div>
        {first && <PeekFrame frame={first} />}
        {rest.length > 0 && (
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {rest.slice(0, 2).map((item) => (
              <li
                key={item.src}
                className="i1-ring relative aspect-[16/10] overflow-hidden rounded-fm-lg bg-fm-fill sm:aspect-[16/7]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover"
                />
              </li>
            ))}
          </ul>
        )}
        {peek.link ? (
          <PeekAnchor link={peek.link} onNavigate={onNavigate} />
        ) : (
          <p className="mt-3 font-medium text-fm-ink">{peek.label}</p>
        )}
      </div>
    )
  }
  if (peek.kind === "work") {
    if (!work) return null
    return (
      <div>
        <PeekFrame frame={{ src: work.src, width: 16, height: 10, video: work.video }} />
        <PeekAnchor
          link={{ label: work.title, href: `#realizacja-${peek.slug}` }}
          onNavigate={onNavigate}
        />
      </div>
    )
  }
  return null
}

/** Kadr karty: szkielet ze znaków → plakat → wideo (gra w pętli, z pauzą). */
function PeekFrame({ frame }: { frame: Frame }) {
  return (
    <GlyphMedia
      poster={frame.src}
      src={frame.video}
      width={16}
      height={10}
      sizes="(min-width: 40rem) 640px, 100vw"
      trigger="view"
      loading="eager"
      controls={{ pause: UI.pause, play: UI.play }}
      className="max-h-[min(42svh,22rem)] rounded-fm-lg"
    />
  )
}

function PeekAnchor({ link, onNavigate }: { link: PeekLink; onNavigate?: () => void }) {
  return (
    <a
      href={link.href}
      onClick={onNavigate}
      className="group -mx-3 mt-2 -mb-1 flex min-h-11 items-center gap-2 rounded-full px-3 fm-focus transition-colors duration-150 hover:bg-fm-fill"
    >
      <span className="text-fm-ink">{link.label}</span>
      <ArrowUpRight aria-hidden="true" className="i1-arrow ms-auto size-3.5 text-fm-ink-3" />
    </a>
  )
}
