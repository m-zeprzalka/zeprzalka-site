"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { cn } from "../forma/cn"
import { finePointer, kinetic, motionAllowed } from "./gsap"
import { motionPausedNow } from "./motion"
import { useProjection, type ProjectionWork } from "./Projection"
import { useClip } from "./use-clip"

/** Dryf taśmy (px/s), tarcie bezwładności na klatkę i próg, od którego dotyk to przeciąganie. */
const DRIFT_FINE = 34
const DRIFT_TOUCH = 26
const FRICTION = 0.94
const DRAG_THRESHOLD = 6
/** Po puszczeniu albo fokusie taśma stoi chwilę, zanim wróci dryf. */
const HOLD_MS = 1600

/**
 * Taśma: JEDEN nieskończony rząd realizacji jako zdanie z kadrami — kadr,
 * tytuł w skali plakatu, kadr, tytuł… Dryfuje powoli, daje się przeciągnąć
 * kciukiem albo myszą (z bezwładnością), staje pod kursorem i przy fokusie,
 * zatrzymuje się razem z pauzą ruchu. Kadr pod kursorem gra swoje wideo.
 * Klik otwiera projekcję (kadr przelatuje do dużego okna).
 *
 * Bez JS albo przy „ogranicz ruch”: zwykłe przewijanie poziome ze snapem.
 * Pozycja żyje poza Reactem (`gsap.ticker`, transform na torze) — zero
 * renderów na klatkę.
 */
