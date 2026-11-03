"use client"

import { useState } from "react"
import { Play } from "lucide-react"

/** Identyfikator filmu YouTube: 11 znaków z ograniczonego alfabetu. */
const YT_ID = /^[A-Za-z0-9_-]{11}$/

interface YouTubeEmbedProps {
  id: string
  title?: string
  /** Napis na przycisku — podawany z treści serwisu (src/i18n). */
  playLabel?: string
}

/**
 * Film z YouTube jako „fasada": do kliknięcia nie ładuje się nic od Google.
 *
 * Zwykła ramka `youtube.com` po przewinięciu do niej ustawiała ciasteczka
 * śledzące bez zgody (wymóg Prawa komunikacji elektronicznej / RODO), a przy
 * okazji pobierała ~1 MB skryptów odtwarzacza. Po kliknięciu wczytuje się
 * wersja z domeny youtube-nocookie.com, od razu z odtwarzaniem.
 */
export function YouTubeEmbed({
  id,
  title = "YouTube video",
  playLabel = "Odtwórz film (YouTube)",
}: YouTubeEmbedProps) {
  const [active, setActive] = useState(false)

  if (!YT_ID.test(id)) return null

  return (
    <div className="my-8 overflow-hidden rounded-xl border shadow-md">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex size-16 items-center justify-center rounded-full border bg-background shadow-sm transition-transform group-hover:scale-105">
              <Play className="size-6 translate-x-0.5" aria-hidden="true" />
            </span>
            {playLabel}
          </button>
        )}
      </div>
      {title && <p className="px-4 py-2 text-sm text-muted-foreground">{title}</p>}
    </div>
  )
}
