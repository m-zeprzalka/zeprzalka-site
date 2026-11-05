"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { useTheme } from "next-themes"
import { useReducedMotion } from "../../forma/use-in-view"
import { lens, modeStore, onLensFrame } from "../lens/store"
import { loadMono } from "./atlas"
import type * as Glyphs from "./glyphs"
import type { GlyphSource, ViewSpec } from "./glyphs"

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "")
  const full = value.length === 3 ? [...value].map((char) => char + char).join("") : value
  const number = parseInt(full, 16)
  return [((number >> 16) & 255) / 255, ((number >> 8) & 255) / 255, (number & 255) / 255]
}

/* ——— Jeden zegar dla wszystkich żywych widoków ——— */

interface Live {
  draw: (now: number, lensMoved: boolean) => void
}

const active = new Set<Live>()
let tickFrame = 0
let lensVersion = 0
let drawnVersion = 0
let offLens: (() => void) | null = null
let engine: typeof Glyphs | null = null
let loading: Promise<typeof Glyphs> | null = null

/**
 * Ostatnia aktywność (przewijanie, mysz, dotyk). Cyfry migoczą tylko przez
 * chwilę po niej — potem obraz staje (WCAG 2.2.2: ruch dłuższy niż 5 s nie
 * może trwać bez końca). Grające wideo jest wyjątkiem (ma własną pauzę).
 */
let lastActivity = 0
const IDLE_MS = 6000
let mounted = 0
let activityBound = false

function bindActivity() {
  if (activityBound) return
  activityBound = true
  const touch = () => {
    lastActivity = performance.now()
    if (active.size && !tickFrame) tickFrame = requestAnimationFrame(tick)
  }
  window.addEventListener("scroll", touch, { passive: true })
  window.addEventListener("pointermove", touch, { passive: true })
  window.addEventListener("pointerdown", touch, { passive: true })
}

function loadEngine() {
  loading ??= import("./glyphs").then((module) => (engine = module))
  return loading
}

function tick(now: number) {
  tickFrame = 0
  if (!active.size) return
  const moved = lensVersion !== drawnVersion
  drawnVersion = lensVersion
  for (const view of active) view.draw(now, moved)
  tickFrame = requestAnimationFrame(tick)
}

function activate(view: Live) {
  active.add(view)
  offLens ??= onLensFrame(() => {
    lensVersion += 1
  })
  if (!tickFrame) tickFrame = requestAnimationFrame(tick)
}

function deactivate(view: Live) {
  active.delete(view)
  if (!active.size) {
    cancelAnimationFrame(tickFrame)
    tickFrame = 0
  }
}

/** Największa powierzchnia płótna widoku (px urządzenia) — duże kadry dostają niższy DPR. */
const MAX_PIXELS = 2_600_000

/**
 * Obraz w kliszy jako cyfry 0/1 nałożone na sam obraz. Dwie warstwy:
 * - podkład (CSS, zawsze): ten sam plik co w projekcie w kolorze, klisza ok. 50%
 *   i jasne cyfry z maski (`digits.svg`) — widoczny od pierwszego malowania,
 *   w trybie „Kod” i przy „ogranicz ruch”; obraz zawsze widać pod kodem;
 * - żywy widok (WebGL, wspólny silnik): gdy soczewka na nim leży albo strona
 *   jest w trybie „Kod” — prawdziwe cyfry z jasności, z wideo klatka po klatce.
 * Źródło: `source` — klucz oryginału (`data-rg-key`) w tej samej sekcji: jego
 * wideo (gdy ma klatki) albo obraz, czyli dokładnie to, co widać w projekcie.
 */