export function Strip({ works, label }: { works: readonly ProjectionWork[]; label: string }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [copies, setCopies] = useState(1)
  const [hovered, setHovered] = useState<string | null>(null)
  const { open } = useProjection()

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || !motionAllowed()) return
    const { gsap } = kinetic()
    const first = track.firstElementChild as HTMLElement | null
    if (!first) return

    // Tyle kopii toru, ile trzeba, żeby pętla nie miała szwu na tym ekranie.
    const setWidth = () => first.offsetWidth
    const needed = () => Math.max(2, Math.ceil((viewport.offsetWidth * 2) / setWidth()) + 1)
    setCopies(needed())
    viewport.setAttribute("data-live", "")

    const fine = finePointer()
    const drift = fine ? DRIFT_FINE : DRIFT_TOUCH
    let x = 0
    let velocity = 0
    let hold = 0
    let hover = false
    let focused = false
    let drag: { id: number; last: number; moved: number; time: number; active: boolean } | null =
      null

    const render = () => {
      const width = setWidth()
      const wrapped = gsap.utils.wrap(-width, 0, x)
      track.style.transform = `translate3d(${wrapped}px, 0, 0)`
    }

    const tick = (_time: number, delta: number) => {
      if (drag?.active) return render()
      if (Math.abs(velocity) > 0.05) {
        x += velocity * (delta / 16.67)
        velocity *= Math.pow(FRICTION, delta / 16.67)
      } else if (!hover && !focused && performance.now() > hold && !motionPausedNow()) {
        x -= (drift * delta) / 1000
      }
      render()
    }
    gsap.ticker.add(tick)

    const down = (event: PointerEvent) => {
      if (event.button !== 0) return
      velocity = 0
      drag = {
        id: event.pointerId,
        last: event.clientX,
        moved: 0,
        time: event.timeStamp,
        active: false,
      }
    }
    const move = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return
      const dx = event.clientX - drag.last
      const dt = Math.max(1, event.timeStamp - drag.time)
      drag.moved += Math.abs(dx)
      drag.last = event.clientX
      drag.time = event.timeStamp
      if (!drag.active && drag.moved > DRAG_THRESHOLD) {
        drag.active = true
        viewport.setPointerCapture(event.pointerId)
        viewport.setAttribute("data-dragging", "")
      }
      if (drag.active) {
        x += dx
        // Prędkość w px na klatkę 60 Hz, wygładzona — bezwładność po puszczeniu.
        velocity = velocity * 0.6 + (dx / dt) * 16.67 * 0.4
      }
    }
    const up = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return
      const wasDrag = drag.active
      drag = null
      viewport.removeAttribute("data-dragging")
      hold = performance.now() + HOLD_MS
      if (!wasDrag) velocity = 0
      // Klik tuż po przeciągnięciu (mysz od razu, dotyk z opóźnieniem) nie otwiera projekcji.
      else suppressUntil = performance.now() + 400
    }
    let suppressUntil = 0
    const swallow = (click: MouseEvent) => {
      if (performance.now() > suppressUntil) return
      click.preventDefault()
      click.stopPropagation()
    }
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hover = true
    }
    const leave = () => {
      hover = false
    }
    // Fokus z klawiatury: taśma od razu (bez animacji) pokazuje element na środku.
    const focusIn = (event: FocusEvent) => {
      focused = true
      const target = event.target as HTMLElement
      // Tylko fokus z klawiatury — klik myszą też fokusuje przycisk, a przeskok toru zgubiłby klik.
      if (!target.matches(":focus-visible")) return
      const item = target.closest<HTMLElement>("[data-kn-item]")
      if (!item) return
      x = -(item.offsetLeft - (viewport.offsetWidth - item.offsetWidth) / 2)
      velocity = 0
      render()
    }
    const focusOut = () => {
      focused = false
      hold = performance.now() + HOLD_MS
    }

    viewport.addEventListener("pointerdown", down)
    viewport.addEventListener("pointermove", move)
    viewport.addEventListener("pointerup", up)
    viewport.addEventListener("pointercancel", up)
    viewport.addEventListener("click", swallow, { capture: true })
    viewport.addEventListener("pointerenter", enter)
    viewport.addEventListener("pointerleave", leave)
    viewport.addEventListener("focusin", focusIn)
    viewport.addEventListener("focusout", focusOut)
    const resize = new ResizeObserver(() => setCopies(needed()))
    resize.observe(viewport)

    return () => {
      gsap.ticker.remove(tick)
      resize.disconnect()
      viewport.removeAttribute("data-live")
      viewport.removeEventListener("pointerdown", down)
      viewport.removeEventListener("pointermove", move)
      viewport.removeEventListener("pointerup", up)
      viewport.removeEventListener("pointercancel", up)
      viewport.removeEventListener("click", swallow, { capture: true })
      viewport.removeEventListener("pointerenter", enter)
      viewport.removeEventListener("pointerleave", leave)
      viewport.removeEventListener("focusin", focusIn)
      viewport.removeEventListener("focusout", focusOut)
      track.style.transform = ""
    }
  }, [])

  return (
    <div
      ref={viewportRef}
      role="region"
      aria-label={label}
      className="kn-strip"
      data-hovering={hovered ? "" : undefined}
    >
      <div ref={trackRef} className="kn-strip-track">
        {Array.from({ length: copies }, (_, copy) => (
          // Kopie toru tylko dla oka: bez czytnika i poza kolejnością Tab, ale klikalne myszą.
          <ul key={copy} className="kn-strip-set" aria-hidden={copy > 0 || undefined}>
            {works.map((work) => {
              const key = `${copy}:${work.slug}`
              return (
                <li key={work.slug} data-kn-item="" className="kn-strip-item">
                  <button
                    type="button"
                    data-kn-slug={work.slug}
                    tabIndex={copy > 0 ? -1 : undefined}
                    onClick={(event) =>
                      open(
                        work.slug,
                        event.currentTarget.querySelector<HTMLElement>("[data-kn-frame]")
                      )
                    }
                    onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(key)}
                    onPointerLeave={() => setHovered(null)}
                    className={cn("kn-strip-button fm-focus", hovered === key && "is-hot")}
                    style={{ "--kn-ratio": work.width / work.height } as CSSProperties}
                  >
                    <StripFrame work={work} playing={hovered === key} />
                    <StripTitle work={work} playing={hovered === key} />
                  </button>
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </div>
  )
}

/**
 * Tytuł jako szablon: pod kursorem za literami rusza klip realizacji, a sam
 * tytuł ma tło płótna i tryb mieszania (jak „Okno”) — film widać wyłącznie
 * w literach. Bez najechania to zwykły czarny (biały) tytuł.
 */
function StripTitle({ work, playing }: { work: ProjectionWork; playing: boolean }) {
  const [videoRef, clip] = useClip(work.video, playing)
  return (
    <span className="kn-strip-word" data-live={clip.visible ? "" : undefined}>
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
        />
      )}
      <span className="kn-strip-title">{work.title}</span>
    </span>
  )
}

/** Kadr taśmy: plakat od razu, wideo dopiero pod kursorem (desktop) — jedno naraz. */
function StripFrame({ work, playing }: { work: ProjectionWork; playing: boolean }) {
  const [videoRef, clip] = useClip(work.video, playing)

  return (
    <span className="kn-strip-media">
      <span data-kn-frame="" className="kn-strip-frame">
        {/* eslint-disable-next-line @next/next/no-img-element -- plakaty mają już docelowy rozmiar (WebP 720 px) */}
        <img
          src={work.poster}
          alt=""
          width={work.width}
          height={work.height}
          loading="lazy"
          decoding="async"
          draggable={false}
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
              "transition-opacity duration-300",
              clip.visible ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </span>
      <span className="kn-strip-cat">{work.category}</span>
    </span>
  )
}
