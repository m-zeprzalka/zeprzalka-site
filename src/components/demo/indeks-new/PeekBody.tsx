import { ArrowUpRight } from "lucide-react"
import type { Peek, PeekLink } from "./types"

/**
 * Treść podglądu w popoverze (dotyk i kliknięcie) — ta sama informacja, którą
 * mysz widzi na marginesie: oś czasu, opis, miniatury z linkiem do sekcji.
 */
export function PeekBody({
  peek,
  work,
  onNavigate,
}: {
  peek: Peek
  /** Realizacja dla podglądu „work” (tytuł i plakat). */
  work?: { title: string; src: string }
  onNavigate?: () => void
}) {
  if (peek.kind === "info") {
    return (
      <div>
        <p className="flex items-baseline justify-between gap-3">
          <span className="font-medium text-fm-ink">{peek.heading}</span>
          {peek.meta && <span className="shrink-0 text-fm-ink-3 tabular-nums">{peek.meta}</span>}
        </p>
        {peek.body && <p className="mt-1 text-pretty text-fm-ink-2">{peek.body}</p>}
        {peek.entries && (
          <ol className="mt-3 space-y-2.5">
            {peek.entries.map((entry) => (
              <li key={entry.role} className="grid grid-cols-[5.25rem_1fr] gap-3">
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
    return (
      <div>
        <ul className="grid grid-cols-3 gap-1.5">
          {peek.items.slice(0, 3).map((item) => (
            <li
              key={item.src}
              className="ixn-media-ring relative aspect-[4/5] overflow-hidden rounded-fm-sm bg-fm-fill"
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
        {peek.link ? (
          <PeekAnchor link={peek.link} onNavigate={onNavigate} />
        ) : (
          <p className="mt-2.5 font-medium text-fm-ink">{peek.label}</p>
        )}
      </div>
    )
  }
  if (peek.kind === "work") {
    if (!work) return null
    return (
      <div>
        <div className="ixn-media-ring relative aspect-[16/10] overflow-hidden rounded-fm-md bg-fm-fill">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={work.src}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <PeekAnchor
          link={{ label: work.title, href: `#realizacja-${peek.slug}` }}
          onNavigate={onNavigate}
        />
      </div>
    )
  }
  return null
}

function PeekAnchor({ link, onNavigate }: { link: PeekLink; onNavigate?: () => void }) {
  return (
    <a
      href={link.href}
      onClick={onNavigate}
      className="group -mx-2 mt-2 flex min-h-11 items-center gap-2 rounded-fm-md px-2 fm-focus transition-colors duration-150 hover:bg-fm-fill"
    >
      <span className="text-fm-ink">{link.label}</span>
      {link.meta && <span className="text-fm-ink-3 tabular-nums">{link.meta}</span>}
      <ArrowUpRight aria-hidden="true" className="ixn-arrow ms-auto size-3.5 text-fm-ink-3" />
    </a>
  )
}
