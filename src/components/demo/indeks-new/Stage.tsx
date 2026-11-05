"use client"

import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { cn } from "@/components/demo/forma/cn"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { Follower } from "./follow"
import { drawCover, GlyphDecoder } from "./glyph/decoder"
import { WAVES, canvasDpr, decodeStyle, ensureGlyphFonts } from "./glyph/style"
import { imageReady } from "./GlyphMedia"
import { useStage } from "./hooks"
import { getPeek, usePeekState, type PeekState } from "./peek-store"
import type { Frame, Peek } from "./types"

export interface StageWork {
  title: string
  poster: Frame
  video?: string
}

/** Kafel obrazu w karcie (px CSS, względem karty). */
interface Tile {
  src: string
  x: number
  y: number
  w: number
  h: number
}

type Resolved =
  | {
      type: "media"
      tiles: Tile[]
      video?: string
      w: number
      h: number
      caption?: { label: string; meta?: string }
    }
  | { type: "info"; peek: Extract<Peek, { kind: "info" }>; w: number }

/** Odstęp karty od kolumny (≥ 48 px), margines od krawędzi okna, górna granica pod nagłówkiem. */
const GAP = 48
const EDGE = 20
const TOP = 80
/** Karta rośnie z marginesem: 1280 px ≈ 250, 1440 ≈ 300, 1920 ≈ 480, 2560 — 560 px szerokości. */
const MAX_CARD = 560
const GUTTER = 4
/** Pole karty pojedynczego obrazu (≈ 320 × 200): kadr zmienia proporcje, nie „wagę”. */
const AREA = 64_000
/** Wideo startuje dopiero, gdy kursor zatrzyma się na wierszu. */
const DWELL = 160
/** Pozioma „smycz”: w marginesie karta przesuwa się o ułamek ruchu kursora. */
const DRIFT = 0.035
/** Najwyżej tyle zawartości kart trzymamy w DOM (ostatnio pokazane). */
const KEEP = 8

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** Wysokość karty mieści się w oknie (pod nagłówkiem, z oddechem u dołu). */
function maxHeight(): number {
  return typeof window === "undefined" ? 600 : window.innerHeight - TOP - EDGE - 24
}

function single(frame: Frame, maxW: number): { tiles: Tile[]; w: number; h: number } {
  const ratio = frame.width / frame.height
  // Pole rośnie z szerokością karty — na szerokim marginesie obraz ma wagę, a nie tylko miejsce.
  const area = AREA * (maxW / 320) ** 2
  let w = Math.round(Math.sqrt(area * ratio))
  let h = Math.round(Math.sqrt(area / ratio))
  if (w > maxW) {
    w = Math.round(maxW)
    h = Math.round(w / ratio)
  }
  const limit = maxHeight()
  if (h > limit) {
    w = Math.round((w * limit) / h)
    h = Math.round(limit)
  }
  return { tiles: [{ src: frame.src, x: 0, y: 0, w, h }], w, h }
}

/** Mozaika: pierwszy obraz na całą szerokość, kolejne (do dwóch) w rzędzie pod nim. */
function mosaic(items: readonly Frame[], maxW: number): { tiles: Tile[]; w: number; h: number } {
  // Mozaika jest wyższa od pojedynczego kadru — przy niskim oknie węższa, żeby się zmieściła.
  const w = Math.round(Math.min(maxW, maxHeight() / 1.05))
  const [first, ...rest] = items
  if (!first) return { tiles: [], w, h: 0 }
  const h1 = Math.round(w * clamp(first.height / first.width, 0.5, 0.66))
  const tiles: Tile[] = [{ src: first.src, x: 0, y: 0, w, h: h1 }]
  const row = rest.slice(0, 2)
  if (row.length === 0) return { tiles, w, h: h1 }
  const tw = (w - GUTTER * (row.length - 1)) / row.length
  const th = Math.round(tw * (row.length === 1 ? 0.56 : 0.8))
  row.forEach((frame, index) =>
    tiles.push({
      src: frame.src,
      x: Math.round(index * (tw + GUTTER)),
      y: h1 + GUTTER,
      w: Math.round(tw),
      h: th,
    })
  )
  return { tiles, w, h: h1 + GUTTER + th }
}

