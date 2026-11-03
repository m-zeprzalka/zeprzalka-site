"use client"

import { Pause, Play } from "lucide-react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { cn } from "@/lib/utils"
import { useTalia } from "./TaliaProvider"

/**
 * Pauza dla pętli, które startują same (stos na telefonie, dialog) —
 * WCAG 2.2.2. Jedno ustawienie na całą stronę. Stała etykieta i
 * `aria-pressed` zamiast podmiany napisu. Przy „ogranicz ruch” wideo i tak
 * nie gra, więc przycisku nie ma.
 */
export function PauseToggle({ label, className }: { label: string; className?: string }) {
  const { paused, togglePaused } = useTalia()
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-label={label}
      title={label}
      onClick={togglePaused}
      className={cn(
        "fm-focus fm-press grid size-11 place-items-center rounded-full transition-[background-color,scale] [&_svg]:size-4",
        className
      )}
    >
      {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
    </button>
  )
}
