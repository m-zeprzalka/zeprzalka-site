"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Pause, Play } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { loadGlyphFont, readInk } from "./atlas"
import { ImageCoder } from "./coder"
import { glyphFont } from "./fonts"
import { useGlyphMotion } from "./motion"
import { addPlayer, removePlayer, setHovered } from "./players"
import { enqueue } from "./queue"

/** Kolory wydruku z CSS (`--gl-print-*`, szesnastkowo) i polaryzacja motywu. */
function printTheme(element: Element, dark: boolean) {
  return {
    ink: readInk(element, "--gl-print-ink"),
    paper: readInk(element, "--gl-print-paper"),
    dark,
  }
}

/**
 * Obraz (i opcjonalnie wideo) zakodowany w glifach. Tryby:
 * - `view` — odkodowuje się raz, gdy co najmniej połowa jest w kadrze, albo przy
 *   fokusie na elemencie z `data-gl-host` (kafel, wiersz wpisu), i zostaje
 *   w kolorze; najechanie na odkodowany kafel daje krótki przebieg glifów.
 * - `reveal` — dekoduje się sam chwilę po pojawieniu się (podgląd w oknie).
 * Bez JS widać zwykły, kolorowy obraz. Wideo dostaje źródło dopiero przy
 * pierwszym odkodowaniu i pauzuje po zakodowaniu.
 */
