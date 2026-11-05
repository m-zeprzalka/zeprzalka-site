"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import { cn } from "@/components/demo/forma/cn"
import { CHARSET_SPECS } from "./charsets"
import { glyphFontVariables } from "./fonts"
import { follow, passPeriod } from "./engine/timing"
import { PortraitFallback } from "./PortraitFallback"
import type { GlyphSettings } from "./settings"
import { localPoint, useSettings, useSurface } from "./useSurface"

let faceCanvas: Promise<HTMLCanvasElement | null> | null = null

/**
 * Ton twarzy z danych (`face-tones.ts`, 4 bity na punkt), rozpakowany do płótna poza DOM.
 * Żaden obraz twarzy nie jest pobierany — moduł ładuje się leniwie razem z silnikiem.
 */
function loadFace(): Promise<HTMLCanvasElement | null> {
  faceCanvas ??= import("./face-tones").then(
    ({ FACE_TONES: { width, height, data } }) => {
      const bytes = Uint8Array.from(atob(data), (char) => char.charCodeAt(0))
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) return null
      const image = ctx.createImageData(width, height)
      for (let i = 0; i < width * height; i++) {
        const byte = bytes[i >> 1] ?? 0
        const value = i & 1 ? byte & 15 : byte >> 4
        if (!value) continue
        const tone = Math.round(((value - 1) / 14) * 255)
        image.data[i * 4] = tone
        image.data[i * 4 + 1] = tone
        image.data[i * 4 + 2] = tone
        image.data[i * 4 + 3] = 255
      }
      ctx.putImageData(image, 0, 0)
      return canvas
    },
    () => null
  )
  return faceCanvas
}

/** Pierwszy przebieg (fala od oczu) chwilę po tym, jak glify przejmą kadr od warstwy zastępczej. */
const FIRST_PASS_DELAY = 360
const PASS_MS = 1500
/** Obszar skóry w uv źródła (z punktów twarzy) — z niego poziomy czerni i bieli (bez włosów). */
const FACE_REGION: [number, number, number, number] = [0.26, 0.39, 0.82, 0.89]
/** Oczodoły (uv: x, y, promień x, promień y) — rozjaśniane tylko w ciemnym motywie. */
const EYES: [[number, number, number, number], [number, number, number, number]] = [
  [0.508, 0.526, 0.1, 0.055],
  [0.792, 0.542, 0.08, 0.05],
]

/**
 * Twarz właściciela ułożona ze znaków (sama głowa: włosy, twarz, uszy — bez
 * szyi i ubrania). Ton z danych tonów (siatka 4-bitowa z wpieczonymi rysami —
 * nie obraz), oczodoły rozjaśniane w shaderze tylko w ciemnym motywie. Zanim silnik się załaduje (i bez JS, i bez WebGL2)
 * widać statyczną klatkę znaków w identycznym kadrze — prawdziwe zdjęcie nie
 * trafia do przeglądarki nigdy.
 *
 * W spoczynku twarz oddycha (przepływ) albo co kilka sekund przechodzi przez
 * nią przebieg wybranej animacji. Kursor i palec: nieregularny, morfujący
 * obszar szumu (glify mieszają się, ton zostaje); dotknięcie puszcza falę,
 * która tylko miesza znaki — bez dziur i czarnych pól.
 */