export function MediaTwin({
  source,
  cell = 7,
  tone = 0,
  negative = false,
}: {
  source: string
  cell?: number
  tone?: number
  /**
   * Zrzut interfejsu: znaki na krawędziach i ciemnych elementach (tekst, ramki) —
   * inaczej jasny zrzut na ciemnej kliszy byłby jednolitym szumem.
   */
  negative?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    mounted += 1
    bindActivity()
    lastActivity = performance.now()
    return () => {
      mounted -= 1
      // Ostatni widok znaków zniknął (inne demo) — kontekst WebGL wraca do przeglądarki.
      if (mounted === 0) engine?.disposeGlyphs()
    }
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const live = liveRef.current
    const face = wrap?.closest<HTMLElement>("[data-rg-face]")
    const host = face?.closest<HTMLElement>("[data-rg-host]")
    const ctx = live?.getContext("2d")
    if (!wrap || !live || !ctx || !face || !host) return
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const spec: ViewSpec = { cell, tone, negative }
    const original = host.querySelector<HTMLElement>(`[data-rg-key="${source}"]`)
    let alive = true
    let inView = false
    let width = 0
    let height = 0
    let dpr = 1
    let wanted = false
    let last = 0

    const style = getComputedStyle(wrap)
    const inkRgb = hexToRgb(style.getPropertyValue("--rg-glyph").trim() || "#e5e5e5")
    const veil = style.getPropertyValue("--rg-veil").trim() || "rgba(20, 20, 20, 0.5)"
    const invert = style.getPropertyValue("--rg-glyph-invert").trim() === "1"

    // Podkład: ten sam adres co obraz w projekcie (z pamięci podręcznej — bez dodatkowych bajtów).
    const setBase = () => {
      const image = original?.querySelector("img")
      const video = original?.querySelector("video")
      const url = image?.currentSrc || image?.src || video?.poster
      if (url) wrap.style.setProperty("--rg-src", `url("${url}")`)
    }
    setBase()
    original?.addEventListener("load", setBase, true)

    const currentSource = (): GlyphSource | null => {
      const video = original?.querySelector("video")
      if (video && video.readyState >= 2 && video.videoWidth > 0) return video
      const image = original?.querySelector("img")
      return image && image.complete && image.naturalWidth > 0 ? image : null
    }

    const resizeLive = () => {
      const cap = coarse ? 1.5 : 2
      const area = Math.max(1, width * height)
      dpr = Math.min(cap, window.devicePixelRatio || 1, Math.sqrt(MAX_PIXELS / area))
      live.width = Math.max(1, Math.round(width * dpr))
      live.height = Math.max(1, Math.round(height * dpr))
    }

    // Prostokąt w px dokumentu: odczyt tylko po zmianie układu albo przewinięciu (bez
    // wymuszania przeliczenia stylów co klatkę); karty w ruchomym rzędzie czytają zawsze.
    const moving = !!host.closest(".rg-track")
    let rectDirty = true
    const docRect = { x: 0, y: 0, w: 0, h: 0 }
    const markDirty = () => (rectDirty = true)
    window.addEventListener("scroll", markDirty, { passive: true })
    const lensBox = () => {
      if (rectDirty || moving) {
        const rect = wrap.getBoundingClientRect()
        docRect.x = rect.left + window.scrollX
        docRect.y = rect.top + window.scrollY
        docRect.w = rect.width
        docRect.h = rect.height
        rectDirty = false
      }
      return {
        x: lens.x - lens.w / 2 - docRect.x,
        y: lens.y - lens.h / 2 - docRect.y,
        w: lens.w,
        h: lens.h,
        rw: docRect.w,
        rh: docRect.h,
      }
    }

    const view: Live = {
      draw(now, lensMoved) {
        if (!engine || !width || !height) return
        const media = currentSource()
        if (!media) return
        const full = modeStore.get() === "code"
        const video = media instanceof HTMLVideoElement && !media.paused
        const interval = video ? 33 : 80
        if (!(lensMoved && !full) && now - last < interval) return
        // Bez aktywności i bez grającego wideo — stopklatka (ostatnia klatka zostaje na płótnie).
        if (!video && !(lensMoved && !full) && last && now - lastActivity > IDLE_MS) return
        last = now
        const box = full ? null : lensBox()
        const drawn = engine.drawView(
          spec,
          { ctx, width: live.width, height: live.height, dpr },
          {
            source: media,
            veil,
            ink: inkRgb,
            invert,
            time: now / 1000,
            clip: box ? { x: box.x, y: box.y, w: box.w, h: box.h } : null,
          }
        )
        if (drawn) wrap.setAttribute("data-live", "")
      },
    }

    const start = () => {
      wanted = true
      last = 0
      resizeLive()
      void Promise.all([loadEngine(), loadMono("01")]).then(() => {
        if (alive && wanted) activate(view)
      })
    }

    // Płótno żywego widoku istnieje tylko wtedy, gdy coś na nim jest — pamięć wraca od razu.
    const stop = () => {
      wanted = false
      deactivate(view)
      wrap.removeAttribute("data-live")
      live.width = 1
      live.height = 1
    }

    const evaluate = () => {
      if (!alive || reduced) return
      const code = modeStore.get() === "code"
      const shown = inView && (code || face.hasAttribute("data-on"))
      if (!shown) {
        if (wanted) stop()
        return
      }
      let want = code
      if (!want && lens.w > 0) {
        const box = lensBox()
        want = box.x < box.rw && box.y < box.rh && box.x + box.w > 0 && box.y + box.h > 0
      }
      if (want && !wanted) start()
      else if (!want && wanted) stop()
    }

    const sizes = new ResizeObserver(([entry]) => {
      if (!entry) return
      width = Math.round(entry.contentRect.width)
      height = Math.round(entry.contentRect.height)
      if (wanted) resizeLive()
      last = 0
      rectDirty = true
      evaluate()
    })
    sizes.observe(wrap)
    const visibility = new IntersectionObserver(
      ([entry]) => {
        inView = !!entry?.isIntersecting
        evaluate()
      },
      { rootMargin: "120px 0px" }
    )
    visibility.observe(wrap)
    const offFrame = onLensFrame(evaluate)
    const offMode = modeStore.subscribe(evaluate)

    return () => {
      alive = false
      window.removeEventListener("scroll", markDirty)
      original?.removeEventListener("load", setBase, true)
      sizes.disconnect()
      visibility.disconnect()
      offFrame()
      offMode()
      stop()
    }
  }, [source, cell, tone, negative, reduced, resolvedTheme])

  return (
    <div
      ref={wrapRef}
      className="rg-media"
      data-negative={negative || undefined}
      style={{ "--rg-cell": `${cell}px` } as CSSProperties}
    >
      <span aria-hidden="true" className="rg-media__photo" />
      <span aria-hidden="true" className="rg-media__veil" />
      <span aria-hidden="true" className="rg-media__base" />
      <canvas ref={liveRef} width={1} height={1} aria-hidden="true" className="rg-media__gl" />
    </div>
  )
}
