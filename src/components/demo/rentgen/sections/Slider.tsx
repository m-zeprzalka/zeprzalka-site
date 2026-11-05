"use client"

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react"
import Image from "next/image"
import { ArrowUpRight, Pause, Play } from "lucide-react"
import { useReducedMotion } from "../../forma/use-in-view"

export interface SlideWork {
  slug: string
  title: string
  category: string
  poster: string
  width: number
  height: number
  video?: string
  href: string
  external: boolean
}

/** Liczba kopii toru: środkowa jest „domem”, boczne dają zapas na rzut palcem. */
const COPIES = 3
const noop = () => () => {}
/** Tempo auto-ruchu (px/s) i czas po interakcji, po którym wraca. */
const SPEED = 30
const IDLE_MS = 1600

/**
 * JEDEN nieskończony rząd kart realizacji. Natywne przewijanie poziome — palec
 * na telefonie ma prawdziwą bezwładność; myszą można przeciągać (z rzutem),
 * kółkiem z Shiftem albo gładzikiem przewijać. Tor ma trzy kopie listy; gdy
 * nic się nie dzieje, pozycja wraca niepostrzeżenie do środkowej kopii i rząd
 * sam jedzie w lewo. Pauza: przycisk (WCAG 2.2.2), najechanie, fokus, dotyk.
 * Karty mają własne klisze (soczewka wie, że się ruszają).
 */
export function Slider({
  works,
  labels,
  faces,
  trackFace,
}: {
  works: readonly SlideWork[]
  labels: { region: string; pause: string; play: string; newTab: string }
  /** Klisze kart (kod + znaki) z serwera, w kolejności `works`. */
  faces: readonly ReactNode[]
  /** Klisza pasa pod kartami (tło soczewki między kartami). */
  trackFace: ReactNode
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [stopped, setStopped] = useState(false)
  const stoppedRef = useRef(false)
  const dragged = useRef(false)
  // HTML z serwera ma jedną kopię listy (lżejszy dokument); boczne kopie dochodzą po hydratacji.
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )

  useEffect(() => {
    if (hydrated) window.dispatchEvent(new Event("rg-faces"))
  }, [hydrated])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !hydrated) return
    let setWidth = 0
    let pos = 0
    let frame = 0
    let last = performance.now()
    let visible = false
    let hovering = false
    let focused = false
    let active = 0 // znacznik czasu ostatniej interakcji
    let speed = 0
    let drag: { x: number; start: number; v: number; t: number } | null = null
    let glide = 0

    const measure = () => {
      setWidth = track.scrollWidth / COPIES
      if (!setWidth) return
      if (track.scrollLeft < setWidth * 0.25 || track.scrollLeft > setWidth * 1.75) {
        track.scrollLeft = setWidth + (track.scrollLeft % setWidth)
      }
      pos = track.scrollLeft
    }
    measure()

    const normalize = () => {
      if (!setWidth) return
      let left = track.scrollLeft
      if (left < setWidth * 0.5) left += setWidth
      else if (left > setWidth * 1.5) left -= setWidth
      if (left !== track.scrollLeft) track.scrollLeft = left
      pos = track.scrollLeft
    }

    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const idle = now - active > IDLE_MS && !drag && !glide
      const target =
        !reduced && !stoppedRef.current && visible && idle && !hovering && !focused ? SPEED : 0
      speed += (target - speed) * Math.min(1, dt * 4)
      if (Math.abs(speed) > 0.2 && setWidth) {
        if (Math.abs(track.scrollLeft - pos) > 2) pos = track.scrollLeft
        pos += speed * dt
        if (pos > setWidth * 1.5) pos -= setWidth
        track.scrollLeft = pos
      }
      if (visible) frame = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!frame) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    const visibility = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      if (visible) start()
    })
    visibility.observe(track)
    const sizes = new ResizeObserver(measure)
    sizes.observe(track)

    let scrollTimer: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      if (Math.abs(track.scrollLeft - pos) > 2) active = performance.now()
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        if (!drag) normalize()
      }, 180)
    }
    const touch = () => (active = performance.now())
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovering = true
    }
    const leave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovering = false
    }
    const focusIn = () => (focused = true)
    const focusOut = (event: FocusEvent) => {
      if (!track.contains(event.relatedTarget as Node | null)) focused = false
    }

    // Przeciąganie myszą z rzutem (dotyk ma natywne przewijanie).
    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return
      cancelAnimationFrame(glide)
      glide = 0
      drag = { x: event.clientX, start: track.scrollLeft, v: 0, t: performance.now() }
      dragged.current = false
      active = performance.now()
    }
    const move = (event: PointerEvent) => {
      if (!drag) return
      const dx = event.clientX - drag.x
      if (!dragged.current && Math.abs(dx) > 6) {
        dragged.current = true
        track.setPointerCapture(event.pointerId)
        track.dataset.dragging = ""
      }
      if (!dragged.current) return
      const now = performance.now()
      const next = drag.start - dx
      drag.v = (next - track.scrollLeft) / Math.max(1, now - drag.t)
      drag.t = now
      track.scrollLeft = next
      active = now
    }
    const up = () => {
      if (!drag) return
      let velocity = drag.v * 16
      drag = null
      delete track.dataset.dragging
      const step = () => {
        velocity *= 0.94
        track.scrollLeft += velocity
        active = performance.now()
        if (Math.abs(velocity) > 0.3) glide = requestAnimationFrame(step)
        else {
          glide = 0
          normalize()
        }
      }
      glide = requestAnimationFrame(step)
    }

    track.addEventListener("scroll", onScroll, { passive: true })
    track.addEventListener("touchstart", touch, { passive: true })
    track.addEventListener("wheel", touch, { passive: true })
    track.addEventListener("pointerenter", enter)
    track.addEventListener("pointerleave", leave)
    track.addEventListener("focusin", focusIn)
    track.addEventListener("focusout", focusOut)
    track.addEventListener("pointerdown", down)
    track.addEventListener("pointermove", move)
    track.addEventListener("pointerup", up)
    track.addEventListener("pointercancel", up)
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(glide)
      clearTimeout(scrollTimer)
      visibility.disconnect()
      sizes.disconnect()
      track.removeEventListener("scroll", onScroll)
      track.removeEventListener("touchstart", touch)
      track.removeEventListener("wheel", touch)
      track.removeEventListener("pointerenter", enter)
      track.removeEventListener("pointerleave", leave)
      track.removeEventListener("focusin", focusIn)
      track.removeEventListener("focusout", focusOut)
      track.removeEventListener("pointerdown", down)
      track.removeEventListener("pointermove", move)
      track.removeEventListener("pointerup", up)
      track.removeEventListener("pointercancel", up)
    }
  }, [reduced, hydrated])

  // Po przeciągnięciu klik nie otwiera karty.
  const guard = (event: MouseEvent) => {
    if (dragged.current) {
      event.preventDefault()
      dragged.current = false
    }
  }

  return (
    <div className="relative">
      <div className="fm-container mb-4 flex min-h-11 items-center justify-end">
        <button
          type="button"
          onClick={() => {
            stoppedRef.current = !stopped
            setStopped(!stopped)
          }}
          className="-me-3 inline-flex h-11 fm-press items-center gap-2 rounded-full ps-3.5 pe-4 text-fm-small font-medium text-fm-ink-2 fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink motion-reduce:hidden"
        >
          {stopped ? (
            <Play aria-hidden="true" className="size-3.5 fill-current" />
          ) : (
            <Pause aria-hidden="true" className="size-3.5 fill-current" />
          )}
          {stopped ? labels.play : labels.pause}
        </button>
      </div>
      <div data-rg-host="works-track" className="rg-track-wrap">
        {trackFace}
        <div
          ref={trackRef}
          role="region"
          aria-label={labels.region}
          tabIndex={-1}
          className="rg-track"
        >
          {Array.from({ length: COPIES }, (_, copy) => copy)
            .filter((copy) => hydrated || copy === 1)
            .map((copy) => (
              <ul
                key={copy}
                className="rg-track__set"
                aria-hidden={copy !== 1 || undefined}
                inert={copy !== 1}
              >
                {works.map((work, index) => (
                  <li key={work.slug} className="rg-card-slot">
                    <Card
                      work={work}
                      index={index}
                      total={works.length}
                      newTab={labels.newTab}
                      onClick={guard}
                      face={faces[index]}
                    />
                  </li>
                ))}
              </ul>
            ))}
        </div>
      </div>
    </div>
  )
}