function resolve(
  key: string,
  maxW: number,
  works: Readonly<Record<string, StageWork>>,
  covers: Readonly<Record<string, string>>,
  peeks: Readonly<Record<string, Peek>>
): Resolved | null {
  const [kind, id = ""] = key.split(":")
  const peek: Peek | undefined =
    kind === "work"
      ? { kind: "work", slug: id }
      : kind === "post"
        ? { kind: "post", slug: id }
        : peeks[id]
  if (!peek) return null
  if (peek.kind === "work") {
    const work = works[peek.slug]
    return work ? { type: "media", ...single(work.poster, maxW), video: work.video } : null
  }
  if (peek.kind === "post") {
    const cover = covers[peek.slug]
    if (!cover) return null
    const w = Math.round(maxW)
    const h = Math.round((w * 9) / 16)
    return { type: "media", tiles: [{ src: cover, x: 0, y: 0, w, h }], w, h }
  }
  if (peek.kind === "mosaic") {
    const caption = peek.link ? { label: peek.link.label, meta: peek.link.meta } : undefined
    return { type: "media", ...mosaic(peek.items, maxW), caption }
  }
  return { type: "info", peek, w: Math.round(Math.min(340, maxW)) }
}

/** Kolumna treści — karta parkuje przy jej prawej krawędzi. */
function measureColumn(): { left: number; right: number } {
  const column = document.querySelector<HTMLElement>("[data-ixn-column]")
  const rect = column?.getBoundingClientRect()
  return rect ? { left: rect.left, right: rect.right } : { left: 0, right: window.innerWidth / 2 }
}

/** Rysuje kafle warstwy (plakaty albo bieżącą klatkę wideo) w canvas o rozmiarze karty. */
function paintLayer(
  layer: HTMLElement | null,
  ctx: CanvasRenderingContext2D,
  scaleX: number,
  scaleY: number
) {
  if (!layer) return
  for (const tile of layer.querySelectorAll<HTMLElement>("[data-tile]")) {
    const x = Number(tile.dataset.x) * scaleX
    const y = Number(tile.dataset.y) * scaleY
    const w = Number(tile.dataset.w) * scaleX
    const h = Number(tile.dataset.h) * scaleY
    const video = tile.querySelector<HTMLVideoElement>("video[data-ready]")
    const image = tile.querySelector("img")
    const source = video && video.readyState >= 2 ? video : image
    if (!source) continue
    ctx.save()
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.clip()
    ctx.translate(x, y)
    drawCover(ctx, source, w, h)
    ctx.restore()
  }
}

/**
 * Scena: prawa strona jest pusta, dopóki czegoś nie wskażesz. Karta parkuje
 * przy kolumnie (od 1280 px; węziej — obok kursora), w pionie płynie za
 * kursorem na sprężynie, a każda nowa zawartość **odkodowuje się z glifów**
 * falą od strony kolumny: cyfry binarne → raster → obraz. Informacje (fakty,
 * oś czasu) zamiast fali wyostrzają się z rozmycia — tekst ma swój materiał.
 * Dekoracja dla myszy (`aria-hidden`); ta sama treść jest w kolumnie.
 */
export function Stage({
  works,
  covers,
  peeks,
}: {
  works: Readonly<Record<string, StageWork>>
  covers: Readonly<Record<string, string>>
  peeks: Readonly<Record<string, Peek>>
}) {
  const enabled = useStage()
  if (!enabled) return null
  return <StageCard works={works} covers={covers} peeks={peeks} />
}

