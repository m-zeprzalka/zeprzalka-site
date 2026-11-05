/*
 * Model laboratorium: każdy wariant efektu to kilka parametrów, każda sekcja
 * strony ma własny wariant (litera A–H). Moduł czysty (bez Reacta i DOM) —
 * importują go i serwer (podpisy w HTML), i wyspy klienckie.
 */

export type Charset = "ascii" | "binary" | "kana" | "braille" | "blocks" | "dots" | "sygnet"
export type Mode = "wave" | "scramble" | "rain" | "flow" | "dissolve" | "scan"
export type Trigger = "continuous" | "scroll" | "hover" | "click"
export type Tone = "ink" | "inverse" | "matrix"
export type Fps = 8 | 12 | 24 | 60
export type Decode = 400 | 800 | 1600 | 3000
export type Cell = 6 | 8 | 10 | 14
/** Tylko portret (A): jak glify niosą twarz i co robi kursor. */
export type Render = "tone" | "contour" | "mixed"
export type Cursor = "loupe" | "reveal" | "scramble"
/** Tylko realizacje (D): spoczynek — przygaszony obraz z glifami w jego kolorze albo sam kod. */
export type Rest = "veil" | "code"

export interface Variant {
  charset: Charset
  mode: Mode
  fps: Fps
  decode: Decode
  cell: Cell
  tone: Tone
  trigger: Trigger
  render: Render
  cursor: Cursor
  rest: Rest
}

export type SectionId = "hero" | "bio" | "skills" | "works" | "cta" | "blog" | "contact" | "footer"
export type Param = keyof Variant

export const SECTIONS: readonly SectionId[] = [
  "hero",
  "bio",
  "skills",
  "works",
  "cta",
  "blog",
  "contact",
  "footer",
]

/** Litera i nazwa sekcji w panelu; `params` — co dana powierzchnia rozumie. */
export const SECTION_META: Record<
  SectionId,
  {
    letter: string
    name: string
    params: readonly Param[]
    modes?: readonly Mode[]
    triggers: readonly Trigger[]
  }
> = {
  hero: {
    letter: "A",
    name: "Portret",
    params: ["charset", "render", "cursor", "mode", "fps", "decode", "cell", "tone", "trigger"],
    triggers: ["continuous", "scroll", "hover", "click"],
  },
  bio: {
    letter: "B",
    name: "Biogram",
    params: ["charset", "mode", "fps", "decode", "trigger"],
    modes: ["wave", "scramble", "scan", "dissolve"],
    triggers: ["scroll", "continuous", "hover", "click"],
  },
  skills: {
    letter: "C",
    name: "Kompetencje",
    params: ["charset", "mode", "fps", "decode", "cell", "tone", "trigger"],
    triggers: ["scroll", "continuous", "hover", "click"],
  },
  works: {
    letter: "D",
    name: "Realizacje",
    params: ["rest", "charset", "mode", "fps", "decode", "cell", "tone", "trigger"],
    triggers: ["hover", "scroll", "continuous"],
  },
  cta: {
    letter: "E",
    name: "Soczewka CTA",
    params: ["charset", "mode", "fps", "cell", "tone", "trigger"],
    triggers: ["continuous", "hover", "click"],
  },
  blog: {
    letter: "F",
    name: "Blog",
    params: ["charset", "mode", "fps", "decode", "cell", "tone", "trigger"],
    triggers: ["hover", "scroll", "continuous"],
  },
  contact: {
    letter: "G",
    name: "Kontakt",
    params: ["charset", "mode", "fps", "decode", "trigger"],
    modes: ["scramble", "wave", "scan", "dissolve"],
    triggers: ["click", "hover", "continuous"],
  },
  footer: {
    letter: "H",
    name: "Znak w stopce",
    params: ["charset", "mode", "fps", "decode", "cell", "tone", "trigger"],
    triggers: ["scroll", "continuous", "hover"],
  },
}

/* ——— Słownik opcji (krótkie napisy interfejsu) ——— */

