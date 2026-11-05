"use client"

import { useCallback } from "react"
import { useTheme } from "next-themes"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { CHARSET_SPECS } from "./charsets"
import { FONT_FAMILIES } from "./fonts"

/*
 * Zmiana motywu przez kafelkowo-pikselowe przejście ze znaków (wybór
 * właściciela: „albo coś bardzo prostego, albo coś w stylu animacji pikselowej,
 * kafelkowej” — nigdy „koło z przycisku”).
 *
 * `tiles`: View Transitions API robi zdjęcie starej strony i kładzie je NAD
 * nową. Zdjęcie znika kaflami (wycinanie `clip-path: path(evenodd …)` aktualizowane
 * co klatkę) — domyślnie polem szumu: miękki, nieregularny front schodzi ukośnie od
 * góry, niezależnie od przycisku (opcja `from: "origin"` — fala od przycisku
 * o organicznym brzegu). Wąskie pasmo poszarpanych kafli
 * (≈ 2 komórki glifów), w którym świeżo odsłonięty kafel na chwilę niesie glif
 * z logo w kolorze atramentu nowego motywu; za frontem pełny nowy motyw, przed
 * nim pełny stary. Całość 600 ms. `simple`: krótkie przenikanie (220 ms). Bez View Transitions
 * i przy „ogranicz ruch” — zmiana natychmiast.
 */

export type ThemeTransitionStyle = "tiles" | "simple"
type Theme = "light" | "dark"

const DURATION = 600
const FLASH_MS = 200
/** Szerokość pasma przejścia (w kaflach). */
const BAND = 3
/** Falowanie brzegu fali: stała część w kaflach (±) i część proporcjonalna do promienia. */
const WOBBLE = 1.8
const LOBE = 0.11
/** Pole (domyślne): falowanie frontu jako część całej drogi. */
const FIELD = 0.12
const STYLE_ID = "gx-theme-transition"

const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.2)
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

function rnd(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Szum wartości 2D (0–1) z gładką interpolacją i dwie oktawy — brzeg fali. */
function vnoise(x: number, y: number, seed: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)
  const h = (a: number, b: number) => rnd(a * 157 + b * 113 + seed * 7)
  const top = h(ix, iy) + (h(ix + 1, iy) - h(ix, iy)) * u
  const bottom = h(ix, iy + 1) + (h(ix + 1, iy + 1) - h(ix, iy + 1)) * u
  return top + (bottom - top) * v
}

function fbm(x: number, y: number, seed: number) {
  return 0.8 * vnoise(x, y, seed) + 0.2 * vnoise(x * 2.1 + 5.2, y * 2.1 - 1.7, seed)
}

function styleTag() {
  let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!tag) {
    tag = document.createElement("style")
    tag.id = STYLE_ID
    document.head.append(tag)
  }
  return tag
}

/** Zmiana klasy motywu od razu (zdjęcie nowego stanu musi już ją mieć) + zapis w next-themes. */
function applyTheme(next: Theme, setTheme: (theme: string) => void) {
  const root = document.documentElement
  root.classList.remove(next === "dark" ? "light" : "dark")
  root.classList.add(next)
  root.style.colorScheme = next
  setTheme(next)
}

export interface ThemeTransitionOptions {
  /**
   * `field` (domyślnie) — rozpad kafli po całym ekranie, sterowany polem szumu: miękki,
   * nieregularny front schodzi ukośnie od góry (bez związku z przyciskiem — nie „koło”).
   * `origin` — fala od punktu `origin` (środek przycisku) o organicznym brzegu.
   */
  from?: "field" | "origin"
}

