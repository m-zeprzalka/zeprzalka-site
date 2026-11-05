"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import type { SectionId } from "../lab/config"
import { addPlayer, removePlayer, setHovered } from "../engine/players"
import { easeOut, passPeriod, ScrollSettle } from "../engine/timing"
import { useSurface } from "../engine/useSurface"

/**
 * Obraz (i opcjonalnie wideo) zakodowany w glifach (D, F). Postęp 0 → 1 to
 * odkodowanie w kolor: pasmo danego rodzaju (fala od kursora, skaner, rozpad…)
 * odsłania prawdziwe media pod płótnem. Wyzwalacze:
 * - najechanie — koduje się z powrotem po zjechaniu; na dotyku: raz, po wejściu w kadr,
 * - przewijanie — postęp z położenia kafla w kadrze (w obie strony),
 * - ciągły — kafle same oddychają: kolor, przebieg glifów, kolor (rozstrzelone w czasie).
 * Wideo dostaje źródło dopiero przy dekodowaniu; dopóki gra, glify liczą się z jego
 * klatek. Bez JS i przy ograniczonym ruchu — zwykły obraz w kolorze.
 */
export function MediaSurface({
  section,
  src,
  width,
  height,
  sizes,
  video,
  index = 0,
  mode = "tile",
  rest = "code",
  controls,
  className,
  rounded = "rounded-fm-2xl",
}: {
  section: SectionId
  src: string
  width: number
  height: number
  sizes: string
  video?: string
  index?: number
  /** `reveal` — podgląd w oknie: dekoduje się sam chwilę po otwarciu. */
  mode?: "tile" | "reveal"
  /**
   * Stan spoczynku: `code` — wydruk z glifów, odkodowany wyzwalaczem (realizacje);
   * `image` — prawdziwy obraz, wyzwalacz puszcza tylko przebieg glifów (okładki bloga).
   */
  rest?: "code" | "image"
  controls?: { pause: string; play: string }
  className?: string
  rounded?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { surface, variant, reduced, auto } = useSurface(
    "media",
    section,
    wrapRef,
    canvasRef,
    "300px 0px"
  )
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false)
  const [shown, setShown] = useState(false)
  const [armed, setArmed] = useState(false)
  const [elected, setElected] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [stoppedChoice, setStopped] = useState<boolean | null>(null)
  const stopped = stoppedChoice ?? reduced
  const state = useRef({ p: 0, goal: 0, last: 0, x: 0.5, y: 0, once: false })

  // `onLoad` z next/image bywa przed hydratacją — sprawdzamy `complete` po klatce.
  useEffect(() => {
    const image = imageRef.current
    if (!image) return
    const done = () => setLoaded(true)
    if (image.complete && image.naturalWidth > 0) {
      const frame = requestAnimationFrame(done)
      return () => cancelAnimationFrame(frame)
    }
    image.addEventListener("load", done, { once: true })
    return () => image.removeEventListener("load", done)
  }, [])

  useEffect(() => {
    const image = imageRef.current
    if (!surface || !loaded || !image || reduced) return
    const videoEl = videoRef.current
    surface.setSource(
      video && videoEl
        ? { type: "video", video: videoEl, poster: image }
        : { type: "image", image, fit: "cover" }
    )
    // Wydruk czyta się jak obraz: krawędzie z gradientu (układ zrzutów stron), najmniejsze
    // pokrycie tuszem (papier nigdy nie jest pusty), ton bez przycinania jasnych partii.
    surface.configure({
      gamma: 1,
      dgamma: 1.15,
      sharp: 0.3,
      curve: false,
      autoEdge: 5,
      edgeInk: 0.7,
      floor: 0.06,
    })
    setReady(true)
  }, [surface, loaded, reduced, video])

  // Spoczynek „obraz” (domyślny w realizacjach i zawsze w oknie podglądu): przygaszony obraz
  // z glifami w jego kolorze — od pierwszej klatki widać prawdziwą pracę, nie zaślepkę.
  const veil = mode === "reveal" || (section === "works" && variant.rest === "veil")
  useEffect(() => {
    // Przy zasłonie obraz sam niesie układ — bez minimalnego pokrycia (siatka kropek po całym kaflu).
    surface?.configure(
      veil ? { veil: 1, floor: 0, edgeInk: 0.45 } : { veil: 0, floor: 0.06, edgeInk: 0.7 }
    )
  }, [surface, veil])

  // Wyzwalacze i postęp.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!surface || !ready || !wrap || reduced) return
    const s = state.current
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const host = wrap.closest<HTMLElement>("[data-gll-host]") ?? wrap
    const trigger =
      mode === "reveal"
        ? "reveal"
        : variant.trigger === "hover" && coarse
          ? "view"
          : variant.trigger
    const decodeMs = variant.decode
    // Zakodowany kafel w spoczynku nie przelicza się wcale — tylko cykl „ciągły” biegnie sam.
    surface.configure({ animate: auto && trigger === "continuous" })
    const offset = index * 1.7
    const shownRef = { current: false }
    const settle = new ScrollSettle()
    let armedFlag = false
    const setArmedOnce = () => {
      if (armedFlag) return
      armedFlag = true
      setArmed(true)
    }

    surface.setFrame((now, dyn) => {
      const dt = s.last ? Math.min(64, now - s.last) : 16
      s.last = now
      const { cw, ch } = surface.cells
      const { width, height, dpr } = surface.size
      if (trigger === "scroll") {
        const rect = wrap.getBoundingClientRect()
        const vh = window.innerHeight
        s.p = s.goal = settle.update((vh * 0.98 - rect.top) / (vh * 0.55), surface.visible, dt)
      } else if (trigger === "continuous") {
        // Cykl: kolor 4 s → zakodowanie → chwila glifów → odkodowanie (kafle przesunięte w czasie).
        const period = passPeriod(variant.decode) + 3
        const t = ((surface.time + offset) % period) / period
        s.goal = t < 0.62 ? 1 : t < 0.74 ? 1 - (t - 0.62) / 0.12 : t < 0.84 ? 0 : (t - 0.84) / 0.16
        s.p = easeOut(Math.min(1, Math.max(0, s.goal)))
      } else {
        const speed = dt / Math.max(300, s.goal > s.p ? decodeMs : decodeMs * 0.6)
        s.p = s.goal > s.p ? Math.min(s.goal, s.p + speed) : Math.max(s.goal, s.p - speed)
      }
      dyn.progress = s.p
      dyn.from = [(s.x * width * dpr) / cw, (s.y * height * dpr) / ch]
      const done = s.p >= 1 && s.goal >= 1
      if (done !== shownRef.current) {
        shownRef.current = done
        setShown(done)
      }
      if (s.p > 0.25) setArmedOnce()
      // Odkodowany i spokojny — płótno zasypia (pamięć).
      if (done && trigger !== "continuous" && trigger !== "scroll") {
        queueMicrotask(() => surface.park())
        return false
      }
      return s.p !== s.goal || trigger === "continuous" || (trigger === "scroll" && settle.pending)
    })

    /** Okładka w spoczynku jest obrazem; wyzwalacz puszcza pasmo glifów, potem płótno zasypia. */
    function passOverImage(kind: string): () => void {
      if (!surface || !wrap) return () => {}
      const passMs = Math.max(700, variant.decode * 1.3)
      let pass = -1
      setShown(true)
      surface.setFrame((now, dyn) => {
        const { cw, ch } = surface.cells
        const { width, height, dpr } = surface.size
        let loop = -1
        if (kind === "scroll") {
          const rect = wrap.getBoundingClientRect()
          const vh = window.innerHeight
          const p = settle.update(
            (vh * 0.95 - rect.top) / (vh * 0.6 + rect.height),
            surface.visible,
            16
          )
          loop = p > 0 && p < 1 ? p : -1
        } else if (kind === "continuous") {
          const period = passPeriod(variant.decode) + 2
          const t = ((surface.time + offset) % period) / period
          loop = t < 0.35 ? t / 0.35 : -1
        } else if (pass >= 0) {
          // Znacznik klatki bywa sprzed zdarzenia, które puściło przebieg — stąd max(0, …).
          const p = Math.max(0, (now - pass) / passMs)
          if (p >= 1) pass = -1
          else loop = p
        }
        dyn.loop = loop
        dyn.progress = 1
        dyn.from = [(s.x * width * dpr) / cw, (s.y * height * dpr) / ch]
        if (loop < 0 && kind !== "continuous" && kind !== "scroll") {
          queueMicrotask(() => surface.park())
          return false
        }
        return loop >= 0
      })
      const start = (x = 0.5, y = 0) => {
        s.x = x
        s.y = y
        pass = performance.now()
        surface.wakeUp()
        surface.invalidate()
      }
      if (kind === "hover" || kind === "view") surface.park()
      const onEnter = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return
        const rect = wrap.getBoundingClientRect()
        start((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height)
      }
      const onFocus = () => start(0.5, 0)
      const view = new IntersectionObserver(
        ([entry]) => {
          if (!entry || entry.intersectionRatio < 0.55 || s.once) return
          s.once = true
          start(0.5, 0)
        },
        { threshold: [0, 0.55] }
      )
      if (kind === "hover") {
        host.addEventListener("pointerenter", onEnter)
        host.addEventListener("focusin", onFocus)
      }
      if (kind === "view") view.observe(wrap)
      return () => {
        host.removeEventListener("pointerenter", onEnter)
        host.removeEventListener("focusin", onFocus)
        view.disconnect()
      }
    }

    const decode = (x = 0.5, y = 0) => {
      s.x = x
      s.y = y
      s.goal = 1
      surface.wakeUp()
      surface.invalidate()
    }
    const encode = (x = 0.5, y = 0) => {
      s.x = x
      s.y = y
      s.goal = 0
      surface.wakeUp()
      surface.invalidate()
    }

    const cleanups: (() => void)[] = []
    if (rest === "image" && mode !== "reveal") {
      cleanups.push(passOverImage(trigger))
    } else if (trigger === "reveal") {
      const timer = setTimeout(() => decode(0.5, 0.5), 60)
      cleanups.push(() => clearTimeout(timer))
    } else if (trigger === "view") {
      const view = new IntersectionObserver(
        ([entry]) => {
          if (!entry || entry.intersectionRatio < 0.55 || s.once) return
          s.once = true
          const rect = wrap.getBoundingClientRect()
          decode(0.5, rect.top >= 0 ? 0 : 1)
        },
        { threshold: [0, 0.55] }
      )
      view.observe(wrap)
      cleanups.push(() => view.disconnect())
    } else if (trigger === "hover") {
      const point = (event: PointerEvent) => {
        const rect = wrap.getBoundingClientRect()
        return [
          (event.clientX - rect.left) / rect.width,
          (event.clientY - rect.top) / rect.height,
        ] as const
      }
      const onEnter = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return
        setHovering(true)
        setHovered(wrap)
        decode(...point(event))
      }
      const onLeave = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return
        setHovering(false)
        setHovered(null)
        encode(...point(event))
      }
      const onFocus = () => decode(0.5, 0.5)
      const onBlur = () => encode(0.5, 0.5)
      host.addEventListener("pointerenter", onEnter)
      host.addEventListener("pointerleave", onLeave)
      host.addEventListener("focusin", onFocus)
      host.addEventListener("focusout", onBlur)
      cleanups.push(() => {
        host.removeEventListener("pointerenter", onEnter)
        host.removeEventListener("pointerleave", onLeave)
        host.removeEventListener("focusin", onFocus)
        host.removeEventListener("focusout", onBlur)
        setHovered(null)
      })
    }
    surface.wakeUp()
    surface.invalidate()
    return () => {
      cleanups.forEach((fn) => fn())
      surface.setFrame(null)
    }
  }, [surface, ready, reduced, auto, variant.trigger, variant.decode, mode, index, rest])

  // Kafel z wideo staje do „wyborów” — gra tylko jeden (najechany albo najbliżej środka).
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !video || !armed || mode === "reveal") return
    addPlayer(wrap, setElected)
    return () => removePlayer(wrap)
  }, [video, armed, mode])

  const loadVideo = !!video && (armed || (reduced && mode === "reveal"))
  const active = mode === "reveal" || elected || hovering
  const playing =
    loadVideo && active && !stopped && (shown || hovering || mode === "reveal" || reduced)

  // `play()` po zatwierdzeniu źródła (wzór: LazyVideo serwisu); glify z klatek, dopóki gra.
  useEffect(() => {
    const element = videoRef.current
    if (!element || !loadVideo) return
    if (playing) void element.play().catch(() => {})
    else element.pause()
  }, [loadVideo, playing])

  useEffect(() => {
    surface?.useVideoFrames(playing)
  }, [surface, playing])

  return (
    <div
      ref={wrapRef}
      data-ready={(ready && !reduced) || undefined}
      data-shown={shown || reduced || undefined}
      data-tone={variant.tone === "ink" ? undefined : variant.tone}
      className={cn("gll-media", rounded, className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image
        ref={imageRef}
        src={src}
        width={width}
        height={height}
        sizes={sizes}
        alt=""
        className="gll-media__image"
      />
      {video && (
        <video
          ref={videoRef}
          src={loadVideo ? video : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={(event) => (event.currentTarget.dataset.playing = "")}
          className="gll-media__video"
        />
      )}
      <canvas ref={canvasRef} aria-hidden="true" className="gll-media__canvas" />
      {controls && loadVideo && (
        <button
          type="button"
          onClick={() => setStopped(!stopped)}
          aria-label={stopped ? controls.play : controls.pause}
          title={stopped ? controls.play : controls.pause}
          className="absolute end-3 bottom-3 z-[4] grid size-11 fm-press place-items-center rounded-full bg-fm-surface/85 text-fm-ink shadow-fm-ring fm-focus backdrop-blur-md transition-[background-color,scale] hover:bg-fm-surface"
        >
          {stopped ? (
            <Play aria-hidden="true" className="size-4" />
          ) : (
            <Pause aria-hidden="true" className="size-4" />
          )}
        </button>
      )}
    </div>
  )
}
