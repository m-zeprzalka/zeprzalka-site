"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { RadioGroup } from "radix-ui"
import { ChevronDown, FlaskConical, Minus, RotateCcw } from "lucide-react"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { CHARSET_SPECS, FONT_VAR } from "../engine/charsets"
import {
  CELLS,
  CHARSETS,
  CURSORS,
  DECODES,
  FPS,
  MODES,
  PRESETS,
  RENDERS,
  RESTS,
  SECTIONS,
  SECTION_META,
  TONES,
  TRIGGERS,
  type Param,
  type SectionId,
  type Variant,
} from "./config"
import {
  accepts,
  applyPreset,
  currentPreset,
  exportLab,
  hydrateLab,
  resetLab,
  setLabOpen,
  setParam,
  setTarget,
  useLab,
  type Target,
} from "./store"

/** Napisy panelu (nowe napisy interfejsu — wypisane w raporcie). */
const T = {
  title: "Laboratorium",
  open: "Otwórz laboratorium efektu",
  collapse: "Zwiń laboratorium",
  preset: "Preset",
  custom: "własne",
  scope: "Zakres",
  all: "Cała strona",
  mixed: "różne",
  copy: "Kopiuj ustawienia",
  copied: "Skopiowano JSON",
  reset: "Przywróć pole minowe",
  hint: "Każda sekcja ma swój wariant (A–H). Zmiana przy „Cała strona” ustawia wszystkie naraz.",
  groups: {
    charset: "Znaki",
    render: "Portret",
    cursor: "Kursor nad portretem",
    mode: "Animacja",
    fps: "Tempo glifów",
    decode: "Czas dekodowania",
    cell: "Komórka",
    tone: "Kolor",
    trigger: "Wyzwalacz",
    rest: "Spoczynek",
  } satisfies Record<Param, string>,
}

const ORDER: readonly Param[] = [
  "rest",
  "charset",
  "mode",
  "fps",
  "decode",
  "cell",
  "tone",
  "trigger",
  "render",
  "cursor",
]

/** Wartość parametru w zakresie: jedna (wspólna) albo `null`, gdy sekcje się różnią. */
function valueOf<K extends Param>(state: Record<SectionId, Variant>, target: Target, key: K) {
  const ids =
    target === "all" ? SECTIONS.filter((id) => SECTION_META[id].params.includes(key)) : [target]
  const values = new Set(ids.map((id) => state[id][key]))
  return values.size === 1 ? ([...values][0] as Variant[K]) : null
}

function options(
  key: Param,
  target: Target
): { id: string; label: string; sample?: string; font?: string }[] {
  const allowed = <T extends string | number>(list: readonly T[]) =>
    target === "all" ? list : list.filter((value) => accepts(target, key, value as never))
  switch (key) {
    case "charset":
      return CHARSETS.map((item) => ({
        id: item.id,
        label: item.label,
        sample: item.sample,
        font: FONT_VAR[CHARSET_SPECS[item.id].font],
      }))
    case "mode":
      return MODES.filter((item) => allowed([item.id]).length).map((item) => ({
        id: item.id,
        label: item.label,
      }))
    case "trigger":
      return TRIGGERS.filter((item) => allowed([item.id]).length).map((item) => ({
        id: item.id,
        label: item.label,
      }))
    case "tone":
      return TONES.map((item) => ({ id: item.id, label: item.label }))
    case "render":
      return RENDERS.map((item) => ({ id: item.id, label: item.label }))
    case "cursor":
      return CURSORS.map((item) => ({ id: item.id, label: item.label }))
    case "rest":
      return RESTS.map((item) => ({ id: item.id, label: item.label }))
    case "fps":
      return FPS.map((value) => ({ id: String(value), label: String(value) }))
    case "decode":
      return DECODES.map((value) => ({
        id: String(value),
        label: `${String(value / 1000).replace(".", ",")} s`,
      }))
    case "cell":
      return CELLS.map((value) => ({ id: String(value), label: `${value} px` }))
  }
}

function Group({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <p className="flex items-baseline justify-between text-fm-micro text-fm-ink-3">
        <span className="font-medium text-fm-ink-2">{label}</span>
        {note && <span>{note}</span>}
      </p>
      {children}
    </div>
  )
}

/**
 * Laboratorium: pływający inspektor (jak panel właściwości w narzędziu
 * projektowym). Zakres — cała strona albo jedna sekcja; zmiany działają na
 * żywo, zapisują się w przeglądarce i dają się skopiować jako JSON. Zwinięte
 * do pigułki; klawisz L przełącza, Escape zwija (fokus wraca do pigułki).
 * Bez okna modalnego — strona pod spodem dalej się przewija.
 */