export function CodedMedia({
  src,
  width,
  height,
  sizes,
  video,
  mode = "view",
  controls,
  className,
  rounded = "rounded-fm-2xl",
}: {
  src: string
  width: number
  height: number
  sizes: string
  video?: string
  mode?: "view" | "reveal"
  /** Przycisk pauzy wideo (podgląd w oknie — tam wideo gra samo, WCAG 2.2.2). */
  controls?: { pause: string; play: string }
  className?: string
  rounded?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const coderRef = useRef<ImageCoder | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false)
  const [decoded, setDecoded] = useState(false)
  const [armed, setArmed] = useState(false)
  /** Pauza wybrana przez użytkownika; `null` = domyślnie (przy „ogranicz ruch” wideo stoi). */
  const [stoppedChoice, setStopped] = useState<boolean | null>(null)
  const [elected, setElected] = useState(false)
  const { reduced } = useGlyphMotion()
  const { resolvedTheme } = useTheme()
  const stopped = stoppedChoice ?? reduced
  // Podgląd w oknie przy „ogranicz ruch”: bez kodera, ale z wideo do włączenia przyciskiem.
  const shown = decoded || (reduced && mode === "reveal")
  const loadVideo = armed || (reduced && mode === "reveal")

  // Własny nasłuch zamiast `onLoad` z next/image: obraz z pamięci podręcznej bywa gotowy
  // jeszcze przed hydratacją (wtedy zdarzenie już było) — sprawdzamy `complete` po klatce.
  useEffect(() => {
    const image = imageRef.current
    if (!image) return
    const ready = () => setLoaded(true)
    if (image.complete && image.naturalWidth > 0) {
      const frame = requestAnimationFrame(ready)
      return () => cancelAnimationFrame(frame)
    }
    image.addEventListener("load", ready, { once: true })
    return () => image.removeEventListener("load", ready)
  }, [])

  // Koder rusza, gdy kafel zbliża się do kadru i obraz jest wczytany; wydruki liczą się
  // po jednym na klatkę (`enqueue`). Przy „ogranicz ruch” kodera nie ma — obraz od razu w kolorze.
  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!wrap || !canvas || !image || !loaded || reduced) return
    let coder: ImageCoder | null = null
    let cancel = () => {}
    let alive = true
    const family = glyphFont.style.fontFamily

    const measure = () => {
      const { width: w, height: h } = wrap.getBoundingClientRect()
      // Na telefonie gęstość ekranu ograniczona do 1,5 — glify 6 px nie zyskują na trzykrotnym DPR.
      const cap = window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2
      coder?.resize(w, h, Math.min(cap, window.devicePixelRatio || 1))
    }
    const resizeObserver = new ResizeObserver(measure)
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || coder) return
        nearObserver.disconnect()
        void loadGlyphFont(family).then(() => {
          if (!alive) return
          cancel = enqueue(() => {
            if (!alive) return
            coder = new ImageCoder(canvas, family, () => {
              setDecoded(true)
              setArmed(true)
            })
            coderRef.current = coder
            coder.setTheme(printTheme(wrap, document.documentElement.classList.contains("dark")))
            measure()
            coder.setImage(image)
            resizeObserver.observe(wrap)
            setReady(true)
          })
        })
      },
      { rootMargin: "900px 0px" }
    )
    nearObserver.observe(wrap)
    return () => {
      alive = false
      cancel()
      nearObserver.disconnect()
      resizeObserver.disconnect()
      coder?.destroy()
      coderRef.current = null
      setReady(false)
    }
  }, [loaded, reduced])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !ready) return
    coderRef.current?.setTheme(printTheme(wrap, resolvedTheme === "dark"))
  }, [resolvedTheme, ready])

  // Wyzwalacze: kafel odkodowuje się raz — gdy co najmniej połowa jest w kadrze (chwilę
  // po wejściu) albo przy fokusie — i zostaje w kolorze. Najechanie na odkodowany kafel
  // puszcza krótki przebieg glifów. W oknie podglądu obraz odkodowuje się sam.
  useEffect(() => {
    const wrap = wrapRef.current
    const coder = coderRef.current
    if (!wrap || !coder || !ready) return
    const host = wrap.closest<HTMLElement>("[data-gl-host]") ?? wrap
    const center = () => {
      const rect = wrap.getBoundingClientRect()
      return [rect.width / 2, rect.height / 2] as const
    }

    if (mode === "reveal") {
      const timer = setTimeout(() => coder.decode(...center()), 180)
      return () => clearTimeout(timer)
    }

    let timer: ReturnType<typeof setTimeout> | undefined
    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer)
        if (!entry || entry.intersectionRatio < 0.5 || coder.decoded) return
        timer = setTimeout(() => {
          const rect = wrap.getBoundingClientRect()
          // Kafel wjeżdża od dołu — fala od jego górnej krawędzi; od góry — od dolnej.
          coder.decode(rect.width / 2, rect.top >= 0 ? 0 : rect.height)
        }, 140)
      },
      { threshold: [0, 0.5] }
    )
    viewObserver.observe(wrap)

    let lastShimmer = 0
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      setHovered(wrap)
      const now = performance.now()
      if (now - lastShimmer < 900) return
      lastShimmer = now
      const rect = wrap.getBoundingClientRect()
      coder.shimmer(event.clientX - rect.left, event.clientY - rect.top)
    }
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setHovered(null)
    }
    const onFocus = () => coder.decode(...center())
    host.addEventListener("pointerenter", onEnter)
    host.addEventListener("pointerleave", onLeave)
    host.addEventListener("focusin", onFocus)
    return () => {
      clearTimeout(timer)
      viewObserver.disconnect()
      host.removeEventListener("pointerenter", onEnter)
      host.removeEventListener("pointerleave", onLeave)
      host.removeEventListener("focusin", onFocus)
      setHovered(null)
    }
  }, [ready, mode])

  // Kafel z odkodowanym wideo staje do „wyborów” — gra tylko najbliższy środka ekranu.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !video || !decoded || mode === "reveal") return
    addPlayer(wrap, setElected)
    return () => removePlayer(wrap)
  }, [video, decoded, mode])

  // Wideo gra tylko odkodowane; `play()` po zatwierdzeniu źródła (wzór: LazyVideo serwisu).
  useEffect(() => {
    const element = videoRef.current
    if (!element || !loadVideo) return
    const active = mode === "reveal" || elected
    if (shown && active && !stopped) void element.play().catch(() => {})
    else element.pause()
  }, [shown, loadVideo, stopped, elected, mode])

  return (
    <div
      ref={wrapRef}
      data-ready={ready || undefined}
      data-decoded={shown || undefined}
      className={cn("gl-coded", rounded, className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image
        ref={imageRef}
        src={src}
        width={width}
        height={height}
        sizes={sizes}
        alt=""
        className="gl-coded__image"
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
          className="gl-coded__video"
        />
      )}
      <canvas ref={canvasRef} aria-hidden="true" className="gl-coded__canvas" />
      {controls && video && loadVideo && (
        <button
          type="button"
          onClick={() => setStopped(!stopped)}
          aria-label={stopped ? controls.play : controls.pause}
          title={stopped ? controls.play : controls.pause}
          className="absolute end-3 bottom-3 z-[4] grid size-10 fm-press place-items-center rounded-full bg-fm-surface/85 text-fm-ink shadow-fm-ring fm-focus backdrop-blur-md transition-[background-color,scale] hover:bg-fm-surface"
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