function StageCard({
  works,
  covers,
  peeks,
}: {
  works: Readonly<Record<string, StageWork>>
  covers: Readonly<Record<string, string>>
  peeks: Readonly<Record<string, Peek>>
}) {
  const peek = usePeekState()
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const followerRef = useRef<Follower | null>(null)
  const decoderRef = useRef<GlyphDecoder | null>(null)
  const pointer = useRef({ x: 0, y: 0 })
  /** Miejsce na marginesie: `docked` — karta stoi obok kolumny, `roomy` — zmieści też tekst. */
  const [space, setSpace] = useState({ maxW: 320, docked: true, roomy: true, gap: GAP })
  /** Pokazywana zawartość i to, z czego karta do niej przechodzi (`from` — null: z papieru). */
  const [shown, setShown] = useState<{
    key: string
    content: Resolved
    from: { key: string; w: number; h: number } | null
  } | null>(null)
  const [visible, setVisible] = useState(false)
  const [layers, setLayers] = useState<string[]>([])
  const token = useRef(0)
  // Jeden bufor na złożone kafle — fala nie alokuje nowego canvasu przy każdym wskazaniu.
  const [composite] = useState(() =>
    typeof document === "undefined" ? null : document.createElement("canvas")
  )

  // Miejsce na marginesie (przelicza się przy zmianie rozmiaru okna).
  useEffect(() => {
    const measure = () => {
      const column = measureColumn()
      const margin = window.innerWidth - column.right
      // Szeroki margines: odstęp od kolumny rośnie z nim (48 → 72 px), karta — do 560 px.
      // Węższy (1024–1279 px): mniejszy odstęp, karta jako miniatura obok kolumny.
      const wide = margin >= 300
      const gap = wide ? Math.round(Math.min(72, Math.max(GAP, margin * 0.11))) : 18
      const edge = wide ? Math.round(Math.min(48, Math.max(EDGE, margin * 0.06))) : 14
      const room = margin - gap - edge
      setSpace(
        room >= 150
          ? { maxW: Math.min(MAX_CARD, room), docked: true, roomy: room >= 240, gap }
          : { maxW: 300, docked: false, roomy: false, gap }
      )
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined
    followerRef.current = new Follower(wrap)
    decoderRef.current = new GlyphDecoder(canvas)
    void ensureGlyphFonts()
    return () => {
      followerRef.current?.stop()
      decoderRef.current?.destroy()
    }
  }, [])

  // Plakaty realizacji wczytujemy w tle, gdy przeglądarka odpocznie — pierwsze wskazanie nie czeka.
  useEffect(() => {
    const timer = setTimeout(() => {
      for (const work of Object.values(works)) {
        const image = new Image()
        image.decoding = "async"
        image.src = work.poster.src
      }
    }, 1800)
    return () => clearTimeout(timer)
  }, [works])

  const targetKey = (state: PeekState): string | null => {
    if (!state.key || state.key === state.muted) return null
    if (state.via === "focus" && !space.docked) return null
    return state.key
  }
  const key = targetKey(peek)
  const resolved = key ? resolve(key, space.maxW, works, covers, peeks) : null
  // Bez miejsca na tekst karta pokazuje tylko obrazy (informacje są w popoverach pod słowem).
  const content = resolved?.type === "info" && !space.roomy ? null : resolved
  const contentKey = key && content ? key : null

  // Nowa zawartość albo zgaszenie. Ostatnia zawartość zostaje w karcie, gdy ta gaśnie.
  const [last, setLast] = useState<string | null>(null)
  if (contentKey !== last) {
    setLast(contentKey)
    if (contentKey && content) {
      const from =
        visible && shown && shown.content.type === "media"
          ? { key: shown.key, w: shown.content.w, h: shown.content.h }
          : null
      setShown({ key: contentKey, content, from })
      setVisible(true)
      setLayers((prev) =>
        [contentKey, ...prev.filter((entry) => entry !== contentKey)].slice(0, KEEP)
      )
    } else {
      setVisible(false)
    }
  }

  // Pozycja: pionowo za kursorem (albo przy elemencie z fokusem), poziomo przy kolumnie.
  const size = shown ? { w: cardW(shown.content), h: cardH(shown.content) } : { w: 0, h: 0 }
  const place = useEffectEvent((jump: boolean) => {
    const follower = followerRef.current
    if (!follower || !visible) return
    const column = measureColumn()
    const { x: px, y: py } = pointer.current
    const rect = peek.via === "focus" ? peek.anchor?.getBoundingClientRect() : undefined
    const anchor = rect ? rect.top + rect.height / 2 : py
    const h = size.h || cardRef.current?.offsetHeight || 200
    const ty = clamp(anchor, TOP + h / 2, window.innerHeight - EDGE - h / 2) - h / 2
    let tx: number
    if (space.docked) {
      tx = column.right + space.gap + (px - (column.left + column.right) / 2) * DRIFT
    } else {
      const flip = px + GAP + size.w + EDGE > window.innerWidth
      tx = flip ? px - GAP - size.w : px + GAP
    }
    follower.to(tx, ty, jump || reduced)
  })

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      pointer.current = { x: event.clientX, y: event.clientY }
      place(false)
    }
    // Karta przy elemencie z fokusem jedzie razem z nim, gdy strona się przewija.
    const onScroll = () => {
      if (getPeek().via === "focus") place(false)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Karta pojawia się tam, gdzie jest kursor — nie przylatuje z poprzedniego miejsca.
  const wasVisible = useRef(false)
  useLayoutEffect(() => {
    place(visible && !wasVisible.current)
    wasVisible.current = visible
  })

  // Odkodowanie nowej zawartości — po zatwierdzeniu warstw w DOM.
  useLayoutEffect(() => {
    const card = cardRef.current
    const decoder = decoderRef.current
    if (!card || !decoder || !shown) return
    const run = ++token.current
    if (!composite) return
    const layerOf = (layerKey: string) =>
      card.querySelector<HTMLElement>(`[data-layer="${CSS.escape(layerKey)}"]`)

    if (shown.content.type === "info" || reduced) {
      delete card.dataset.pending
      decoder.release()
      return
    }
    // Zanim wydruk będzie gotowy, nowa zawartość stoi jako utajony obraz (CSS), nie ostry.
    card.dataset.pending = ""
    const target = layerOf(shown.key)
    const w = shown.content.w
    const h = shown.content.h
    const images = [...(target?.querySelectorAll("img") ?? [])]
    void Promise.all([ensureGlyphFonts(), ...images.map(imageReady)]).then(() => {
      if (run !== token.current) return
      const dpr = canvasDpr()
      decoder.resize(w, h, dpr)
      // Źródło fali: kafle nowej zawartości złożone w jeden obraz o rozmiarze karty.
      const source = composite
      source.width = Math.round(w * dpr)
      source.height = Math.round(h * dpr)
      const sctx = source.getContext("2d")
      if (!sctx) return
      sctx.clearRect(0, 0, source.width, source.height)
      paintLayer(target, sctx, dpr, dpr)
      const from = shown.from
      const previous = from ? layerOf(from.key) : null
      void decoder.play(source, decodeStyle(w), {
        ...(from ? WAVES.swap : WAVES.card),
        origin: "left",
        // Pierwsze pojawienie — z utajonego wydruku; zmiana — od tego, co widać (także w trakcie fali).
        from:
          from && previous
            ? (ctx, dw, dh) => {
                ctx.fillStyle = getComputedStyle(ctx.canvas).getPropertyValue("--ixn-paper")
                ctx.fillRect(0, 0, dw, dh)
                paintLayer(previous, ctx, dw / from.w, dh / from.h)
              }
            : "latent",
      })
      delete card.dataset.pending
    })
  }, [shown, reduced, composite])

  const content_ = shown?.content
  const style = {
    width: size.w || undefined,
    height: content_?.type === "media" ? size.h : undefined,
  } as CSSProperties

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 will-change-transform"
    >
      <div
        ref={cardRef}
        data-ixn-card=""
        data-visible={visible || undefined}
        data-kind={content_?.type}
        style={style}
        className="ixn-card relative overflow-hidden"
      >
        {layers.map((layerKey) => {
          const layerContent =
            layerKey === shown?.key
              ? shown.content
              : resolve(layerKey, space.maxW, works, covers, peeks)
          if (!layerContent) return null
          return (
            <Layer
              key={layerKey}
              layerKey={layerKey}
              content={layerContent}
              active={layerKey === shown?.key}
              playing={visible && layerKey === shown?.key}
              video={!reduced}
            />
          )
        })}
        <canvas ref={canvasRef} className="ixn-card__canvas" />
      </div>
    </div>
  )
}

