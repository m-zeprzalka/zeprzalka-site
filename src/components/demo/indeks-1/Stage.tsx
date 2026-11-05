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
import { WAVES, canvasDpr, decodeStyle, ensureGlyphFonts, imageReady } from "./glyph/style"
import { getPeek, usePeekState, type PeekState } from "./peek-store"
import type { Frame, Peek, StageWork } from "./types"

/** Kafel obrazu w karcie (px CSS, względem karty); `video` — klip, który gra w tym kaflu. */
interface Tile {
  src: string
  video?: string
  x: number
  y: number
  w: number
  h: number
}

type Resolved =
  | { type: "media"; tiles: Tile[]; w: number; h: number; caption?: string }
  | { type: "info"; peek: Extract<Peek, { kind: "info" }>; w: number }

/** Górna granica karty (pod nagłówkiem 64 px + 16) i dolny oddech. */
const TOP = 80
const BOTTOM = 24
/** Karta nie rośnie ponad 560 px, nawet gdy tor jest szerszy (2560 px). */
const MAX_CARD = 560
/** Informacja tekstowa: miara wiersza do ~48 znaków. */
const MAX_INFO = 400
const GUTTER = 6
/** Wideo startuje dopiero, gdy kursor zatrzyma się na wierszu. */
const DWELL = 140
/** Najwyżej tyle zawartości kart trzymamy w DOM (ostatnio pokazane). */
const KEEP = 8

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** Wysokość karty mieści się w oknie (pod nagłówkiem, z oddechem u dołu). */
function maxHeight(): number {
  return typeof window === "undefined" ? 600 : window.innerHeight - TOP - BOTTOM
}

/**
 * Jeden kadr: szerokość zawsze = tor siatki (karta stoi na jego krawędziach),
 * proporcja kadru między 16:9 a 4:5, wysokość mieści się w oknie (`cover`).
 */
function single(frame: Frame, w: number): { tiles: Tile[]; w: number; h: number } {
  const h = Math.round(Math.min(w * clamp(frame.height / frame.width, 0.5625, 1.25), maxHeight()))
  return { tiles: [{ src: frame.src, video: frame.video, x: 0, y: 0, w, h }], w, h }
}

/** Mozaika: pierwszy kadr (z klipem) na całą szerokość, dwa kolejne w rzędzie pod nim. */
function mosaic(items: readonly Frame[], w: number): { tiles: Tile[]; w: number; h: number } {
  const [first, ...rest] = items
  if (!first) return { tiles: [], w, h: 0 }
  const row = rest.slice(0, 2)
  // Dwa kafle w rzędzie mają kadr 16:10; jeden — pas na całą szerokość (nie wąska szczelina).
  const th =
    row.length === 2
      ? Math.round(((w - GUTTER) / 2) * 0.625)
      : row.length
        ? Math.round(w * 0.36)
        : 0
  const h1 = Math.round(
    Math.min(w * clamp(first.height / first.width, 0.5625, 0.66), maxHeight() - th - GUTTER)
  )
  const tiles: Tile[] = [{ src: first.src, video: first.video, x: 0, y: 0, w, h: h1 }]
  if (row.length === 0) return { tiles, w, h: h1 }
  const tw = (w - GUTTER * (row.length - 1)) / row.length
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
    return work ? { type: "media", ...single({ ...work.poster, video: work.video }, maxW) } : null
  }
  if (peek.kind === "post") {
    const cover = covers[peek.slug]
    if (!cover) return null
    const h = Math.round((maxW * 9) / 16)
    return { type: "media", tiles: [{ src: cover, x: 0, y: 0, w: maxW, h }], w: maxW, h }
  }
  if (peek.kind === "mosaic") {
    return { type: "media", ...mosaic(peek.items, maxW), caption: peek.link?.label ?? peek.label }
  }
  return { type: "info", peek, w: Math.min(MAX_INFO, maxW) }
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
 * Scena: prawy tor siatki jest pusty, dopóki czegoś nie wskażesz. Karta stoi
 * na krawędziach toru (lewa = kolumna + odstęp, szerokość = tor, maks. 560 px),
 * w pionie płynie za kursorem na sprężynie, a każda nowa zawartość
 * **odkodowuje się z glifów** falą od strony kolumny — i gra klip realizacji.
 * Informacje (fakty, oś czasu) zamiast fali wyostrzają się z rozmycia.
 * Dekoracja dla myszy (`aria-hidden`); ta sama treść jest w kolumnie.
 */