function Card({
  work,
  index,
  total,
  newTab,
  onClick,
  face,
}: {
  work: SlideWork
  index: number
  total: number
  newTab: string
  onClick: (event: MouseEvent) => void
  face: ReactNode
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(false)

  // Wideo tylko pod myszą: plik dopiero przy pierwszym najechaniu, `play()` po zatwierdzeniu źródła.
  useEffect(() => {
    const video = videoRef.current
    if (!video || !armed) return
    void video.play().catch(() => {})
  }, [armed])

  return (
    <a
      href={work.href}
      target={work.external ? "_blank" : undefined}
      rel={work.external ? "noopener noreferrer" : undefined}
      onClick={onClick}
      draggable={false}
      data-rg-host={`card-${work.slug}`}
      data-rg-name="Card"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse" || !work.video) return
        if (armed) void videoRef.current?.play().catch(() => {})
        else setArmed(true)
      }}
      onPointerLeave={() => videoRef.current?.pause()}
      className="rg-card fm-focus"
      style={{ "--rg-ratio": work.width / work.height } as CSSProperties}
    >
      <span data-rg-key="card-media" className="rg-card__media">
        {/* Stały rozmiar zamiast `sizes`: srcset 1×/2× — trzy kopie toru nie puchną od list szerokości. */}
        <Image
          src={work.poster}
          width={Math.round(272 * (work.width / work.height))}
          height={272}
          alt=""
          draggable={false}
          className="h-full w-full object-cover"
        />
        {work.video && (
          <video
            ref={videoRef}
            src={armed ? work.video : undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            className="rg-card__video"
            onPlaying={(event) => (event.currentTarget.dataset.playing = "")}
          />
        )}
      </span>
      <span className="flex items-baseline justify-between gap-3 px-2.5 pt-3 pb-1.5">
        <span className="min-w-0">
          <span className="block truncate text-[0.875rem] font-[560] tracking-[-0.015em] text-fm-ink">
            {work.title}
            {work.external && (
              <ArrowUpRight aria-hidden="true" className="ms-1 inline size-3.5 text-fm-ink-3" />
            )}
            {work.external && <span className="sr-only"> ({newTab})</span>}
          </span>
          <span className="block truncate text-[0.8125rem] text-fm-ink-3">{work.category}</span>
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-[0.6875rem] text-fm-ink-3 tabular-nums"
        >
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </span>
      {face}
    </a>
  )
}
