"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import luma from "@/components/demo/shared/portrait/portrait-luma.webp"
import edges from "@/components/demo/shared/portrait/portrait-edges.webp"
import { CHARSET_SPECS } from "../engine/charsets"
import { follow, useSurface } from "../engine/useSurface"
import { loadImage, passPeriod, ScrollSettle } from "../engine/timing"

const PASS_MS = 1400
/** Kadr źródła (uv: x0, y0, x1, y1) — ten sam liczy CSS zdjęcia zastępczego (`--gll-crop-*`). */
const CROP: [number, number, number, number] = [0.1, 0.02, 0.92, 0.84]
/** Pierwszy przebieg startuje, gdy zdjęcie zastępcze przeniknie się w glify (300 ms). */
const FIRST_PASS_DELAY = 420

/**
 * Hero (A): portret ze zdjęcia złożony z glifów. Ton z luminancji po CLAHE
 * (oczy jasne, cienie podniesione), kontur z mapy krawędzi, kurtka wygasa
 * w dół i na boki. Bez JS i do startu GPU widać zdjęcie w skali szarości
 * w IDENTYCZNYM kadrze — canvas przenika się z nim w 300 ms. Przebieg
 * wariantu (skaner, fala…) przechodzi raz po wejściu i przy najechaniu;
 * w spoczynku twarz stoi kompletna. Kursor: lupa, odsłona zdjęcia albo szum;
 * kliknięcie — fala, która tylko miesza glify.
 */
