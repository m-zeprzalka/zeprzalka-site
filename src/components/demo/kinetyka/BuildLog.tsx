"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Check, RotateCcw } from "lucide-react"
import { cn } from "../forma/cn"
import { useInView, useReducedMotion } from "../forma/use-in-view"

export interface LogLine {
  text: string
  detail?: string
  kind: "command" | "step" | "route" | "done"
}

const STEP_MS = 240
const noop = () => () => {}

/**
 * Development: sam log komend builda tej strony (wersja, którą właściciel
 * wolał od „wyskakującej strony”). Wiersze wchodzą jak w terminalu, gdy
 * panel wejdzie w kadr; liczby (strony, realizacje, wpisy) liczy serwer
 * z prawdziwej treści. HTML z serwera i „ogranicz ruch” — cały log od razu.
 */
export function BuildLog({ lines, replay }: { lines: LogLine[]; replay: string }) {
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
      className="kn-panel flex min-h-80 flex-col overflow-hidden rounded-fm-3xl bg-[oklch(0.13_0_0)] font-mono text-[0.8125rem] leading-6 text-[oklch(0.86_0_0)] dark:bg-[oklch(0.1_0_0)] dark:shadow-[inset_0_0_0_1px_oklch(1_0_0/0.1)]"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-2">
        <span className="font-sans text-fm-micro text-white/55">zeprzalka.com</span>
        <button
          type="button"
          onClick={() => {
            setShown(0)
            setRun((value) => value + 1)
          }}
          className="-mr-2 inline-flex h-11 items-center gap-1.5 rounded-full px-3 font-sans text-fm-micro font-medium text-white/70 fm-focus transition-colors hover:bg-white/10 hover:text-white"
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          {replay}
        </button>
      </div>
      <ol className="flex-1 space-y-1 px-5 py-5" aria-live="off">
        {lines.map((line, index) => {
          const visible = index < count
          const current = index === count - 1 && count < lines.length
          return (
            <li
              key={`${run}-${index}`}
              className={cn(
                "flex items-center gap-3 transition-[opacity,translate,filter] duration-300 ease-fm-snap",
                visible
                  ? "translate-y-0 opacity-100 blur-none"
                  : "translate-y-1 opacity-0 blur-[2px]"
              )}
            >
              <Marker kind={line.kind} pending={current} />
              <span className={cn("min-w-0 truncate", line.kind === "command" && "text-white")}>
                {line.text}
              </span>
              {line.detail && (
                <span className="ml-auto shrink-0 ps-3 text-white/50 tabular-nums">
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

function Marker({ kind, pending }: { kind: LogLine["kind"]; pending: boolean }) {
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
