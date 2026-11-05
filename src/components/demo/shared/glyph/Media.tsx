"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import type { SkeletonTone } from "./engine/palette"
import { hoverIntent } from "./engine/intent"
import { addPlayer, removePlayer, setHovered } from "./engine/players"
import type { GlyphSettings } from "./settings"
import { localPoint, useSettings, useSurface } from "./useSurface"

const noop = () => () => {}
let webmSupport: boolean | undefined
function canPlayWebm() {
  webmSupport ??= document.createElement("video").canPlayType("video/webm") !== ""
  return webmSupport
}

/** Siatka kropek szkieletu (zanim silnik narysuje wydruk) — ta sama komórka co glify (8 × 12,8). */
const DOTS: Record<SkeletonTone, CSSProperties> = {
  dark: {
    backgroundColor: "#0b0b0b",
    backgroundImage: "radial-gradient(circle at center, #3a3a3a 0.9px, transparent 1.3px)",
    backgroundSize: "8px 12.8px",
  },
  theme: {
    backgroundColor: "var(--fm-fill)",
    backgroundImage:
      "radial-gradient(circle at center, color-mix(in oklch, var(--fm-ink-3) 45%, transparent) 0.9px, transparent 1.3px)",
    backgroundSize: "8px 12.8px",
  },
}

/**
 * Obraz albo wideo, które zaczyna jako szkielet ze znaków (białe i szare
 * glify na czerni) i wyłania się w prawdziwe media falą od kursora. Szkielet
 * stoi od pierwszego malowania (siatka kropek z CSS, potem wydruk z silnika) —
 * żadnych pustych prostokątów. Wideo dostaje źródło dopiero przy odkodowaniu
 * (oszczędność transferu); gra najwyżej jedno naraz (najechane albo najbliżej
 * środka ekranu), poza kadrem stoi.
 *
 * Wyzwalacze: `hover` — odkodowanie pod kursorem, zakodowanie po zjechaniu
 * (na dotyku: raz, po wejściu w kadr); `view` — raz, po wejściu w kadr;
 * `manual` — steruje prop `decoded`. Host najechania: najbliższy przodek
 * z `data-gx-host` (cała karta), inaczej sam kadr. „Ogranicz ruch” — zwykły
 * obraz bez szkieletu i bez autoodtwarzania.
 */
