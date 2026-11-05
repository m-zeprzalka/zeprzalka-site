"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Check, RotateCcw } from "lucide-react"
import { cn } from "../../forma/cn"
import { useInView, useReducedMotion } from "../../forma/use-in-view"

export interface BuildLine {
  text: string
  detail?: string
  kind: "command" | "step" | "route" | "done"
}

const STEP_MS = 220
const noop = () => () => {}

/**
 * Development: log budowania tego serwisu — same komendy i wyniki, bez
 * „wyskakującej strony” (uwaga do Esencji). Wiersze pojawiają się jak
 * w terminalu, gdy kafel wejdzie w kadr przy przewijaniu; liczby (realizacje,
 * wpisy) liczy serwer z prawdziwej treści. HTML z serwera i „ogranicz ruch”
 * mają cały log od razu.
 */
export function Terminal({ lines, replayLabel }: { lines: BuildLine[]; replayLabel: string }) {
  const [ref, inView] = useInView<HTMLDivElement>("0px 0px -25% 0px")
  const reduced = useReducedMotion()
  const [run, setRun] = useState(0)
  const [shown, setShown] = useState(0)
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
      className="flex h-full flex-col bg-[oklch(0.17_0_0)] font-mono text-[0.75rem] leading-6 text-[oklch(0.86_0_0)] md:text-[0.8125rem] dark:bg-[oklch(0.11_0_0)]"
    >
      <div className="flex items-center justify-between border-b border-white/8 py-1.5 ps-4 pe-2">
        <span className="text-white/45">zeprzalka.com — main</span>
        <button
          type="button"
          onClick={() => {
            setShown(0)
            setRun((value) => value + 1)
          }}
          data-rg-quiet=""
          className="flex h-11 items-center gap-1.5 rounded-full px-3 font-sans text-[0.75rem] font-medium text-white/65 fm-focus transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-white"
        >
          <RotateCcw aria-hidden="true" className="size-3.5" /> {replayLabel}
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
                "flex items-center gap-2.5 transition-[opacity,translate,filter] duration-300 ease-fm-snap",
                visible ? "blur-0 translate-y-0 opacity-100" : "translate-y-1 opacity-0 blur-[2px]"
              )}
            >
              <Marker kind={line.kind} pending={current} />
              <span className={cn("min-w-0 truncate", line.kind === "command" && "text-white")}>
                {line.text}
              </span>
              {line.detail && (
                <span className="ms-auto shrink-0 ps-3 text-white/45 tabular-nums">
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
  if (kind === "route") return <span className="w-3.5 text-center text-white/40">·</span>
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
