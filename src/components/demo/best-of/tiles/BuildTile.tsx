"use client"

import { useEffect, useState } from "react"
import { Check, RotateCcw } from "lucide-react"
import { cn } from "../../forma/cn"
import { useStage } from "../use-stage"

export interface BuildLine {
  /** Kolumna lewa (polecenie, krok, trasa) i prawa (wynik, liczba). */
  text: string
  detail?: string
  kind: "command" | "step" | "route" | "done"
}

/** Odstęp między wierszami — całość trwa około 2 s. */
const STEP_MS = 230

/**
 * Development (wzór: `zywy-interfejs/tiles/BuildTile.tsx` — „wcześniejszy
 * prostszy z samymi komendami fajniejszy”): log builda tego serwisu. Wiersze
 * pojawiają się jak w terminalu, gdy kafel wejdzie w kadr; krok w toku ma
 * wskaźnik, skończony — ptaszek. Liczby (realizacje, wpisy) i wersje liczy
 * serwer z prawdziwej treści. HTML z serwera i „ogranicz ruch” — pełny log.
 */
export function BuildTile({ lines, replayLabel }: { lines: BuildLine[]; replayLabel: string }) {
  const { ref, run, replay, idle, reduced } = useStage<HTMLDivElement>()
  const [shown, setShown] = useState<{ run: number; count: number }>({
    run: 0,
    count: lines.length,
  })
  // Przed startem przebiegu (i zanim ruszy jego zegar) log jest pusty.
  const count = idle || run > shown.run ? 0 : reduced ? lines.length : shown.count

  useEffect(() => {
    if (run === 0) return
    let index = 0
    const timer = setInterval(() => {
      index += 1
      setShown({ run, count: index })
      if (index >= lines.length) clearInterval(timer)
    }, STEP_MS)
    return () => clearInterval(timer)
  }, [run, lines.length])

  return (
    // Obserwator kadru patrzy na opakowanie bez przycięcia (`clip-path` celu zmniejsza
    // jego przecięcie z ekranem — zamknięty terminal nigdy by nie ruszył).
    <div ref={ref} className="flex flex-1 flex-col p-2">
      {/* Ciemny terminal nie przenika (półprzezroczysta czerń z rozmyciem wejścia kafla czytała
          się jak szara płyta): stoi zamknięty do startu sceny, potem otwiera się od góry jak okno. */}
      <div
        className={cn(
          "bo-term flex flex-1 flex-col overflow-hidden rounded-[1.125rem] bg-[oklch(0.17_0_0)] font-mono text-[0.75rem] leading-6 text-[oklch(0.86_0_0)] md:text-[0.8125rem] dark:bg-[oklch(0.11_0_0)] dark:shadow-[inset_0_0_0_1px_oklch(1_0_0/0.06)]",
          idle && "bo-term--closed"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/8 py-0.5 ps-4 pe-1">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </span>
          <button
            type="button"
            onClick={replay}
            className="relative flex h-11 items-center gap-1.5 rounded-full px-3 font-sans text-[0.75rem] font-medium text-white/65 fm-focus transition-colors after:absolute after:-inset-1 after:content-[''] hover:bg-white/8 hover:text-white focus-visible:outline-white"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" /> {replayLabel}
          </button>
        </div>
        <ol className="flex-1 space-y-0.5 overflow-hidden px-4 py-4">
          {lines.map((line, index) => {
            const visible = index < count
            const current = index === count - 1 && count < lines.length
            return (
              <li
                key={`${run}-${index}`}
                className={cn(
                  "flex items-center gap-2.5 transition-[opacity,translate] duration-300 ease-fm-snap",
                  visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                )}
              >
                <Marker kind={line.kind} pending={current} />
                <span className={cn("min-w-0 truncate", line.kind === "command" && "text-white")}>
                  {line.text}
                </span>
                {line.detail && (
                  <span className="ms-auto shrink-0 ps-3 text-white/50 tabular-nums">
                    {line.detail}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function Marker({ kind, pending }: { kind: BuildLine["kind"]; pending: boolean }) {
  if (kind === "command") return <span className="w-3.5 text-white/45">$</span>
  if (kind === "route") return <span className="w-3.5 text-center text-white/45">○</span>
  if (pending)
    return (
      <span
        aria-hidden="true"
        className="size-3.5 animate-spin rounded-full border-[1.5px] border-white/20 border-t-white/80"
      />
    )
  return (
    <Check
      aria-hidden="true"
      className={cn("size-3.5", kind === "done" ? "text-[oklch(0.8_0.15_150)]" : "text-white/70")}
    />
  )
}
