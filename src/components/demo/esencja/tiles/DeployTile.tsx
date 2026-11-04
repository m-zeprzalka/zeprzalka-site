"use client"

import { useEffect, useState } from "react"
import { Check, Lock, RotateCcw } from "lucide-react"
import { cn } from "../../forma/cn"
import { replayButton } from "../Tile"
import { useStage, useTimers } from "../use-stage"

export interface DeployLine {
  kind: "command" | "info" | "step" | "route" | "done"
  text: string
  detail?: string
}

const STEP_MS = 260

/**
 * Development: wdrożenie tego serwisu. Log builda wpisuje się wiersz po
 * wierszu (wersje i liczby z prawdziwej treści i package.json), status
 * przechodzi z „Budowanie” w „Gotowe”, a od dołu wjeżdża podgląd gotowej
 * strony — ta sama strona, którą właśnie oglądasz, w miniaturze.
 */
export function DeployTile({
  lines,
  preview,
  labels,
}: {
  lines: readonly DeployLine[]
  preview: { domain: string; status: string; title: string; cta: string }
  labels: { building: string; ready: string; replay: string; branch: string }
}) {
  const { ref, run, replay, idle } = useStage<HTMLDivElement>()
  const { after, clear } = useTimers()
  // Postęp jest przypisany do przebiegu: nowy przebieg, zanim ruszą timery, to czysta scena.
  const [progress, setProgress] = useState({ run: 0, shown: lines.length, live: true })
  const current = progress.run === run ? progress : { run, shown: 0, live: false }
  const count = idle ? 0 : current.shown
  const ready = !idle && current.live

  useEffect(() => {
    if (run === 0) return
    lines.forEach((_, index) =>
      after(220 + index * STEP_MS, () => setProgress({ run, shown: index + 1, live: false }))
    )
    after(220 + lines.length * STEP_MS + 260, () =>
      setProgress({ run, shown: lines.length, live: true })
    )
    return clear
  }, [run, lines, after, clear])

  return (
    <div ref={ref} className="relative flex flex-1 flex-col p-2">
      <button type="button" onClick={replay} aria-label={labels.replay} className={replayButton}>
        <RotateCcw className="size-4" />
      </button>

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[1.125rem] bg-fm-surface shadow-fm-ring">
        {/* Nagłówek wdrożenia: domena, gałąź, status */}
        <div className="flex items-center gap-3 border-b border-fm-edge px-4 py-3 pe-14">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-fm-ink text-fm-inverse">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3 fill-current">
              <path d="M12 3l10 18H2z" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.8125rem] font-medium tracking-[-0.01em]">
              {preview.domain}
            </p>
            <p className="truncate font-mono text-[0.75rem] text-fm-ink-3">{labels.branch}</p>
          </div>
          <span
            className={cn(
              "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[0.75rem] font-medium transition-colors duration-300",
              ready ? "bg-fm-live/12 text-fm-ink" : "bg-fm-fill text-fm-ink-2"
            )}
            role="status"
          >
            {ready ? (
              <span aria-hidden="true" className="size-1.5 rounded-full bg-fm-live" />
            ) : (
              <span
                aria-hidden="true"
                className="size-2.5 animate-spin rounded-full border-[1.5px] border-fm-ink-3/30 border-t-fm-ink-2"
              />
            )}
            {ready ? labels.ready : labels.building}
          </span>
        </div>

        {/* Log */}
        <ol className="flex-1 space-y-1 px-4 py-3.5 font-mono text-[0.75rem] leading-5 text-fm-ink-2">
          {lines.map((line, index) => {
            const visible = index < count
            const current = index === count - 1 && !ready && line.kind !== "command"
            return (
              <li
                key={`${run}-${index}`}
                className={cn(
                  "flex items-center gap-2.5 transition-[opacity,translate,filter] duration-300 ease-fm-snap",
                  visible
                    ? "translate-y-0 opacity-100 blur-none"
                    : "translate-y-1 opacity-0 blur-[2px]"
                )}
              >
                <Marker kind={line.kind} pending={current} />
                <span className={cn("min-w-0 truncate", line.kind === "command" && "text-fm-ink")}>
                  {line.text}
                </span>
                {line.detail && (
                  <span className="ml-auto shrink-0 ps-3 text-fm-ink-3 tabular-nums">
                    {line.detail}
                  </span>
                )}
              </li>
            )
          })}
        </ol>

        {/* Podgląd gotowej strony wjeżdża od dołu po zakończeniu builda */}
        <div
          aria-hidden="true"
          className={cn(
            // Szeroki ekran: podgląd wjeżdża na log od dołu. Węższe: stoi pod logiem
            // (miejsce zarezerwowane od początku), żeby nie zasłaniał całego builda.
            "mx-3 mb-3 rounded-[0.875rem] bg-fm-canvas shadow-fm-float transition-[translate,opacity] duration-500 ease-fm-drawer lg:absolute lg:inset-x-3 lg:bottom-3 lg:mx-0 lg:mb-0",
            ready
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0 lg:translate-y-[calc(100%+1rem)]"
          )}
        >
          <div className="flex items-center gap-2 border-b border-fm-edge px-3 py-2">
            <span className="flex gap-1">
              <span className="size-1.5 rounded-full bg-fm-fill-strong" />
              <span className="size-1.5 rounded-full bg-fm-fill-strong" />
            </span>
            <span className="mx-auto flex h-6 items-center gap-1 rounded-full bg-fm-fill px-2.5 text-[0.75rem] text-fm-ink-2">
              <Lock className="size-3" />
              {preview.domain}
            </span>
          </div>
          <div className="px-4 pt-3 pb-4">
            <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-fm-surface px-2.5 text-[0.75rem] text-fm-ink-2 shadow-fm-ring">
              <span className="size-1.5 rounded-full bg-fm-live" />
              {preview.status}
            </span>
            <p className="mt-2.5 max-w-[16ch] text-[1.25rem] leading-[1.05] font-[550] tracking-[-0.04em]">
              {preview.title}
            </p>
            <span className="mt-3 inline-flex h-7 items-center rounded-full bg-fm-ink px-3 text-[0.75rem] font-medium text-fm-inverse">
              {preview.cta}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Marker({ kind, pending }: { kind: DeployLine["kind"]; pending: boolean }) {
  if (kind === "command") return <span className="w-3 shrink-0 text-fm-ink-3">$</span>
  // Znaki rysowane SVG — trójkąt i kółko spoza ASCII bywają bez glifu w Geist Mono.
  if (kind === "info") {
    return (
      <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 shrink-0 fill-fm-ink">
        <path d="M6 2l4.5 8h-9z" />
      </svg>
    )
  }
  if (kind === "route") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="size-3 shrink-0 fill-none stroke-fm-ink-3"
      >
        <circle cx="6" cy="6" r="3.25" strokeWidth="1.25" />
      </svg>
    )
  }
  if (pending) {
    return (
      <span
        aria-hidden="true"
        className="size-3 shrink-0 animate-spin rounded-full border-[1.5px] border-fm-ink-3/30 border-t-fm-ink-2"
      />
    )
  }
  return (
    <Check
      aria-hidden="true"
      className={cn("size-3 shrink-0", kind === "done" ? "text-fm-live" : "text-fm-ink")}
    />
  )
}