export const CHARSETS: readonly { id: Charset; label: string; sample: string }[] = [
  { id: "ascii", label: "ASCII", sample: "@%+:." },
  { id: "binary", label: "Binarny", sample: "0110" },
  { id: "kana", label: "Matrix", sample: "ハクシ" },
  { id: "braille", label: "Braille", sample: "⣿⡷⠕" },
  { id: "blocks", label: "Bloki", sample: "█▓▒░" },
  { id: "dots", label: "Kropki", sample: "●◎○·" },
  { id: "sygnet", label: "Sygnet", sample: "⎈⌘⊞" },
]

export const MODES: readonly { id: Mode; label: string }[] = [
  { id: "wave", label: "Fala" },
  { id: "scramble", label: "Szum" },
  { id: "rain", label: "Deszcz" },
  { id: "flow", label: "Przepływ" },
  { id: "dissolve", label: "Rozpad" },
  { id: "scan", label: "Skaner" },
]

export const TRIGGERS: readonly { id: Trigger; label: string }[] = [
  { id: "continuous", label: "Ciągły" },
  { id: "scroll", label: "Przewijanie" },
  { id: "hover", label: "Najechanie" },
  { id: "click", label: "Klik" },
]

export const TONES: readonly { id: Tone; label: string }[] = [
  { id: "ink", label: "Atrament" },
  { id: "inverse", label: "Odwrócony" },
  { id: "matrix", label: "Matrix" },
]

export const RENDERS: readonly { id: Render; label: string }[] = [
  { id: "tone", label: "Tonalny" },
  { id: "contour", label: "Konturowy" },
  { id: "mixed", label: "Mieszany" },
]

export const CURSORS: readonly { id: Cursor; label: string }[] = [
  { id: "loupe", label: "Lupa" },
  { id: "reveal", label: "Odsłona" },
  { id: "scramble", label: "Szum" },
]

export const RESTS: readonly { id: Rest; label: string }[] = [
  { id: "veil", label: "Obraz" },
  { id: "code", label: "Kod" },
]

export const FPS: readonly Fps[] = [8, 12, 24, 60]
export const DECODES: readonly Decode[] = [400, 800, 1600, 3000]
export const CELLS: readonly Cell[] = [6, 8, 10, 14]

/* ——— Presety ——— */

const base: Variant = {
  charset: "ascii",
  mode: "wave",
  fps: 24,
  decode: 800,
  cell: 8,
  tone: "ink",
  trigger: "continuous",
  render: "tone",
  cursor: "loupe",
  rest: "veil",
}

export type LabState = Record<SectionId, Variant>

/** „Pole minowe”: każda sekcja inna — domyślny układ do porównań. */
const minefield: LabState = {
  hero: { ...base, charset: "braille", mode: "scan", fps: 12, decode: 1600, cell: 6 },
  bio: { ...base, charset: "binary", mode: "wave", fps: 12, decode: 1600, trigger: "scroll" },
  skills: {
    ...base,
    charset: "ascii",
    mode: "scan",
    fps: 12,
    decode: 1600,
    cell: 6,
    trigger: "continuous",
  },
  works: {
    ...base,
    charset: "dots",
    mode: "wave",
    fps: 24,
    decode: 800,
    cell: 6,
    trigger: "hover",
  },
  cta: { ...base, charset: "kana", mode: "rain", fps: 24, cell: 10, tone: "inverse" },
  blog: {
    ...base,
    charset: "blocks",
    mode: "scan",
    fps: 12,
    decode: 800,
    cell: 6,
    trigger: "hover",
  },
  contact: { ...base, charset: "sygnet", mode: "scramble", fps: 12, decode: 800, trigger: "click" },
  footer: {
    ...base,
    charset: "ascii",
    mode: "dissolve",
    fps: 12,
    decode: 1600,
    cell: 8,
    trigger: "scroll",
  },
}

/** Ten sam wariant w każdej sekcji (z wyzwalaczem, który sekcja rozumie). */
function everywhere(patch: Partial<Variant>): LabState {
  const state = {} as LabState
  for (const id of SECTIONS) {
    const own = minefield[id]
    const next = { ...own, ...patch }
    if (!SECTION_META[id].triggers.includes(next.trigger)) next.trigger = own.trigger
    const modes = SECTION_META[id].modes
    if (modes && !modes.includes(next.mode)) next.mode = own.mode
    state[id] = next
  }
  return state
}

