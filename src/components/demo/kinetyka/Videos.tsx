"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Play } from "lucide-react"
import { cn } from "../forma/cn"
import { kinetic, motionAllowed, scrubFor } from "./gsap"
import { useProjection, type ProjectionWork } from "./Projection"
import { useClip } from "./use-clip"

/** Przesunięcie kolumn przy przewijaniu (część wysokości kadru): lewa, środkowa, prawa. */
const TEMPO = [-0.08, 0.1, -0.02]

/**
 * Wideo i animacja w masonry: kolumny przesunięte o pół kadru i jadące przy
 * przewijaniu w trzech tempach (desktop) — warstwy, nie siatka. Na myszy
 * kadr pod kursorem gra swój klip; klik (i dotknięcie) otwiera projekcję,
 * więc na telefonie żaden klip nie ładuje się „przy okazji” przewijania.
 * Podpis stoi zawsze pod kadrem.
 */
export function Videos({ works, play }: { works: readonly ProjectionWork[]; play: string }) {
  const gridRef = useRef<HTMLUListElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const { open } = useProjection()

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !motionAllowed()) return
    const { gsap } = kinetic()
    const media = gsap.matchMedia()
    media.add("(min-width: 64rem)", () => {
      const tiles = [...grid.children] as HTMLElement[]
      const lefts = [...new Set(tiles.map((tile) => tile.offsetLeft))].sort((a, b) => a - b)
      tiles.forEach((tile) => {
        const column = lefts.indexOf(tile.offsetLeft)
        const shift = (TEMPO[column] ?? 0) * tile.offsetHeight
        gsap.fromTo(
          tile.firstElementChild,
          { y: -shift },
          {
            y: shift,
            ease: "none",
            scrollTrigger: {
              trigger: grid,
              start: "top bottom",
              end: "bottom top",
              scrub: scrubFor(),
            },
          }
        )
      })
    })
    return () => media.revert()
  }, [])

  return (
    <ul ref={gridRef} className="kn-masonry">
      {works.map((work) => (
        <li key={work.slug} className="kn-masonry-item">
          {/* Dwie warstwy: `li` ma stałe przesunięcie kolumny (CSS), wnętrze jedzie w tempie kolumny (GSAP). */}
          <div className="kn-masonry-move">
            <button
              type="button"
              data-kn-slug={work.slug}
              onClick={(event) =>
                open(work.slug, event.currentTarget.querySelector<HTMLElement>("[data-kn-frame]"))
              }
              onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(work.slug)}
              onPointerLeave={() => setHovered(null)}
              className="group block w-full text-start fm-focus"
            >
              <TileFrame work={work} playing={hovered === work.slug} play={play} />
              <span className="mt-3 flex flex-col gap-1 xl:flex-row xl:items-baseline xl:justify-between xl:gap-4">
                <span className="text-[1rem] leading-snug font-medium tracking-[-0.02em] text-pretty sm:text-[1.0625rem]">
                  {work.title}
                </span>
                <span className="text-fm-micro text-fm-ink-3 xl:shrink-0">{work.category}</span>
              </span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function TileFrame({
  work,
  playing,
  play,
}: {
  work: ProjectionWork
  playing: boolean
  play: string
}) {
  const [videoRef, clip] = useClip(work.video, playing)

  return (
    <span
      data-kn-frame=""
      className="relative block overflow-hidden rounded-fm-xl bg-fm-fill"
      style={{ aspectRatio: `${work.width} / ${work.height}` } as CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- plakaty w docelowym rozmiarze (WebP 720 px) */}
      <img
        src={work.poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-700 ease-fm-snap group-hover:scale-[1.03]"
      />
      {clip.armed && (
        <video
          ref={videoRef}
          src={work.video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          {...clip.events}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            clip.visible ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      {/* Znak „odtwórz” — mówi, że kadr to film (dotyk: otwiera projekcję). */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute start-3 bottom-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-black/45 ps-2.5 pe-3 text-fm-micro font-medium text-white backdrop-blur-md transition-opacity duration-300",
          clip.visible && "opacity-0"
        )}
      >
        <Play className="size-3 fill-current" />
        {play}
      </span>
    </span>
  )
}
