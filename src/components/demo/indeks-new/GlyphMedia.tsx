"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { GlyphDecoder, type Origin } from "./glyph/decoder"
import { WAVES, canvasDpr, decodeStyle, ensureGlyphFonts } from "./glyph/style"
import { usePageVisible, useVisible } from "./hooks"
import type { Frame } from "./types"

type Intent = "auto" | "play" | "pause"
type State = "pending" | "running" | "done"

/** Obraz gotowy do narysowania w canvasie (z pamięci podręcznej albo po wczytaniu). */
export async function imageReady(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0) return
  try {
    await image.decode()
  } catch {
    await new Promise((resolve) => image.addEventListener("load", resolve, { once: true }))
  }
}

/**
 * Kadr z plakatem (i wideo), który pojawia się, odkodowując się z glifów:
 * `load` — zaraz po wejściu na stronę (wideo w kolumnie startowej),
 * `view` — gdy połowa wejdzie w kadr (okładka na telefonie, panel realizacji),
 * `none` — od razu obraz (panel, do którego właśnie wskoczyła karta z marginesu).
 *
 * Bez JS albo przy „ogranicz ruch” — zwykły obraz. Wideo: plakat od razu,
 * `src` dopiero, gdy ma grać (`preload="none"`), gra tylko w kadrze, a pętla
 * ma widoczną pauzę (WCAG 2.2.2). `play()` w efekcie po zatwierdzeniu `src`.
 */
