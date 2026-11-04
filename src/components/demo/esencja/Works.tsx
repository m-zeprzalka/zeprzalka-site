"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react"
import Image from "next/image"
import type { DemoWork } from "../shared/content"
import { useHoverVideo } from "./use-hover-video"
import { useWorks } from "./WorksProvider"

const FINE = "(hover: hover) and (pointer: fine)"
const subscribeFine = (onChange: () => void) => {
  const media = window.matchMedia(FINE)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/**
 * Kadry masonry: plakaty są pionowe (720 × 850), więc rytm dają przycięcia
 * na zmianę — dzięki nim kolumny mają różne wysokości jak w prawdziwym
 * masonry, a nie równą siatkę.
 */
const CROPS = ["4 / 5", "1 / 1", "3 / 4", "4 / 5", "3 / 4", "1 / 1", "4 / 5"]

/** Na dotyku wideo rusza dopiero, gdy karta zatrzyma się przy środku ekranu — nie w trakcie przewijania. */
const DWELL_MS = 800

/**
 * Masonry treści wizualnych (1 → 2 → 3 kolumny). Podpis zawsze widoczny.
 * Wideo: pod kursorem (mysz) albo w jednej karcie, która przez 0,8 s stoi
 * najbliżej środka ekranu (dotyk) — przewijanie nie pobiera kolejnych klipów.
 * Klik otwiera podgląd; strzałki przechodzą po realizacjach tej sekcji.
 */
export function Works({ works }: { works: readonly DemoWork[] }) {
  const { open } = useWorks()
  const [revealed, setRevealed] = useState<"no" | "animate" | "instant">("no")
  const [centered, setCentered] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const fine = useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE).matches,
    () => true
  )
  const scope = works.map((work) => work.slug)

  // Wejście siatki: raz, po wejściu w kadr; widoczna przy hydratacji — bez animacji.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const box = list.getBoundingClientRect()
    const visible = box.top < window.innerHeight && box.bottom > 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setRevealed(visible ? "instant" : "animate")
        observer.disconnect()
      },
      { rootMargin: "0px 0px -8% 0px" }
    )
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  // Dotyk: karta zajmująca największą część ekranu (≥ 60%), ale dopiero po chwili bezruchu.
  useEffect(() => {
    const list = listRef.current
    if (!list || fine) return
    const ratios = new Map<string, number>()
    let timer: ReturnType<typeof setTimeout> | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slug = (entry.target as HTMLElement).dataset.slug
          if (slug) ratios.set(slug, entry.intersectionRatio)
        }
        let best: string | null = null
        let max = 0.6
        for (const [slug, ratio] of ratios) {
          if (ratio >= max) {
            best = slug
            max = ratio
          }
        }
        clearTimeout(timer)
        setCentered(null)
        if (best) timer = setTimeout(() => setCentered(best), DWELL_MS)
      },
      { threshold: [0, 0.3, 0.6, 0.8, 1] }
    )
    list.querySelectorAll("li").forEach((item) => observer.observe(item))
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [fine])

  return (
    <ul ref={listRef} className="columns-2 gap-2 sm:gap-3 lg:columns-3 lg:gap-4">
      {works.map((work, index) => (
        <li
          key={work.slug}
          data-slug={work.slug}
          data-in={revealed !== "no" ? "" : undefined}
          data-instant={revealed === "instant" ? "" : undefined}
          className="es-reveal mb-2 break-inside-avoid sm:mb-3 lg:mb-4"
          style={{ "--i": index % 3 } as CSSProperties}
        >
          <WorkCard
            work={work}
            crop={CROPS[index % CROPS.length] ?? "4 / 5"}
            onOpen={() => open(work.slug, scope)}
            active={!fine && centered === work.slug}
          />
        </li>
      ))}
    </ul>
  )
}

function WorkCard({
  work,
  crop,
  onOpen,
  active,
}: {
  work: DemoWork
  crop: string
  onOpen: () => void
  active: boolean
}) {
  const video = useHoverVideo(work.video, { className: "group-hover:scale-[1.03]", active })

  return (
    <button
      type="button"
      onClick={onOpen}
      {...video.handlers}
      className="group block w-full fm-press-soft rounded-[1.25rem] bg-fm-surface p-1 text-left shadow-fm-card fm-focus transition-[box-shadow,scale] duration-300 hover:shadow-fm-pop sm:rounded-[1.75rem] sm:p-1.5"
    >
      <span
        className="relative block overflow-hidden rounded-[1rem] bg-fm-fill sm:rounded-[1.375rem]"
        style={{ aspectRatio: crop }}
      >
        <Image
          src={work.poster}
          alt=""
          fill
          sizes="(min-width: 1024px) 390px, 50vw"
          className="object-cover transition-[scale] duration-700 ease-fm-snap group-hover:scale-[1.03]"
        />
        {video.element}
      </span>
      <span className="flex flex-col gap-0.5 px-2 pt-2 pb-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3 sm:px-3 sm:pt-3 sm:pb-2">
        <span className="min-w-0 truncate text-[0.875rem] font-medium tracking-[-0.01em] sm:text-[0.9375rem]">
          {work.title}
        </span>
        <span className="truncate text-fm-micro text-fm-ink-3 sm:shrink-0">{work.category}</span>
      </span>
    </button>
  )
}