export function PortraitField({ label }: { label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { surface, variant, reduced, auto, dark } = useSurface(
    "portrait",
    "hero",
    wrapRef,
    canvasRef
  )
  const [ready, setReady] = useState(false)
  const pointer = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    k: 0,
    target: 0,
    last: 0,
    coarse: false,
    ripple: -1,
    rx: 0,
    ry: 0,
    pass: -1,
    passX: 0,
    passY: 0,
    scroll: -1,
    entered: false,
  })

  useEffect(() => {
    if (!surface) return
    let alive = true
    void Promise.all([loadImage(luma.src), loadImage(edges.src)]).then(([image, edge]) => {
      if (!alive || !image) return
      surface.setSource({
        type: "image",
        image,
        edge: edge ?? undefined,
        fit: "contain",
        // Kadr na głowę i ramiona (ten sam co zdjęcia zastępczego w CSS); kurtka wygasa
        // w dół i na boki, poziomy liczone z samej twarzy.
        crop: CROP,
        fadeX: [0.1, 0.22, 0.8, 0.92],
        fade: [0.66, 0.84],
        levelsRegion: [0.32, 0.3, 0.76, 0.66],
        // Retusz oczodołów (jak w ciemni): cień wokół oczu jaśnieje, tęczówki zostają ciemne.
        dodge: [
          [0.483, 0.405, 0.085, 0.05],
          [0.693, 0.412, 0.075, 0.05],
        ],
        dodgeAmount: 0.55,
      })
      surface.configure({})
      surface.whenRendered(() => alive && setReady(true))
    })
    return () => {
      alive = false
    }
  }, [surface])

  useEffect(() => {
    if (!surface) return
    const state = pointer.current
    surface.configure({ animate: auto })
    // Raster punktów i bloki mają 8 / 4 próbki na komórkę. Zestawy „glif = komórka” dostają
    // drobniejszą siatkę (twarz ≥ 70 kolumn), ton w kryciu glifu, bez przycinania jasnych
    // partii i z lekko przyciemnionymi krawędziami rysów — oczy, nos i usta czytają się wszędzie.
    const spec = CHARSET_SPECS[variant.charset]
    const raster = spec.dither || spec.match
    const onPaper = variant.tone === "ink" ? !dark : variant.tone === "inverse" ? dark : false
    // Osobna krzywa tonu: tusz na papierze potrzebuje pełniejszych półtonów (inaczej blady),
    // świecące glify na ciemnym — rozjaśnionych.
    surface.configure({ gamma: onPaper ? 1.25 : 0.8 })
    surface.configure({
      ceil: raster ? 1 : 0.92,
      // Katakana ma cienkie kreski — nieco większa komórka, żeby glif niósł ton.
      cellScale: raster ? 1 : variant.charset === "kana" ? 0.75 : 0.6,
      curve: raster,
      // Zestawy „glif = komórka”: ton niesie krycie stałego glifu (binarny, katakana — jak kod
      // w „Matriksie”), rampy ASCII, kropek i sygnetu — kształt glifu i krycie razem.
      // Tusz na jasnym papierze — stały glif, ton w kryciu; świecące glify na ciemnym (Matrix,
      // ciemny motyw) — rampa kształtów, bo jasny glif sam niesie światło twarzy.
      random: raster ? null : spec.random && onPaper,
      alphaTone: raster ? null : spec.random && onPaper ? 0.92 : Math.max(spec.alphaTone, 0.55),
      edgeBoost: raster ? null : variant.charset === "kana" ? 0.22 : 0.16,
      sharp: raster ? 0.35 : 0.5,
    })
    surface.configure({ flicker: auto ? 0.02 : 0 })
    const ambient = variant.mode === "rain" || variant.mode === "flow"
    const settle = new ScrollSettle()
    surface.setFrame((now, dyn) => {
      const dt = state.last ? Math.min(64, now - state.last) : 16
      state.last = now
      const { dpr } = surface.size
      const { grid } = surface.cells
      let smooth = false

      // Soczewka: położenie i siła na sprężynie.
      state.x = follow(state.x, state.tx, dt, 70)
      state.y = follow(state.y, state.ty, dt, 70)
      state.k = follow(state.k, reduced ? 0 : state.target, dt, state.target > state.k ? 90 : 170)
      if (Math.abs(state.k - state.target) > 0.004) smooth = true
      if (Math.hypot(state.x - state.tx, state.y - state.ty) > 0.3 && state.k > 0.01) smooth = true
      const radius = (state.coarse ? 76 : 96) * dpr
      dyn.lens = [state.x * dpr, state.y * dpr, radius, state.k < 0.004 ? 0 : state.k]

      // Fala kliknięcia.
      if (state.ripple >= 0 && !reduced) {
        const age = now - state.ripple
        const strength = 1 - age / 1100
        if (strength <= 0) state.ripple = -1
        else {
          dyn.ripple = [state.rx * dpr, state.ry * dpr, age * 0.75 * dpr, strength]
          smooth = true
        }
      }
      if (state.ripple < 0) dyn.ripple = [0, 0, 0, 0]

      dyn.intro = 1
      // Pierwszy przebieg — raz, po wejściu (gdy zdjęcie zastępcze przeniknie się w glify).
      if (!reduced && !state.entered && variant.trigger === "continuous") {
        state.entered = true
        state.pass = now + FIRST_PASS_DELAY
        state.passX = 0
        state.passY = 0
      }

      // Przebieg wariantu: ciągły — tylko tła z natury żywe (deszcz, przepływ) płyną stale,
      // reszta przechodzi raz (wejście, najechanie); z przewijania; jednorazowy (najechanie, klik).
      let loop = -1
      if (!reduced) {
        if (variant.trigger === "continuous" && ambient) {
          if (auto) loop = (surface.time % passPeriod(variant.decode)) / passPeriod(variant.decode)
          dyn.from = [grid[0] * 0.5, grid[1] * 0.36]
        } else if (variant.trigger === "scroll") {
          const wrap = wrapRef.current
          if (wrap) {
            // Hero stoi na górze strony: przebieg od pierwszego piksela przewinięcia;
            // zatrzymane przewijanie dokańcza przebieg (pasmo nie zostaje na twarzy).
            const raw = window.scrollY / Math.max(1, wrap.offsetHeight * 0.8)
            const p = settle.update(raw > 0.002 ? raw : 0, surface.visible && raw > 0.002, dt)
            if (p !== state.scroll || (settle.pending && p > 0)) smooth = true
            state.scroll = p
            loop = p
          }
          dyn.from = [grid[0] * 0.5, grid[1] * 0.36]
        } else if (state.pass >= 0) {
          const p = (now - state.pass) / Math.max(PASS_MS, variant.decode)
          if (p >= 1) state.pass = -1
          else {
            loop = Math.max(0, p)
            if (p < 0) loop = -1
            smooth = true
          }
          const { cw, ch } = surface.cells
          dyn.from = [(state.passX * dpr) / cw, (state.passY * dpr) / ch]
        }
      }
      dyn.loop = loop
      return smooth
    })
    surface.invalidate()
    return () => {
      surface.setFrame(null)
    }
  }, [surface, auto, reduced, variant, dark])

  const local = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return [event.clientX - rect.left, event.clientY - rect.top] as const
  }

  const startPass = (x: number, y: number) => {
    const state = pointer.current
    state.pass = performance.now()
    state.passX = x
    state.passY = y
    surface?.invalidate()
  }

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      data-ready={ready || undefined}
      data-tone={variant.tone}
      className="gll-portrait"
      onPointerEnter={(event) => {
        const [x, y] = local(event)
        const state = pointer.current
        state.coarse = event.pointerType !== "mouse"
        if (event.pointerType === "mouse") {
          state.x = state.tx = x
          state.y = state.ty = y
          state.target = 1
          // Najechanie zawsze puszcza jeden przebieg (wariant „ciągły” też — bez pętli w spoczynku).
          if (variant.trigger === "hover" || variant.trigger === "continuous") startPass(x, y)
        }
        surface?.invalidate()
      }}
      onPointerMove={(event) => {
        const [x, y] = local(event)
        const state = pointer.current
        state.tx = x
        state.ty = y
        if (event.pointerType === "mouse") state.target = 1
        surface?.invalidate()
      }}
      onPointerDown={(event) => {
        const [x, y] = local(event)
        const state = pointer.current
        state.coarse = event.pointerType !== "mouse"
        state.ripple = performance.now()
        state.rx = x
        state.ry = y
        if (state.coarse) {
          state.x = state.tx = x
          state.y = state.ty = y
          state.target = 1
        }
        if (variant.trigger === "click") startPass(x, y)
        surface?.invalidate()
      }}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") pointer.current.target = 0
        surface?.invalidate()
      }}
      onPointerCancel={() => {
        pointer.current.target = 0
        surface?.invalidate()
      }}
      onPointerLeave={() => {
        pointer.current.target = 0
        surface?.invalidate()
      }}
    >
      <div className="gll-portrait__photo">
        {/* eslint-disable-next-line @next/next/no-img-element -- zastępczy obraz pod canvasem (bez JS i do startu GPU) */}
        <img src={luma.src} alt="" width={luma.width} height={luma.height} />
      </div>
      <canvas ref={canvasRef} aria-hidden="true" className="gll-portrait__canvas" />
    </div>
  )
}