function cardW(content: Resolved): number {
  return content.w
}
function cardH(content: Resolved): number {
  return content.type === "media" ? content.h : 0
}

function Layer({
  layerKey,
  content,
  active,
  playing,
  video,
}: {
  layerKey: string
  content: Resolved
  active: boolean
  playing: boolean
  video: boolean
}) {
  if (content.type === "info") {
    const { peek } = content
    return (
      <div data-layer={layerKey} data-active={active || undefined} className="ixn-card__info p-4">
        <p className="flex items-baseline justify-between gap-3 text-fm-small">
          <span className="font-medium text-fm-ink">{peek.heading}</span>
          {peek.meta && <span className="shrink-0 text-fm-ink-3 tabular-nums">{peek.meta}</span>}
        </p>
        {peek.body && <p className="mt-1.5 text-fm-small text-pretty text-fm-ink-2">{peek.body}</p>}
        {peek.entries && (
          <ol className="mt-3 space-y-2.5 text-fm-small">
            {peek.entries.map((entry) => (
              <li key={entry.role} className="grid grid-cols-[5.25rem_1fr] gap-3">
                <span className="text-fm-ink-3 tabular-nums">{entry.period}</span>
                <span>
                  <span className="block leading-snug text-fm-ink">{entry.role}</span>
                  <span className="block text-fm-ink-3">{entry.company}</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    )
  }
  return (
    <div
      data-layer={layerKey}
      data-active={active || undefined}
      className="ixn-card__media absolute inset-0"
    >
      {content.tiles.map((tile, index) => (
        <div
          key={`${tile.src}-${index}`}
          data-tile=""
          data-x={tile.x}
          data-y={tile.y}
          data-w={tile.w}
          data-h={tile.h}
          className={cn("absolute overflow-hidden", content.tiles.length > 1 && "rounded-fm-sm")}
          style={{ left: tile.x, top: tile.y, width: tile.w, height: tile.h }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tile.src}
            alt=""
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
          {index === 0 && content.video && video && (
            <CardVideo src={content.video} playing={playing} />
          )}
        </div>
      ))}
      {content.caption && (
        <span className="absolute bottom-2.5 left-2.5 inline-flex items-baseline gap-1.5 rounded-full bg-fm-surface/90 px-2.5 py-1 text-fm-micro font-medium text-fm-ink-2 shadow-fm-ring backdrop-blur-md">
          {content.caption.label}
          {content.caption.meta && (
            <span className="text-fm-ink-3 tabular-nums">{content.caption.meta}</span>
          )}
        </span>
      )}
    </div>
  )
}

/** Wideo karty: montowane po chwili zatrzymania kursora, pauza po zgaszeniu. */
function CardVideo({ src, playing }: { src: string; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!playing || mounted) return undefined
    const timer = setTimeout(() => setMounted(true), DWELL)
    return () => clearTimeout(timer)
  }, [playing, mounted])

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    if (playing) {
      element.play().catch(() => {
        /* autoodtwarzanie zablokowane — zostaje plakat */
      })
      return undefined
    }
    const timer = setTimeout(() => element.pause(), 300)
    return () => clearTimeout(timer)
  }, [playing, mounted])

  if (!mounted) return null
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      data-ready={ready || undefined}
      onPlaying={() => setReady(true)}
      className="ixn-video absolute inset-0 size-full object-cover"
    />
  )
}

/** Bieżąca sekunda wideo karty — panel w kolumnie gra dalej od tego miejsca. */
export function cardVideoTime(): number | undefined {
  const video = document.querySelector<HTMLVideoElement>(
    "[data-ixn-card] [data-active] video[data-ready]"
  )
  return video ? video.currentTime : undefined
}

/** Element karty (do nazwy przejścia widoku przy morfie) — jeśli jest widoczna. */
export function visibleCard(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-ixn-card][data-visible]")
}