export function useThemeTransition(
  style: ThemeTransitionStyle = "tiles",
  { from = "field" }: ThemeTransitionOptions = {}
) {
  const { setTheme } = useTheme()
  const reduced = useReducedMotion()

  return useCallback(
    (next: Theme, origin?: { x: number; y: number }) => {
      const doc = document as Document & {
        startViewTransition?: (update: () => void) => {
          ready: Promise<void>
          finished: Promise<void>
        }
      }
      if (reduced || !doc.startViewTransition) {
        applyTheme(next, setTheme)
        return
      }
      const tag = styleTag()
      // Bez przejść CSS w trakcie zdjęć (kolory nie „dojeżdżają” po przełączeniu).
      const freeze = "*,*::before,*::after{transition:none!important}"

      if (style === "simple") {
        tag.textContent = `${freeze}::view-transition-old(root),::view-transition-new(root){animation-duration:220ms}`
        const transition = doc.startViewTransition(() => applyTheme(next, setTheme))
        void transition.finished.finally(() => (tag.textContent = ""))
        return
      }

      const width = window.innerWidth
      const height = window.innerHeight
      // Kafel ≈ dwie komórki glifów (16 px), na dużych ekranach odrobinę większy.
      const tile = Math.round(Math.min(20, Math.max(14, Math.min(width, height) / 56)))
      const cols = Math.ceil(width / tile)
      const rows = Math.ceil(height / tile)
      const ox = origin?.x ?? width - 40
      const oy = origin?.y ?? 32
      const radial = from === "origin"
      // Położenie kafla na drodze frontu: odległość od przycisku (`origin`) albo rzut na kierunek
      // ukośny od góry (`field` — 20° od pionu: front schodzi z góry i lekko w bok).
      const dir = { x: Math.sin(0.35), y: Math.cos(0.35) }
      const far = radial
        ? Math.max(
            Math.hypot(ox, oy),
            Math.hypot(width - ox, oy),
            Math.hypot(ox, height - oy),
            Math.hypot(width - ox, height - oy)
          )
        : width * dir.x + height * dir.y
      // Czysty front: kafel odsłania się, gdy front minie jego położenie + drobne przesunięcie
      // w paśmie BAND kafli (poszarpany, pikselowy brzeg). Za pasmem — pełny nowy motyw,
      // przed nim — pełny stary; żadnych rozsianych kafli.
      const band = BAND * tile
      const dist = new Float32Array(cols * rows)
      const jitter = new Float32Array(cols * rows)
      const opened = new Float32Array(cols * rows).fill(-1)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          const x = c * tile + tile / 2
          const y = r * tile + tile / 2
          dist[i] = radial ? Math.hypot(x - ox, y - oy) : x * dir.x + y * dir.y
          jitter[i] = rnd(i) * band
        }
      }
      // Brzeg frontu: szum przestrzenny niskiej częstotliwości (płaty ~8 kafli), płynący
      // w czasie — kod „rozlewa się”, front nie jest ani kołem, ani linią skanera. Przy fali
      // od przycisku amplituda rośnie z promieniem (±WOBBLE kafli → ±LOBE × promień); przy
      // polu jest stała (±FIELD × droga). Ziarno losowe — żadne dwa przejścia nie są takie same.
      const seed = Math.floor(Math.random() * 1000)
      const wobble = radial ? WOBBLE * tile + LOBE * far : WOBBLE * tile + FIELD * far
      const edge = (c: number, r: number, seconds: number, reach: number) =>
        (radial ? WOBBLE * tile + LOBE * reach : wobble) *
        (2 * fbm(c * 0.12 + seconds * 0.9, r * 0.12 - seconds * 0.7, seed) - 1)
      const glyphs = Array.from(CHARSET_SPECS.sygnet.candidates).slice(4)

      // Stare zdjęcie NAD nowym, bez przenikania; `gx-hold` tylko trzyma przejście przez DURATION.
      const base = `${freeze}
        ::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}
        ::view-transition-new(root){z-index:1}
        @keyframes gx-hold{from{opacity:1}to{opacity:1}}`
      const oldRule = (clip: string) =>
        `::view-transition-old(root){z-index:2;animation:gx-hold ${DURATION}ms linear both;${clip}}`
      tag.textContent = base + oldRule("")

      let canvas: HTMLCanvasElement | null = null
      const transition = doc.startViewTransition(() => {
        applyTheme(next, setTheme)
        // Płótno błysków powstaje w NOWYM stanie — widać je tylko w odsłoniętych kaflach.
        canvas = document.createElement("canvas")
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.setAttribute("aria-hidden", "true")
        canvas.style.cssText =
          "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483647"
        document.body.append(canvas)
      })

      void transition.ready.then(() => {
        const start = performance.now()
        const ctx = canvas?.getContext("2d")
        const dpr = canvas ? canvas.width / width : 1
        // Kolor atramentu nowego motywu (jak w palecie silnika).
        const ink = next === "dark" ? "#f2f2f2" : "#171717"
        const outer = `M0 0H${width}V${height}H0Z`
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION)
          // Pole startuje nad ekranem (−wobble), więc pierwsze płaty wchodzą miękko z góry.
          const radius = radial
            ? easeOut(t) * (far + band + tile + wobble)
            : -wobble + easeInOut(t) * (far + band + tile + 2 * wobble)
          const seconds = (now - start) / 1000
          let holes = ""
          if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = ink
            ctx.font = `${Math.round(tile * 0.72 * dpr)}px ${FONT_FAMILIES.mono}`
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
          }
          for (let r = 0; r < rows; r++) {
            const y = r * tile
            // Wnętrze fali w rzędzie to jeden–dwa ciągłe odcinki — prostokąt na odcinek zamiast
            // wielu kafli (ścieżka zostaje krótka); kafle pasma leżą poza nimi, nic się nie nakłada.
            let run = -1
            for (let c = 0; c <= cols; c++) {
              const i = r * cols + c
              const reach = c < cols ? radius + edge(c, r, seconds, radius) : 0
              const inner = c < cols && (dist[i] ?? 0) + band <= reach
              if (inner && run < 0) run = c
              if (!inner && run >= 0) {
                holes += `M${run * tile} ${y}h${(c - run) * tile}v${tile}h${-(c - run) * tile}z`
                run = -1
              }
              if (c === cols || inner) continue
              if ((dist[i] ?? 0) + (jitter[i] ?? 0) > reach) continue
              const x = c * tile
              holes += `M${x} ${y}h${tile}v${tile}h${-tile}z`
              if ((opened[i] ?? -1) < 0) opened[i] = now
              // Kafel → glif → nowy kolor: świeżo odsłonięty kafel przez chwilę niesie glif.
              const age = now - (opened[i] ?? now)
              if (ctx && age < FLASH_MS) {
                ctx.globalAlpha = 1 - age / FLASH_MS
                ctx.fillText(
                  glyphs[(i * 7 + Math.floor(age / 50)) % glyphs.length] ?? "·",
                  (x + tile / 2) * dpr,
                  (y + tile / 2) * dpr
                )
              }
            }
          }
          tag.textContent = base + oldRule(`clip-path:path(evenodd,"${outer}${holes}")`)
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
      void transition.finished.finally(() => {
        tag.textContent = ""
        ;(canvas as HTMLCanvasElement | null)?.remove()
      })
    },
    [reduced, setTheme, style, from]
  )
}
