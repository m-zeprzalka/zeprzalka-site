"use client"

import { useState, type CSSProperties } from "react"
import { DeckCard } from "./DeckCard"
import { useTalia } from "./TaliaProvider"
import type { Project } from "./types"

/**
 * Wachlarz pięciu wyróżnionych realizacji (od 768 px). Układ, rozłożenie
 * przy najechaniu i uniesienie karty to czysty CSS (`talia.css`) — HTML
 * z serwera jest gotowym wachlarzem. JS dokłada tylko dwie rzeczy: pętlę
 * karty pod kursorem albo fokusem (gra tylko na życzenie, więc nie potrzebuje
 * pauzy) i otwarcie karty.
 */
export function HeroFan({ projects, label }: { projects: readonly Project[]; label: string }) {
  const { openProject } = useTalia()
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <ul
      aria-label={label}
      className="talia-fan"
      style={{ "--n": projects.length } as CSSProperties}
      onPointerLeave={() => setHovered(null)}
    >
      {projects.map((project, index) => (
        <li
          key={project.slug}
          className="talia-fan__card"
          style={{ "--i": index } as CSSProperties}
          onPointerEnter={() => setHovered(index)}
        >
          <button
            type="button"
            aria-haspopup="dialog"
            className="fm-focus rounded-fm-3xl block w-full cursor-pointer"
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
            onClick={(event) => openProject(project.slug, "fan", event.currentTarget)}
          >
            <DeckCard
              project={project}
              origin="fan"
              active={index === hovered}
              hero
              sizes="(min-width: 768px) 15rem, 1px"
              className="shadow-fm-pop"
            />
          </button>
        </li>
      ))}
    </ul>
  )
}
