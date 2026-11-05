"use client"

import { useRef, type PointerEvent } from "react"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { useReducedMotion } from "../forma/use-in-view"
import type { DemoWork } from "../shared/content"
import { GlyphMedia } from "../shared/glyph"
import { UI } from "./ui-strings"

/**
 * Karuzela realizacji: natywne przewijanie poziome (kciuk, gładzik, klawiatura) z przyciąganiem
 * do kart, przeciąganie myszą, dwa przyciski i pasek postępu liczony z przewijania toru (CSS).
 * Każdy kadr startuje jako szkielet ze znaków i wyłania się w plakat; najechanie — wideo.
 */
export function WorksRail({ works, allHref }: { works: readonly DemoWork[]; allHref: string }) {
  const track = useRef<HTMLUListElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const reduced = useReducedMotion()

  const step = (direction: 1 | -1) => {
    const element = track.current
    const card = element?.querySelector("li")
    if (!element || !card) return
    const gap = parseFloat(getComputedStyle(element).columnGap) || 16
    element.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: reduced ? "auto" : "smooth",
    })
  }

  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return
    drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false }
  }
  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    const state = drag.current
    const element = event.currentTarget
    if (!state) return
    const dx = event.clientX - state.x
    if (!state.moved && Math.abs(dx) > 6) {
      state.moved = true
      element.setPointerCapture(event.pointerId)
      element.style.scrollSnapType = "none"
    }
    if (state.moved) element.scrollLeft = state.left - dx
  }
  const onPointerUp = (event: PointerEvent<HTMLUListElement>) => {
    const state = drag.current
    const element = event.currentTarget
    drag.current = null
    if (!state?.moved) return
    element.style.scrollSnapType = ""
    // Przeciągnięcie nie jest kliknięciem w kartę.
    const swallow = (click: Event) => {
      click.preventDefault()
      click.stopPropagation()
    }
    element.addEventListener("click", swallow, { capture: true, once: true })
    setTimeout(() => element.removeEventListener("click", swallow, { capture: true }), 0)
  }

  const control =
    "grid size-11 shrink-0 fm-press place-items-center rounded-full bg-fm-fill text-fm-ink fm-focus transition-[background-color,scale] hover:bg-fm-fill-strong"

  return (
    <div className="au-rail">
      <ul
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragStart={(event) => event.preventDefault()}
        className="au-track -mx-(--au-p) flex snap-x snap-mandatory scroll-px-(--au-p) gap-(--au-gap) overflow-x-auto overscroll-x-contain px-(--au-p) pb-1"
      >
        {works.map((work, index) => (
          <li
            key={work.slug}
            className="w-[min(82%,22rem)] shrink-0 snap-start sm:w-[24rem] lg:w-[27rem]"
          >
            <a
              href={work.url ?? allHref}
              target={work.url ? "_blank" : undefined}
              rel={work.url ? "noopener noreferrer" : undefined}
              data-gx-host=""
              className="group block rounded-(--au-r-card) fm-focus"
            >
              <GlyphMedia
                poster={work.poster}
                src={work.video}
                width={4}
                height={3}
                alt={work.title}
                trigger="view"
                sizes="(min-width: 64rem) 27rem, (min-width: 40rem) 24rem, 82vw"
                loading={index < 3 ? "eager" : "lazy"}
                controls={{ pause: UI.pause, play: UI.play }}
                className="rounded-(--au-r-media)"
              />
              <span className="mt-4 flex items-baseline justify-between gap-4 px-1">
                <span className="font-medium text-pretty">{work.title}</span>
                <span className="shrink-0 text-fm-small text-fm-ink-3">{work.category}</span>
              </span>
            </a>
          </li>
        ))}
        <li className="w-[min(82%,22rem)] shrink-0 snap-start sm:w-[24rem] lg:w-[27rem]">
          <a
            href={allHref}
            className="group grid aspect-[4/3] place-items-center rounded-(--au-r-media) bg-fm-fill text-fm-ink fm-focus transition-colors hover:bg-fm-fill-strong"
          >
            <span className="inline-flex items-center gap-2 text-fm-lead font-medium">
              {UI.allWorks}
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        </li>
      </ul>

      <div className="mt-8 flex items-center gap-3">
        <div
          aria-hidden="true"
          className="au-progress me-3 h-0.5 flex-1 overflow-hidden rounded-full bg-fm-edge"
        >
          <div className="au-progress-bar h-full w-full rounded-full bg-fm-ink" />
        </div>
        <button
          type="button"
          aria-label={UI.prevWorks}
          onClick={() => step(-1)}
          className={control}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </button>
        <button type="button" aria-label={UI.nextWorks} onClick={() => step(1)} className={control}>
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  )
}
