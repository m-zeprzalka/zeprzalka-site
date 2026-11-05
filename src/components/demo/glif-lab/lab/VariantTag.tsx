"use client"

import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { SECTION_META, describe, type SectionId } from "./config"
import { setLabOpen, useLab } from "./store"

/**
 * Podpis wariantu sekcji („A · skaner · ASCII · 24 kl./s · ciągły + kursor”).
 * Litera jest identyfikatorem do rozmowy o wyborze; kliknięcie otwiera
 * laboratorium ustawione na tę sekcję. Opis zmienia się na żywo.
 */
export function VariantTag({ section, className }: { section: SectionId; className?: string }) {
  const { state, open, target } = useLab()
  const meta = SECTION_META[section]
  const parts = describe(section, state[section])
  const active = open && target === section

  return (
    <button
      type="button"
      onClick={() => setLabOpen(!active, section)}
      aria-pressed={active}
      aria-label={`Wariant ${meta.letter} (${meta.name}): ${parts.join(", ")}. Dostosuj w laboratorium`}
      className={cn(
        "group/tag inline-flex min-h-8 max-w-full items-center gap-2 rounded-[1rem] py-1 ps-1 pe-3 text-start text-fm-micro text-fm-ink-3 fm-focus pointer-coarse:min-h-11",
        "transition-[background-color,color,box-shadow] duration-150 hover:bg-fm-fill hover:text-fm-ink-2",
        active && "bg-fm-fill text-fm-ink-2 shadow-fm-ring",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full bg-fm-fill text-[0.6875rem] font-medium text-fm-ink-2 tabular-nums transition-colors duration-150 group-hover/tag:bg-fm-surface",
          active && "bg-fm-ink text-fm-inverse group-hover/tag:bg-fm-ink"
        )}
      >
        {meta.letter}
      </span>
      <span aria-hidden="true" className="text-pretty">
        {parts.join(" · ")}
      </span>
      <SlidersHorizontal
        aria-hidden="true"
        className="size-3.5 shrink-0 opacity-0 transition-opacity duration-150 group-hover/tag:opacity-100 group-focus-visible/tag:opacity-100 pointer-coarse:opacity-60"
      />
    </button>
  )
}
