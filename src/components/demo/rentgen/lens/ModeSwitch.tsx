"use client"

import { useSyncExternalStore, type MouseEvent } from "react"
import { cn } from "../../forma/cn"
import { modeStore, requestMode, type Mode } from "./store"

/**
 * Przełącznik „Projekt / Kod” — cała strona w jednej z dwóch warstw. Drugie
 * słowo jest w kroju mono: przełącznik sam pokazuje, o co chodzi. Zmiana
 * rozchodzi się kołem od przycisku (silnik soczewki); bez silnika — od razu.
 * Semantyka: grupa dwóch przycisków z `aria-pressed`.
 */
export function ModeSwitch({
  labels,
  className,
}: {
  labels: { group: string; design: string; code: string }
  className?: string
}) {
  const mode = useSyncExternalStore(modeStore.subscribe, modeStore.get, modeStore.getServer)

  function choose(next: Mode, event: MouseEvent<HTMLButtonElement>) {
    if (next === mode) return
    const rect = event.currentTarget.getBoundingClientRect()
    requestMode(
      next,
      rect.left + rect.width / 2 + window.scrollX,
      rect.top + rect.height / 2 + window.scrollY
    )
  }

  return (
    <div
      role="group"
      aria-label={labels.group}
      data-mode={mode}
      data-rg-key="mode-switch"
      data-rg-name="ModeSwitch"
      className={cn("rg-switch", className)}
    >
      <span aria-hidden="true" className="rg-switch__thumb" />
      <button
        type="button"
        aria-pressed={mode === "design"}
        onClick={(event) => choose("design", event)}
        className="rg-switch__option fm-focus"
      >
        {labels.design}
      </button>
      <button
        type="button"
        aria-pressed={mode === "code"}
        onClick={(event) => choose("code", event)}
        className="rg-switch__option rg-switch__option--code fm-focus"
      >
        {labels.code}
      </button>
    </div>
  )
}