export function GlyphMedia({
  poster,
  src: mp4,
  webm,
  width,
  height,
  alt = "",
  sizes = "(min-width: 1024px) 40vw, 100vw",
  trigger = "hover",
  decoded,
  skeleton = "dark",
  loading,
  preload,
  settings: patch,
  controls,
  className,
}: {
  /** Obraz (plakat wideo albo sam obraz). */
  poster: string
  /** Wideo MP4 (opcjonalne) — ładowane dopiero przy odkodowaniu. */
  src?: string
  /** To samo wideo w WebM (opcjonalne) — wybierane, gdy przeglądarka je odtworzy. */
  webm?: string
  width: number
  height: number
  alt?: string
  sizes?: string
  trigger?: "hover" | "view" | "manual"
  /** Tylko `trigger="manual"`: odkodowane czy nie. */
  decoded?: boolean
  skeleton?: SkeletonTone
  loading?: "lazy" | "eager"
  preload?: boolean
  settings?: Partial<GlyphSettings>
  /** Napisy przycisku pauzy wideo (bez nich przycisku nie ma). */
  controls?: { pause: string; play: string }
  className?: string
}) {
  // Szkielet mediów: kropki i koła (wydruk z The Best Of, pochwalony) — znaki logo są za „głośne”.
  const settings = useSettings({ mode: "wave", charset: "dots", ...patch })
  // Format wybierany przed pobraniem: WebM, gdy przeglądarka go odtworzy, inaczej MP4
  // (źródło i tak trafia do <video> dopiero po hydratacji, przy odkodowaniu).
  const webmOk = useSyncExternalStore(noop, canPlayWebm, () => false)
  const src = webm && (webmOk || !mp4) ? webm : mp4
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { surface, reduced, failed } = useSurface("media", settings, wrapRef, canvasRef, {
    margin: "300px 0px",
    skeleton,
    retire: false,
  })
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false)
  const [shown, setShown] = useState(false)
  const [armed, setArmed] = useState(false)
  const [elected, setElected] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [stoppedChoice, setStopped] = useState<boolean | null>(null)
  const stopped = stoppedChoice ?? reduced
  const state = useRef({ p: 0, goal: 0, last: 0, x: 0.5, y: 0, once: false })
  const manualRef = useRef(decoded)
  /** Odkodowanie i zakodowanie (gdy silnik gotowy) — woła je najechanie z zamiarem. */
  const control = useRef<{
    decode?: (x: number, y: number) => void
    encode?: (x: number, y: number) => void
  }>({})
  const hoverRef = useRef(false)

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
      src && videoEl
        ? { type: "video", video: videoEl, poster: image }
        : { type: "image", image, fit: "cover" }
    )
    // Wydruk czyta się jak obraz: krawędzie z gradientu, najmniejsze pokrycie tuszem
    // (papier nigdy nie jest pusty), ton bez przycinania jasnych partii.
    surface.configure({
      gamma: 1,
      dgamma: 1.15,
      sharp: 0.3,
      curve: false,
      autoEdge: 5,
      edgeInk: 0.7,
      floor: 0.06,
      animate: false,
    })
    surface.whenRendered(() => setReady(true))
  }, [surface, loaded, reduced, src])

  // Postęp odkodowania i wyzwalacze.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!surface || !ready || !wrap || reduced) return
    const s = state.current
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const host = wrap.closest<HTMLElement>("[data-gx-host]") ?? wrap
    const mode = trigger === "hover" && coarse ? "view" : trigger
    const decodeMs = settings.decode
    const shownRef = { current: false }
    let armedFlag = false

    surface.setFrame((now, dyn) => {
      const dt = s.last ? Math.min(64, now - s.last) : 16
      s.last = now
      const { cw, ch } = surface.cells
      const { width: w, height: h, dpr } = surface.size
      const speed = dt / Math.max(300, s.goal > s.p ? decodeMs : decodeMs * 0.6)
      s.p = s.goal > s.p ? Math.min(s.goal, s.p + speed) : Math.max(s.goal, s.p - speed)
      dyn.progress = s.p
      dyn.from = [(s.x * w * dpr) / cw, (s.y * h * dpr) / ch]
      const done = s.p >= 1 && s.goal >= 1
      if (done !== shownRef.current) {
        shownRef.current = done
        setShown(done)
      }
      if (s.p > 0.25 && !armedFlag) {
        armedFlag = true
        setArmed(true)
      }
      // Odkodowany i spokojny — płótno zasypia (pamięć).
      if (done) {
        queueMicrotask(() => surface.park())
        return false
      }
      return s.p !== s.goal
    })

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
    if (mode === "manual") {
      if (manualRef.current) decode(0.5, 0.5)
      const onManual = (event: Event) => {
        const on = (event as CustomEvent<boolean>).detail
        if (on) decode(0.5, 0.5)
        else encode(0.5, 0.5)
      }
      wrap.addEventListener("gx-decode", onManual)
      cleanups.push(() => wrap.removeEventListener("gx-decode", onManual))
    } else if (mode === "view") {
      // Połowa kadru w oknie albo — dla kadrów wyższych niż okno — 40% wysokości okna.
      const view = new IntersectionObserver(
        ([entry]) => {
          if (!entry || s.once) return
          const enough =
            entry.intersectionRatio >= 0.5 ||
            entry.intersectionRect.height >= window.innerHeight * 0.4
          if (!enough) return
          s.once = true
          decode(0.5, entry.boundingClientRect.top >= 0 ? 0 : 1)
        },
        { threshold: [0, 0.1, 0.25, 0.5] }
      )
      view.observe(wrap)
      cleanups.push(() => view.disconnect())
    } else {
      // Najechanie (z zamiarem — efekt niżej) woła `decode`/`encode` przez `control`.
      control.current = { decode, encode }
      const onFocus = () => decode(0.5, 0.5)
      const onBlur = () => encode(0.5, 0.5)
      host.addEventListener("focusin", onFocus)
      host.addEventListener("focusout", onBlur)
      // Kursor już nad kartą, zanim silnik był gotowy — odkoduj od razu.
      if (hoverRef.current) decode(0.5, 0.5)
      cleanups.push(() => {
        control.current = {}
        host.removeEventListener("focusin", onFocus)
        host.removeEventListener("focusout", onBlur)
      })
    }
    surface.wakeUp()
    surface.invalidate()
    return () => {
      cleanups.forEach((fn) => fn())
      surface.setFrame(null)
    }
  }, [surface, ready, reduced, trigger, settings.decode])

  // Sterowanie z zewnątrz (`trigger="manual"`).
  useEffect(() => {
    manualRef.current = decoded
    wrapRef.current?.dispatchEvent(new CustomEvent("gx-decode", { detail: !!decoded }))
  }, [decoded])

  // Najechanie myszą (hover intent): pierwszeństwo w „wyborach” wideo przy każdym wyzwalaczu,
  // przy `hover` także odkodowanie. Działa bez silnika (wideo gra i bez szkieletu).
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || trigger === "manual") return
    const host = wrap.closest<HTMLElement>("[data-gx-host]") ?? wrap
    const point = (event: PointerEvent) => {
      const [x, y] = localPoint(wrap, event.clientX, event.clientY)
      return [x / Math.max(1, wrap.offsetWidth), y / Math.max(1, wrap.offsetHeight)] as const
    }
    const stop = hoverIntent(
      host,
      (event) => {
        hoverRef.current = true
        setHovering(true)
        setHovered(wrap)
        if (trigger === "hover") control.current.decode?.(...point(event))
      },
      (event) => {
        hoverRef.current = false
        setHovering(false)
        setHovered(null)
        if (trigger === "hover") control.current.encode?.(...point(event))
      }
    )
    return () => {
      stop()
      if (hoverRef.current) setHovered(null)
      hoverRef.current = false
    }
  }, [trigger])

  // Bez silnika (ograniczony ruch, brak WebGL2) wideo i tak może grać: kafel staje do
  // „wyborów”, gdy połowa jest w kadrze.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !src || !(reduced || failed) || armed) return
    const view = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.intersectionRatio >= 0.5) setArmed(true)
      },
      { threshold: [0, 0.5] }
    )
    view.observe(wrap)
    return () => view.disconnect()
  }, [src, reduced, failed, armed])

  // Kafel z wideo staje do „wyborów” — gra tylko jeden (najechany albo najbliżej środka).
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !src || !armed) return
    addPlayer(wrap, setElected)
    return () => removePlayer(wrap)
  }, [src, armed])

  const loadVideo = !!src && armed
  const active = elected || hovering
  const plainMode = reduced || failed
  const playing = loadVideo && active && !stopped && (shown || hovering || plainMode)

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

  // Bez silnika (ograniczony ruch, brak WebGL2) — zwykły obraz od razu.
  const plain = reduced || failed
  return (
    <div
      ref={wrapRef}
      data-ready={ready || plain || undefined}
      data-shown={shown || plain || undefined}
      className={cn("group/gxm relative isolate overflow-hidden", className)}
      style={{ aspectRatio: `${width} / ${height}`, ...(plain ? null : DOTS[skeleton]) }}
    >
      <Image
        ref={imageRef}
        src={poster}
        width={width}
        height={height}
        sizes={sizes}
        alt={alt}
        loading={loading}
        preload={preload}
        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-data-[ready]/gxm:opacity-100 [@media(scripting:none)]:opacity-100"
      />
      {src && (
        <video
          ref={videoRef}
          src={loadVideo ? src : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={(event) => (event.currentTarget.dataset.playing = "")}
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-200 data-[playing]:opacity-100"
        />
      )}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-[2] size-full opacity-0 transition-opacity duration-300 group-data-[ready]/gxm:opacity-100"
      />
      {controls && loadVideo && (
        <button
          type="button"
          onClick={() => setStopped(!stopped)}
          aria-label={stopped ? controls.play : controls.pause}
          title={stopped ? controls.play : controls.pause}
          className="absolute end-3 bottom-3 z-[4] grid size-11 place-items-center rounded-full bg-fm-surface/90 text-fm-ink shadow-fm-ring fm-focus transition-[background-color,scale] hover:bg-fm-surface active:scale-95"
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
