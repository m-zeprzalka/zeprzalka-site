"use client"

import { useEffect, useId, useRef, useState } from "react"
import { PlayIcon } from "lucide-react"

/** Identyfikator filmu YouTube: 11 znaków z ograniczonego alfabetu. */
const YT_ID = /^[A-Za-z0-9_-]{11}$/

/**
 * Film z YouTube jako „fasada”: do kliknięcia nic nie ładuje się od Google
 * (bez ciasteczek śledzących i ok. 1 MB skryptów odtwarzacza). Po kliknięciu
 * ramka z youtube-nocookie.com, od razu z odtwarzaniem; fokus przechodzi na nią.
 */
export function YouTubeEmbed({
  id,
  title,
  playLabel,
}: {
  id: string
  title: string
  playLabel: string
}) {
  const [active, setActive] = useState(false)
  const frame = useRef<HTMLIFrameElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (active) frame.current?.focus()
  }, [active])

  if (!YT_ID.test(id)) return null

  return (
    <figure className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-2xl border bg-muted">
        {active ? (
          <iframe
            ref={frame}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-describedby={titleId}
            className="group absolute inset-0 grid place-content-center justify-items-center gap-3 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset"
          >
            <span className="grid size-14 place-items-center rounded-full border bg-background shadow-xs transition-transform group-hover:scale-105">
              <PlayIcon className="size-5 translate-x-0.5" />
            </span>
            {playLabel}
          </button>
        )}
      </div>
      <figcaption id={titleId} className="mt-2.5 text-sm text-muted-foreground">
        {title}
      </figcaption>
    </figure>
  )
}