export function LabPanel() {
  const { state, target, open } = useLab()
  const pillRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const wasOpen = useRef(false)
  const preset = currentPreset(state)

  useEffect(() => hydrateLab(), [])

  // Telefon: pigułka chowa się przy przewijaniu w dół (nie zasłania CTA), wraca w górę.
  useEffect(() => {
    const pill = pillRef.current
    if (!pill) return
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const dy = y - lastY
      if (Math.abs(dy) < 6) return
      if (dy > 0 && y > 240) pill.dataset.tucked = ""
      else delete pill.dataset.tucked
      lastY = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Fokus: do panelu po otwarciu, do pigułki po zamknięciu (tylko gdy był w panelu).
  useEffect(() => {
    if (open && !wasOpen.current) panelRef.current?.focus({ preventScroll: true })
    if (!open && wasOpen.current && panelRef.current?.contains(document.activeElement)) {
      pillRef.current?.focus({ preventScroll: true })
    }
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement | null
      const typing = element?.closest("input, textarea, select, [contenteditable]")
      if (event.key === "Escape" && open && panelRef.current?.contains(element)) {
        setLabOpen(false)
        return
      }
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === "l" || event.key === "L") setLabOpen(!open)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const params = ORDER.filter((key) =>
    target === "all"
      ? SECTIONS.some((id) => SECTION_META[id].params.includes(key))
      : SECTION_META[target].params.includes(key)
  )

  const scrollTo = (next: Target) => {
    setTarget(next)
    if (next === "all") return
    const anchor = document.querySelector(`[data-gll-section="${next}"]`)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    anchor?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  }

  return (
    <div className="gll-lab-root">
      <button
        ref={pillRef}
        type="button"
        onClick={() => setLabOpen(true)}
        aria-expanded={open}
        aria-controls="gll-lab"
        aria-keyshortcuts="L"
        aria-label={`${T.open} (L)`}
        data-hidden={open || undefined}
        className="gll-lab-pill fm-focus"
      >
        <FlaskConical aria-hidden="true" className="size-4" />
        <span className="font-medium text-fm-ink">{T.title}</span>
        <span className="hidden text-fm-ink-3 min-[380px]:inline">{preset?.label ?? T.custom}</span>
        <kbd className="hidden rounded-fm-xs bg-fm-fill px-1.5 font-sans text-[0.6875rem] text-fm-ink-3 pointer-fine:inline">
          L
        </kbd>
      </button>

      <div
        aria-hidden="true"
        data-open={open || undefined}
        onClick={() => setLabOpen(false)}
        className="gll-lab-scrim"
      />
      <section
        ref={panelRef}
        id="gll-lab"
        tabIndex={-1}
        aria-label={T.title}
        data-open={open || undefined}
        inert={!open}
        className="gll-lab outline-none"
      >
        <header className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
          <p className="inline-flex items-center gap-2 text-fm-small font-medium">
            <FlaskConical aria-hidden="true" className="size-4 text-fm-ink-3" />
            {T.title}
          </p>
          <button
            type="button"
            onClick={() => setLabOpen(false)}
            aria-label={T.collapse}
            className="-me-1.5 grid size-11 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-colors hover:bg-fm-fill hover:text-fm-ink"
          >
            <Minus aria-hidden="true" className="size-4" />
          </button>
        </header>

        <div className="gll-lab__body grid gap-5 px-4 pb-4">
          <Group label={T.preset} note={preset ? undefined : T.custom}>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => applyPreset(item.id)}
                  aria-pressed={preset?.id === item.id}
                  className="gll-chip fm-focus"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Group>

          <Group label={T.scope}>
            <div className="relative">
              <select
                value={target}
                onChange={(event) => scrollTo(event.target.value as Target)}
                className="gll-select fm-focus"
              >
                <option value="all">{T.all}</option>
                {SECTIONS.map((id) => (
                  <option key={id} value={id}>
                    {SECTION_META[id].letter} · {SECTION_META[id].name}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-fm-ink-3"
              />
            </div>
            {target === "all" && (
              <p className="text-fm-micro text-pretty text-fm-ink-3">{T.hint}</p>
            )}
          </Group>

          {params.map((key) => {
            const current = valueOf(state, target, key)
            const list = options(key, target)
            const columns = key === "charset" ? 4 : key === "mode" ? 3 : list.length
            return (
              <Group key={key} label={T.groups[key]} note={current === null ? T.mixed : undefined}>
                <RadioGroup.Root
                  value={current === null ? "" : String(current)}
                  onValueChange={(value) => {
                    const numeric = key === "fps" || key === "decode" || key === "cell"
                    setParam(target, key, (numeric ? Number(value) : value) as Variant[typeof key])
                  }}
                  aria-label={T.groups[key]}
                  className="gll-seg"
                  style={{ "--gll-cols": columns } as CSSProperties}
                >
                  {list.map((item) => (
                    <RadioGroup.Item
                      key={item.id}
                      value={item.id}
                      className="gll-seg__item fm-focus"
                    >
                      {item.sample && (
                        <span
                          aria-hidden="true"
                          className="gll-seg__sample"
                          style={{ fontFamily: item.font }}
                        >
                          {item.sample}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </RadioGroup.Item>
                  ))}
                </RadioGroup.Root>
              </Group>
            )
          })}
        </div>

        <footer className="flex items-center gap-2 border-t border-fm-edge px-4 py-3">
          <CopyButton
            value={exportLab(state)}
            label={T.copy}
            copiedLabel={T.copied}
            className="h-10 flex-1 justify-center"
          />
          <button
            type="button"
            onClick={resetLab}
            aria-label={T.reset}
            title={T.reset}
            className="grid size-10 fm-press place-items-center rounded-full text-fm-ink-2 shadow-fm-ring fm-focus transition-colors hover:bg-fm-fill hover:text-fm-ink"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
          </button>
        </footer>
      </section>
    </div>
  )
}
