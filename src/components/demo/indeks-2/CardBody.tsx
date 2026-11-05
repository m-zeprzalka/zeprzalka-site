"use client"

import { ArrowUpRight } from "lucide-react"
import { GlyphMedia } from "./glyph"
import type { Card } from "./types"

/**
 * Treść karty: media (dedykowany film kategorii albo plakat), nagłówek z cichym
 * „meta”, opis, chipy narzędzi, oś czasu i link. Ten sam układ na marginesie
 * i w arkuszu u dołu — różni się tylko opakowanie.
 */
export function CardBody({ card, live }: { card: Card; live: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {card.media && <CardMedia media={card.media} live={live} />}
      <div className="flex flex-col gap-2">
        <p className="flex items-baseline justify-between gap-4">
          <span className="text-fm-body leading-snug font-medium text-pretty text-fm-ink">
            {card.heading}
          </span>
          {card.meta && (
            <span className="shrink-0 text-fm-small text-fm-ink-3 tabular-nums">{card.meta}</span>
          )}
        </p>
        {card.body && (
          <p className="line-clamp-4 text-fm-small text-pretty text-fm-ink-2">{card.body}</p>
        )}
      </div>
      {card.entries && (
        <ol className="flex flex-col gap-3">
          {card.entries.map((entry) => (
            <li key={entry.role} className="grid grid-cols-[6.5rem_1fr] gap-3 text-fm-small">
              <span className="text-fm-ink-3 tabular-nums">{entry.period}</span>
              <span>
                <span className="block leading-snug text-fm-ink">{entry.role}</span>
                <span className="block text-fm-ink-3">{entry.company}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
      {card.chips && card.chips.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {card.chips.map((chip) => (
            <li
              key={chip}
              className="inline-flex h-7 items-center rounded-full bg-fm-fill px-3 text-fm-micro text-fm-ink-2"
            >
              {chip}
            </li>
          ))}
        </ul>
      )}
      {card.link && (
        <a
          href={card.link.href}
          target={card.link.external ? "_blank" : undefined}
          rel={card.link.external ? "noopener noreferrer" : undefined}
          className="group -mx-3 flex min-h-11 items-center gap-2 rounded-full px-3 text-fm-small fm-focus transition-colors duration-150 hover:bg-fm-fill"
        >
          <span className="text-fm-ink">{card.link.label}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="ms-auto size-4 text-fm-ink-3 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      )}
    </div>
  )
}

/**
 * Media karty: szkielet ze znaków od razu, odkodowanie w plakat i film, gdy karta
 * jest pokazana (silnik ładuje wideo dopiero wtedy — jedno grające naraz).
 * Kadr stały: 16:10 dla poziomych, 4:3 dla pionowych (ludzie w kadrze).
 */
function CardMedia({ media, live }: { media: NonNullable<Card["media"]>; live: boolean }) {
  const landscape = media.poster.width >= media.poster.height
  return (
    <GlyphMedia
      poster={media.poster.src}
      src={media.video}
      width={landscape ? 16 : 4}
      height={landscape ? 10 : 3}
      sizes="(min-width: 1024px) 30vw, 100vw"
      trigger="manual"
      decoded={live}
      loading="eager"
      className="i2-media-ring w-full rounded-fm-lg"
    />
  )
}