export function GlyphPortrait({
  className,
  settings: patch,
  interactive = true,
  label = "Portret Michała Zeprzałki ułożony ze znaków",
}: {
  className?: string
  settings?: Partial<GlyphSettings>
  interactive?: boolean
  label?: string
}) {
  const settings = useSettings(patch)
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { surface, reduced, auto, dark } = useSurface("portrait", settings, wrapRef, canvasRef)
  const [ready, setReady] = useState(false)
  const pointer = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    hx: 0,
    hy: 0,
    k: 0,
    target: 0,
    last: 0,
    coarse: false,
    ripple: -1,
    rx: 0,
    ry: 0,
    pass: -1,
    passX: 0.5,
    passY: 0.42,
    nextPass: 0,
    moved: 0,
  })

  useEffect(() => {
    if (!surface) return
    let alive = true
    void loadFace().then((image) => {
      if (!alive || !image) return
      surface.setSource({
        type: "image",
        image,
        fit: "contain",
        levelsRegion: FACE_REGION,
        dodgeRegions: EYES,
      })
      surface.whenRendered(() => alive && setReady(true))
    })
    return () => {
      alive = false
    }
  }, [surface])

  useEffect(() => {
    if (!surface) return
    const state = pointer.current
    // Raster punktów i bloki mają 8 / 4 próbki na komórkę. Zestawy „glif = komórka” dostają
    // drobniejszą siatkę i ton w kryciu glifu.
    const spec = CHARSET_SPECS[settings.charset]
    const raster = spec.dither || spec.match
    // Strojenie tonu (M2, porównanie z „Glif · laboratorium” obok siebie): na jasnym tusz
    // siedzi w cieniach — półtony skóry dostają gęstość (`dgamma` < 1), włosy nie są czarnym
    // blokiem (`ceil`); na ciemnym glify świecą w światłach — oczodoły jaśnieją (`dodge`),
    // rysy podbija lokalny kontrast (`sharp`) i krawędzie (`edgeBoost`).
    surface.configure({
      animate: auto,
      gamma: dark ? 0.85 : 1,
      dgamma: dark ? 1 : raster ? 0.7 : 0.7,
      ceil: dark ? (raster ? 1 : 0.96) : raster ? 0.94 : 0.88,
      // Na jasnym półtony skóry rysują średnie glify w lekkim kryciu (szara skóra, nie pusta);
      // ASCII niesie ton samym kształtem, więc podnosi mniej.
      shapeLift: dark ? 0.9 : settings.charset === "ascii" ? 0.7 : 0.6,
      dodge: dark ? 0.5 : 0,
      cellScale: raster ? 0.75 : 0.6,
      curve: raster,
      random: raster ? null : spec.random && !dark,
      alphaTone: raster
        ? null
        : spec.random && !dark
          ? 0.92
          : Math.max(spec.alphaTone, dark ? 0.55 : settings.charset === "ascii" ? 0.45 : 0.62),
      // Krawędzie rysów są wpieczone w dane tonów; wariant konturowy liczy je z gradientu tonu.
      autoEdge: settings.render === "contour" ? 4 : 0,
      edgeBoost: settings.render === "contour" ? 0.2 : 0,
      sharp: raster ? 0.4 : 0.6,
      flicker: auto ? 0.02 : 0,
      minCols: raster ? 48 : 64,
    })
    const ambient = settings.mode === "flow" || settings.mode === "rain"
    const period = passPeriod(settings.decode) * 1000 + 3600
    surface.setFrame((now, dyn) => {
      const dt = state.last ? Math.min(64, now - state.last) : 16
      state.last = now
      const { dpr } = surface.size
      const { grid, cw, ch } = surface.cells
      let smooth = false

      // Obszar kursora: głowa na szybkiej sprężynie, ogon dogania ją wolniej (kształt się wyciąga).
      state.x = follow(state.x, state.tx, dt, 70)
      state.y = follow(state.y, state.ty, dt, 70)
      state.hx = follow(state.hx, state.x, dt, 230)
      state.hy = follow(state.hy, state.y, dt, 230)
      state.k = follow(state.k, reduced ? 0 : state.target, dt, state.target > state.k ? 110 : 260)
      // Płynnie (60/s) tylko w ruchu kursora i w trakcie narastania/gaśnięcia plamy; nad
      // nieruchomym kursorem plama żyje w tempie glifów (bez zbędnych klatek).
      if (Math.abs(state.k - state.target) > 0.004) smooth = true
      if (state.k > 0.01 && now - state.moved < 180) smooth = true
      const radius = (state.coarse ? 70 : 88) * dpr
      dyn.lens = [state.x * dpr, state.y * dpr, radius, state.k < 0.004 ? 0 : state.k]
      dyn.tail = [state.hx * dpr, state.hy * dpr]

      // Fala dotknięcia — tylko miesza znaki.
      if (state.ripple >= 0 && !reduced) {
        const age = now - state.ripple
        const strength = 1 - age / 1100
        if (strength <= 0) state.ripple = -1
        else {
          dyn.ripple = [state.rx * dpr, state.ry * dpr, age * 0.7 * dpr, strength]
          smooth = true
        }
      }
      if (state.ripple < 0) dyn.ripple = [0, 0, 0, 0]
      dyn.intro = 1

      // Przebieg: tła z natury żywe (przepływ, deszcz) płyną stale; pozostałe animacje
      // przechodzą raz po wejściu, przy najechaniu i co kilka sekund — w spoczynku twarz stoi pełna.
      let loop = -1
      if (!reduced) {
        if (ambient && auto) {
          loop = (surface.time % passPeriod(settings.decode)) / passPeriod(settings.decode)
          dyn.from = [grid[0] * 0.5, grid[1] * 0.4]
        } else {
          if (auto && state.pass < 0 && state.nextPass && now > state.nextPass) {
            state.pass = now
            state.passX = 0.5
            state.passY = 0.42
          }
          if (!state.nextPass) state.nextPass = now + FIRST_PASS_DELAY
          if (state.pass >= 0) {
            const p = (now - state.pass) / Math.max(PASS_MS, settings.decode)
            if (p >= 1) {
              state.pass = -1
              state.nextPass = now + period
            } else {
              loop = Math.max(0, p)
              smooth = true
            }
          }
          const { width, height } = surface.size
          dyn.from = [(state.passX * width * dpr) / cw, (state.passY * height * dpr) / ch]
        }
      }
      dyn.loop = loop
      return smooth
    })
    surface.invalidate()
    return () => surface.setFrame(null)
  }, [surface, auto, reduced, settings, dark])

  const local = (event: PointerEvent<HTMLDivElement>) =>
    localPoint(event.currentTarget, event.clientX, event.clientY)

  const handlers = interactive
    ? {
        onPointerEnter: (event: PointerEvent<HTMLDivElement>) => {
          const [x, y] = local(event)
          const state = pointer.current
          state.coarse = event.pointerType !== "mouse"
          if (event.pointerType === "mouse") {
            if (state.k < 0.05) {
              state.x = state.tx = state.hx = x
              state.y = state.ty = state.hy = y
            }
            state.target = 1
            if (state.pass < 0 && surface) {
              state.pass = performance.now()
              state.passX = x / Math.max(1, event.currentTarget.offsetWidth)
              state.passY = y / Math.max(1, event.currentTarget.offsetHeight)
            }
          }
          surface?.invalidate()
        },
        onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
          const [x, y] = local(event)
          const state = pointer.current
          state.tx = x
          state.ty = y
          state.moved = performance.now()
          if (event.pointerType === "mouse") state.target = 1
          surface?.invalidate()
        },
        onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
          const [x, y] = local(event)
          const state = pointer.current
          state.coarse = event.pointerType !== "mouse"
          state.ripple = performance.now()
          state.rx = x
          state.ry = y
          if (state.coarse) {
            state.x = state.tx = state.hx = x
            state.y = state.ty = state.hy = y
            state.target = 1
          }
          surface?.invalidate()
        },
        onPointerUp: (event: PointerEvent<HTMLDivElement>) => {
          if (event.pointerType !== "mouse") pointer.current.target = 0
          surface?.invalidate()
        },
        onPointerCancel: () => {
          pointer.current.target = 0
          surface?.invalidate()
        },
        onPointerLeave: () => {
          pointer.current.target = 0
          surface?.invalidate()
        },
      }
    : {}

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      data-ready={ready || undefined}
      className={cn(
        glyphFontVariables,
        "group/gx relative isolate aspect-[346/461] touch-pan-y select-none",
        className
      )}
      {...handlers}
    >
      <PortraitFallback className="transition-opacity duration-300 ease-out group-data-[ready]/gx:opacity-0" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-300 ease-out group-data-[ready]/gx:opacity-100"
      />
    </div>
  )
}