export function GlyphMedia({
  frame,
  sources,
  decode = "view",
  origin = "top",
  wave = "panel",
  delay = 0,
  from = "latent",
  active = true,
  startAt,
  labels,
  title,
  className,
  style,
  priority = false,
}: {
  frame: Frame
  sources?: readonly { src: string; type: string }[]
  decode?: "load" | "view" | "none"
  origin?: Origin
  wave?: keyof typeof WAVES
  /**
   * Opóźnienie fali (ms). Dla `decode="load"` liczone od początku wizyty —
   * fala rusza zaraz po wejściu tekstu, bez względu na czas hydratacji.
   */
  delay?: number
  /** Stan przed falą: utajony wydruk (rozmyty obraz + blady raster) albo pusty papier. */
  from?: "paper" | "latent"
  /** Czy wideo może grać (np. panel rozwinięty). */
  active?: boolean
  /** Sekunda, od której wideo ma grać (ciągłość po morfie z karty). */
  startAt?: number
  labels: { play: string; pause: string }
  title: string
  className?: string
  style?: CSSProperties
  priority?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const visible = useVisible(wrapRef, 0.3)
  const pageVisible = usePageVisible()
  const [decodeState, setState] = useState<State>(decode === "none" ? "done" : "pending")
  // Przy „ogranicz ruch” nie ma fali — obraz od razu.
  const state: State = reduced ? "done" : decodeState
  const [intent, setIntent] = useState<Intent>("auto")
  const [armed, setArmed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  /** Kadr zatrzymany pauzą i zakodowany w glify (canvas zostaje na ekranie). */
  const [frozen, setFrozen] = useState(false)
  const decoderRef = useRef<GlyphDecoder | null>(null)

  const decoder = () => {
    const canvas = canvasRef.current
    if (!canvas) return null
    decoderRef.current ??= new GlyphDecoder(canvas)
    return decoderRef.current
  }

  useEffect(() => () => decoderRef.current?.destroy(), [])

  const shouldPlay =
    !!sources?.length &&
    active &&
    visible &&
    pageVisible &&
    (intent === "play" || (intent === "auto" && !reduced))

  // Odkodowanie: raz, z papieru, falą od wskazanej krawędzi.
  useEffect(() => {
    if (decode === "none" || reduced) return undefined
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!wrap || !canvas || !image) return undefined
    let alive = true
    let observer: IntersectionObserver | null = null

    const start = async () => {
      await Promise.all([ensureGlyphFonts(), imageReady(image)])
      const coder = decoder()
      if (!alive || !coder) return
      const rect = wrap.getBoundingClientRect()
      coder.resize(rect.width, rect.height, canvasDpr())
      const wait = decode === "load" ? Math.max(0, delay - performance.now()) : delay
      const run = coder.play(image, decodeStyle(rect.width), {
        ...WAVES[wave],
        origin,
        delay: wait,
        from,
      })
      setState("running")
      await run
      if (alive) setState("done")
    }

    if (decode === "load") {
      void start()
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return
          observer?.disconnect()
          void start()
        },
        { threshold: 0.5 }
      )
      observer.observe(wrap)
    }
    return () => {
      alive = false
      observer?.disconnect()
      decoderRef.current?.release()
    }
    // Odkodowanie jest jednorazowe — parametry fali czytamy tylko przy montażu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  if (shouldPlay && !armed) setArmed(true)

  /**
   * Pauza zamienia zatrzymany kadr z powrotem w kod (fala od przycisku),
   * odtwarzanie odkodowuje go znowu — wymagana przez WCAG pauza jest częścią
   * efektu, nie tylko przyciskiem. Bez ruchu przy „ogranicz ruch”.
   */
  function toggle() {
    const video = videoRef.current
    const wrap = wrapRef.current
    const coder = decoder()
    const canCode = !reduced && state === "done" && !!video && !!wrap && !!coder
    const rect = wrap?.getBoundingClientRect()
    const origin = rect ? { x: rect.width - 32, y: rect.height - 32 } : "top"
    if (playing) {
      setIntent("pause")
      if (!canCode || !video || !rect || !coder || video.readyState < 2) return
      video.pause()
      coder.resize(rect.width, rect.height, canvasDpr())
      void coder.play(video, decodeStyle(rect.width), {
        duration: 560,
        front: 200,
        jitter: 90,
        origin,
        from: "clear",
        mode: "encode",
      })
      setFrozen(true)
      return
    }
    setIntent("play")
    if (frozen && coder && video && rect) {
      // Od tego, co widać (zakodowany kadr), do grającego wideo.
      void coder.play(video, decodeStyle(rect.width), { ...WAVES.panel, origin, from: () => {} })
    }
    setFrozen(false)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video || !armed) return
    if (shouldPlay) {
      if (startAt !== undefined && video.currentTime === 0) video.currentTime = startAt
      video.play().catch(() => {
        /* autoodtwarzanie zablokowane — zostaje plakat i przycisk */
      })
    } else {
      video.pause()
    }
  }, [shouldPlay, armed, startAt])

  return (
    <div
      ref={wrapRef}
      data-media=""
      data-state={state}
      data-frozen={frozen || undefined}
      style={{ aspectRatio: `${frame.width} / ${frame.height}`, ...style }}
      className={cn("ixn-media ixn-media-ring relative overflow-hidden bg-fm-fill", className)}
    >
      {/* Plakaty to już małe WebP — zwykły <img>, żeby canvas rysował dokładnie ten plik. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={frame.src}
        width={frame.width}
        height={frame.height}
        alt=""
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
        className="ixn-media__layer absolute inset-0 size-full object-cover"
      />
      {sources && sources.length > 0 && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          data-ready={ready || undefined}
          onPlaying={() => {
            setReady(true)
            setPlaying(true)
          }}
          onPause={() => setPlaying(false)}
          className="ixn-media__layer ixn-video absolute inset-0 size-full object-cover"
        >
          {armed &&
            sources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
        </video>
      )}
      <canvas ref={canvasRef} aria-hidden="true" className="ixn-media__canvas" />
      {sources && sources.length > 0 && (
        <button
          type="button"
          onClick={toggle}
          aria-label={`${playing ? labels.pause : labels.play}: ${title}`}
          title={playing ? labels.pause : labels.play}
          className="ixn-media__control absolute end-3 bottom-3 z-[3] grid size-10 fm-press place-items-center rounded-full bg-fm-surface/85 text-fm-ink shadow-fm-ring fm-focus backdrop-blur-md transition-[background-color,scale] after:absolute after:-inset-1.5 after:content-[''] hover:bg-fm-surface"
        >
          {playing ? (
            <Pause aria-hidden="true" className="size-3.5" fill="currentColor" strokeWidth={0} />
          ) : (
            <Play
              aria-hidden="true"
              className="size-3.5 translate-x-px"
              fill="currentColor"
              strokeWidth={0}
            />
          )}
        </button>
      )}
    </div>
  )
}
