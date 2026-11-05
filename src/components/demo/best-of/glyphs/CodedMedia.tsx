"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { cn } from "../../forma/cn"
import { useReducedMotion } from "../../forma/use-in-view"
import { PRINT_GLYPHS } from "./alphabet"
import { loadFont, readInk } from "./atlas"
import { ImageCoder } from "./coder"
import { glyphFont } from "./fonts"
import { addPlayer, removePlayer, setHovered } from "./players"
import { enqueue } from "./queue"

const FINE = "(hover: hover) and (pointer: fine)"

function subscribeFine(onChange: () => void) {
  const media = window.matchMedia(FINE)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/** Kolory wydruku z CSS (`--bo-print-*`, szesnastkowo) i polaryzacja motywu. */
function printTheme(element: Element, dark: boolean) {
  return {
    ink: readInk(element, "--bo-print-ink", "#525252"),
    paper: readInk(element, "--bo-print-paper", "#f4f4f4"),
    dark,
  }
}

/**
 * Kadr zakodowany w glifach (wzór: `glif/CodedMedia.tsx` — „jakiś kosmos”).
 * Zanim kafel zostanie zobaczony, leży na nim jego wydruk z kropek; gdy co
 * najmniej 35% wejdzie w kadr, wydruk rozpuszcza się falą od krawędzi, z której
 * kafel wjechał, i obraz zostaje w kolorze na stałe (szybciej i wcześniej niż
 * w „Glifie” — klient ma widzieć realizacje, a nie szum). Najechanie myszą na
 * odkodowany kafel puszcza krótki przebieg glifów, a wideo gra tylko w jednym
 * kaflu naraz: pod kursorem albo najbliżej środka ekranu. Na dotyku wideo nie
 * ładuje się wcale (limit danych) — gra w podglądzie. Bez JS i przy „ogranicz
 * ruch” — zwykły, kolorowy obraz.
 */
export function CodedMedia({
  src,
  width,
  height,
  sizes,
  video,
  className,
}: {
  src: string
  width: number
  height: number
  sizes: string
  video?: string
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const coderRef = useRef<ImageCoder | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false)
  const [decoded, setDecoded] = useState(false)
  const [elected, setElected] = useState(false)
  const [armed, setArmed] = useState(false)
  const fine = useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE).matches,
    () => false
  )
  const reduced = useReducedMotion()
  const { resolvedTheme } = useTheme()

  // Obraz z pamięci podręcznej bywa gotowy jeszcze przed hydratacją — sprawdzamy `complete`.
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

  // Koder rusza, gdy kafel zbliża się do kadru i obraz jest wczytany; wydruki liczą się
  // po jednym na klatkę (`enqueue`). Przy „ogranicz ruch” kodera nie ma.
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
      const cap = window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2
      coder?.resize(w, h, Math.min(cap, window.devicePixelRatio || 1))
    }
    const resizeObserver = new ResizeObserver(measure)
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || coder) return
        nearObserver.disconnect()
        void loadFont(family, PRINT_GLYPHS).then(() => {
          if (!alive) return
          cancel = enqueue(() => {
            if (!alive) return
            // Kafel już w kadrze w chwili przygotowania (np. po skoku kotwicą) — od razu w kolorze.
            coder = new ImageCoder(canvas, family, () => setDecoded(true))
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

  // Odkodowanie raz, gdy ≥ 35% kafla jest w kadrze (albo przy fokusie); przebieg pod kursorem.
  useEffect(() => {
    const wrap = wrapRef.current
    const coder = coderRef.current
    if (!wrap || !coder || !ready) return
    const host = wrap.closest<HTMLElement>("[data-bo-host]") ?? wrap
    let timer: ReturnType<typeof setTimeout> | undefined
    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer)
        if (!entry || entry.intersectionRatio < 0.35 || coder.decoded) return
        timer = setTimeout(() => {
          const rect = wrap.getBoundingClientRect()
          // Kafel wjeżdża od dołu — fala od jego górnej krawędzi; od góry — od dolnej.
          coder.decode(rect.width / 2, rect.top >= 0 ? 0 : rect.height)
        }, 90)
      },
      { threshold: [0, 0.35] }
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
    const onFocus = () => {
      const rect = wrap.getBoundingClientRect()
      coder.decode(rect.width / 2, rect.height / 2)
    }
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
  }, [ready])

  // Mysz: odkodowany kafel z wideo staje do „wyborów” — gra tylko jeden naraz.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !video || !decoded || !fine) return
    addPlayer(wrap, setElected)
    return () => removePlayer(wrap)
  }, [video, decoded, fine])

  const playing = decoded && elected && fine && !reduced
  // Plik wideo dostaje źródło przy pierwszym „wyborze” i zostaje (powrót bez ponownego pobierania).
  if (playing && !armed) setArmed(true)

  // `play()` po zatwierdzeniu źródła (wzór: LazyVideo serwisu).
  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    if (playing) void element.play().catch(() => {})
    else element.pause()
  }, [playing, armed])

  return (
    <div
      ref={wrapRef}
      data-ready={ready || undefined}
      data-decoded={decoded || undefined}
      className={cn("bo-coded", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image
        ref={imageRef}
        src={src}
        width={width}
        height={height}
        sizes={sizes}
        alt=""
        draggable={false}
        className="bo-coded__image"
      />
      {video && (
        <video
          ref={videoRef}
          src={armed ? video : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={(event) => (event.currentTarget.dataset.playing = "")}
          onPause={(event) => delete event.currentTarget.dataset.playing}
          className="bo-coded__video"
        />
      )}
      <canvas ref={canvasRef} aria-hidden="true" className="bo-coded__canvas" />
    </div>
  )
}