export const PRESETS: readonly { id: string; label: string; state: LabState }[] = [
  { id: "minefield", label: "Pole minowe", state: minefield },
  {
    id: "matrix",
    label: "Matrix",
    state: everywhere({ charset: "kana", mode: "rain", fps: 24, tone: "matrix" }),
  },
  { id: "binary", label: "Binarny", state: everywhere({ charset: "binary", fps: 12 }) },
  {
    id: "ink",
    label: "Atrament",
    state: everywhere({ charset: "ascii", mode: "wave", fps: 8, decode: 1600, tone: "ink" }),
  },
  {
    id: "braille",
    label: "Braille",
    state: everywhere({ charset: "braille", mode: "flow", fps: 60, cell: 6 }),
  },
  {
    id: "sygnet",
    label: "Sygnet",
    state: everywhere({ charset: "sygnet", mode: "scramble", fps: 12 }),
  },
  {
    id: "calm",
    label: "Spokój",
    state: everywhere({ mode: "dissolve", fps: 8, decode: 3000, tone: "ink" }),
  },
]

export const DEFAULT_STATE = minefield

/* ——— Podpis wariantu: „A · skaner · ASCII · 24 kl./s · ciągły + kursor” ——— */

function label<T extends string>(list: readonly { id: T; label: string }[], id: T) {
  return list.find((item) => item.id === id)?.label ?? id
}

export function triggerLabel(section: SectionId, trigger: Trigger): string {
  const text = label(TRIGGERS, trigger).toLowerCase()
  if (section === "hero" || section === "cta") {
    return trigger === "continuous" ? `${text} + kursor` : text
  }
  if (section === "works" || section === "blog") {
    return trigger === "hover" ? `${text} (dotyk: kadr)` : text
  }
  return text
}

export function describe(section: SectionId, variant: Variant): string[] {
  const meta = SECTION_META[section]
  const parts = [label(MODES, variant.mode).toLowerCase(), label(CHARSETS, variant.charset)]
  if (section === "hero") parts.unshift(`portret ${label(RENDERS, variant.render).toLowerCase()}`)
  if (section === "skills") parts.unshift("bryły 3D")
  if (section === "works") parts.unshift(variant.rest === "veil" ? "obraz z glifami" : "kod")
  if (meta.params.includes("fps")) parts.push(`${variant.fps} kl./s`)
  parts.push(triggerLabel(section, variant.trigger))
  return parts
}

/** Porównanie przy wczytywaniu z localStorage: odrzucamy wartości spoza słownika. */
export function sanitize(input: unknown): LabState | null {
  if (!input || typeof input !== "object") return null
  const source = input as Record<string, Partial<Variant>>
  const state = {} as LabState
  for (const id of SECTIONS) {
    const own = source[id]
    const fallback = DEFAULT_STATE[id]
    const pick = <K extends Param>(key: K, allowed: readonly Variant[K][]): Variant[K] =>
      own && allowed.includes(own[key] as Variant[K]) ? (own[key] as Variant[K]) : fallback[key]
    state[id] = {
      charset: pick(
        "charset",
        CHARSETS.map((item) => item.id)
      ),
      mode: pick("mode", SECTION_META[id].modes ?? MODES.map((item) => item.id)),
      fps: pick("fps", FPS),
      decode: pick("decode", DECODES),
      cell: pick("cell", CELLS),
      tone: pick(
        "tone",
        TONES.map((item) => item.id)
      ),
      trigger: pick("trigger", SECTION_META[id].triggers),
      render: pick(
        "render",
        RENDERS.map((item) => item.id)
      ),
      cursor: pick(
        "cursor",
        CURSORS.map((item) => item.id)
      ),
      rest: pick(
        "rest",
        RESTS.map((item) => item.id)
      ),
    }
  }
  return state
}

export function sameState(a: LabState, b: LabState): boolean {
  return SECTIONS.every((id) =>
    (Object.keys(a[id]) as Param[]).every((key) => a[id][key] === b[id][key])
  )
}
