"use client"

import { CHARSETS, GLYPH_DEFAULTS, glyphFontVariables } from "@/components/demo/shared/glyph"
import { cn } from "@/components/demo/forma/cn"
import { setCharset, useCharset, useRestoreCharset } from "./glyph-store"

const IDS = CHARSETS.map((entry) => entry.id)

/**
 * „Pobaw się”: zestawy znaków jako pigułki z nazwą i próbką (równa wysokość,
 * próbka w stałym pudełku 1 em). Wybór zmienia język znaków całej strony —
 * twarz, kafle realizacji, figury, soczewkę i napis w stopce. Radiogrupa:
 * strzałki, Tab, etykiety dla czytnika.
 */
export function GlyphChooser({ label, className }: { label: string; className?: string }) {
  useRestoreCharset(IDS)
  // Bez wyboru zaznaczony jest zestaw twarzy (domyślny silnika).
  const current = useCharset() ?? GLYPH_DEFAULTS.charset
  return (
    <fieldset className={cn(glyphFontVariables, "flex flex-col gap-2.5", className)}>
      <legend className="mb-2.5 text-fm-micro font-medium text-fm-ink-3">{label}</legend>
      <span className="flex flex-wrap gap-1.5">
        {CHARSETS.map((entry) => (
          <label
            key={entry.id}
            className="relative inline-flex h-8 cursor-pointer items-center gap-2 rounded-full bg-fm-fill ps-2.5 pe-3 text-fm-micro font-medium text-fm-ink-2 transition-[background-color,color,scale] duration-150 ease-fm-snap select-none after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-[''] hover:bg-fm-fill-strong hover:text-fm-ink active:scale-[0.97] has-[:checked]:bg-fm-ink has-[:checked]:text-fm-inverse has-[:checked]:hover:bg-fm-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fm-ink"
          >
            <input
              type="radio"
              name="i2-charset"
              value={entry.id}
              checked={current === entry.id}
              onChange={() => setCharset(entry.id)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className="grid size-4 place-items-center overflow-hidden [font-family:var(--gx-font-mono),var(--gx-font-symbols),monospace] text-[0.8125rem] leading-none"
            >
              {Array.from(entry.sample)[0]}
            </span>
            {entry.label}
          </label>
        ))}
      </span>
    </fieldset>
  )
}