export function StageCard({
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
  const slotRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const followerRef = useRef<Follower | null>(null)
  const decoderRef = useRef<GlyphDecoder | null>(null)
  const pointerY = useRef(0)
  /** Szerokość prawego toru siatki (karta = tor). */
  const [maxW, setMaxW] = useState(300)
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

  // Tor mierzony z siatki CSS (ten sam kontener co kolumna) — bez liczenia marginesów w JS.
  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return undefined
    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 300
      setMaxW(Math.round(Math.min(MAX_CARD, width)))
    })
    observer.observe(slot)
    return () => observer.disconnect()
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

  const targetKey = (state: PeekState): string | null =>
    !state.key || state.key === state.muted ? null : state.key
  const key = targetKey(peek)
  const content = key ? resolve(key, maxW, works, covers, peeks) : null
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

  // Pozycja w pionie: za kursorem (albo przy elemencie z fokusem); w poziomie stoi tor siatki.
  const size = shown ? { w: shown.content.w, h: cardH(shown.content) } : { w: 0, h: 0 }
  const place = useEffectEvent((jump: boolean) => {
    const follower = followerRef.current
    if (!follower || !visible) return
    const rect = peek.via === "focus" ? peek.anchor?.getBoundingClientRect() : undefined
    const anchor = rect ? rect.top + rect.height / 2 : pointerY.current
    const h = size.h || cardRef.current?.offsetHeight || 200
    const ty = clamp(anchor, TOP + h / 2, window.innerHeight - BOTTOM - h / 2) - h / 2
    follower.to(0, ty, jump || reduced)
  })

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      pointerY.current = event.clientY
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
                ctx.fillStyle = getComputedStyle(ctx.canvas).getPropertyValue("--i1-paper")
                ctx.fillRect(0, 0, dw, dh)
                paintLayer(previous, ctx, dw / from.w, dh / from.h)
              }
            : "latent",
      })
      delete card.dataset.pending
    })
  }, [shown, reduced, composite])

  const current = shown?.content
  const style = {
    width: size.w || undefined,
    height: current?.type === "media" ? size.h : undefined,
  } as CSSProperties

  return (
    <div
      aria-hidden="true"
      className="i1-tracks pointer-events-none fixed inset-x-0 top-0 z-30 items-start"
    >
      {/* Pusty kafel w prawym torze — z niego karta zna swoją szerokość. */}
      <div ref={slotRef} className="col-start-3 row-start-1 h-0" />
      <div ref={wrapRef} className="col-start-3 row-start-1 will-change-transform">
        <div
          ref={cardRef}
          data-i1-card=""
          data-visible={visible || undefined}
          data-kind={current?.type}
          style={style}
          className="i1-card relative overflow-hidden"
        >
          {layers.map((layerKey) => {
            const layerContent =
              layerKey === shown?.key
                ? shown.content
                : resolve(layerKey, maxW, works, covers, peeks)
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
          <canvas ref={canvasRef} className="i1-card__canvas" />
        </div>
      </div>
    </div>
  )
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
      <div
        data-layer={layerKey}
        data-active={active || undefined}
        className="i1-card__info p-(--i1-inset)"
      >
        <p className="flex items-baseline justify-between gap-4 text-fm-small">
          <span className="font-medium text-fm-ink">{peek.heading}</span>
          {peek.meta && <span className="shrink-0 text-fm-ink-3 tabular-nums">{peek.meta}</span>}
        </p>
        {peek.body && <p className="mt-1.5 text-fm-small text-pretty text-fm-ink-2">{peek.body}</p>}
        {peek.entries && (
          <ol className="mt-3 space-y-2.5 text-fm-small">
            {peek.entries.map((entry) => (
              <li key={entry.role} className="grid grid-cols-[6rem_1fr] gap-3">
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
      className="i1-card__media absolute inset-0"
    >
      {content.tiles.map((tile, index) => (
        <div
          key={`${tile.src}-${index}`}
          data-tile=""
          data-x={tile.x}
          data-y={tile.y}
          data-w={tile.w}
          data-h={tile.h}
          className={cn(
            "i1-media absolute overflow-hidden",
            content.tiles.length > 1 && "rounded-fm-md"
          )}
          style={{ left: tile.x, top: tile.y, width: tile.w, height: tile.h }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tile.src}
            alt=""
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
          {tile.video && video && <CardVideo src={tile.video} playing={playing} />}
        </div>
      ))}
      {content.caption && (
        <span className="absolute start-3 bottom-3 z-[4] inline-flex items-center rounded-full bg-fm-surface px-3 py-1 text-fm-micro font-medium text-fm-ink-2 shadow-fm-ring">
          {content.caption}
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
      className="i1-video absolute inset-0 size-full object-cover"
    />
  )
}
