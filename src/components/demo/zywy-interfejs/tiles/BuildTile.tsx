"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Check, RotateCcw } from "lucide-react"
import { cn } from "../../forma/cn"
import { useInView, useReducedMotion } from "../../forma/use-in-view"

export interface BuildLine {
  /** Kolumna lewa (polecenie, trasa) i prawa (wynik, liczba). */
  text: string
  detail?: string
  kind: "command" | "step" | "route" | "done"
}

/** Odstęp między wierszami — krótki, żeby całość trwała około 2 s. */
const STEP_MS = 230
const noop = () => () => {}

/**
 * Development: log builda tego serwisu. Wiersze pojawiają się jak w
 * terminalu, kroki dostają ptaszek; liczby (wpisy, realizacje, strony)
 * liczy serwer z prawdziwej treści. Przy „ogranicz ruch” cały log od razu.
 */
export function BuildTile({ lines, replayLabel }: { lines: BuildLine[]; replayLabel: string }) {
  const [ref, inView] = useInView<HTMLDivElement>("0px 0px -20% 0px")
  const reduced = useReducedMotion()
  const [run, setRun] = useState(0)
  const [shown, setShown] = useState(0)
  // HTML z serwera (i bez JS) ma pełny log; po hydratacji log czeka na wejście w kadr.
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  const count = !hydrated || reduced ? lines.length : shown

  useEffect(() => {
    if (!inView || reduced) return
    let index = 0
    const timer = setInterval(() => {
      index += 1
      setShown(index)
      if (index >= lines.length) clearInterval(timer)
    }, STEP_MS)
    return () => clearInterval(timer)
  }, [inView, reduced, run, lines.length])

  return (
    <div
      ref={ref}
      className="flex flex-1 flex-col bg-[oklch(0.17_0_0)] font-mono text-[0.75rem] leading-6 text-[oklch(0.86_0_0)] md:text-[0.8125rem] dark:bg-[oklch(0.11_0_0)] dark:shadow-[inset_0_0_0_1px_oklch(1_0_0/0.06)]"
    >
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <button
          type="button"
          onClick={() => {
            setShown(0)
            setRun((value) => value + 1)
          }}
          className="-mr-1.5 flex h-8 items-center gap-1.5 rounded-full px-2.5 font-sans text-[0.6875rem] font-medium text-white/60 fm-focus transition-colors hover:bg-white/8 hover:text-white"
        >
          <RotateCcw className="size-3.5" /> {replayLabel}
        </button>
      </div>
      <ol className="flex-1 space-y-0.5 overflow-hidden px-4 py-4" aria-live="off">
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
                <span className="ml-auto shrink-0 pl-3 text-white/45 tabular-nums">
                  {line.detail}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Marker({ kind, pending }: { kind: BuildLine["kind"]; pending: boolean }) {
  if (kind === "command") return <span className="w-3.5 text-white/40">$</span>
  if (kind === "route") return <span className="w-3.5 text-center text-white/40">○</span>
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
