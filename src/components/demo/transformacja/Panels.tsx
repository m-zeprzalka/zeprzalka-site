import type { CSSProperties } from "react"
import { Check } from "lucide-react"
import { LiveDot } from "@/components/demo/forma/Chip"
import { cn } from "@/components/demo/forma/cn"
import type { CodeLine, LogLine } from "./types"
import { sceneRange } from "./range"

/**
 * Nakładki sceny — ilustracje etapów, więc całe aria-hidden. Treść jest
 * prawdziwa: tokeny systemu „Forma”, kod hero złożony z treści strony
 * i log builda z prawdziwą wersją Next.js. Widać zawsze najwyżej jedną
 * (etap ustawia `StageSync`, przejścia w CSS: wyjście 150 ms, wejście 250 ms).
 */

const TOKEN_ROWS: readonly {
  label: string
  value: string
  swatch?: "ink" | "canvas" | "radius"
}[] = [
  { label: "Krój", value: "Geist" },
  { label: "Nagłówek", value: "76 / 78" },
  { label: "Światło", value: "−0,045 em" },
  { label: "Promień", value: "24", swatch: "radius" },
  { label: "Atrament", value: "ink", swatch: "ink" },
  { label: "Płótno", value: "canvas", swatch: "canvas" },
]

export function TokensPanel() {
  return (
    <div aria-hidden="true" className="tf-panel tf-panel--tokens">
      <div className="overflow-hidden rounded-fm-2xl bg-fm-surface shadow-fm-float">
        <div className="flex items-center justify-between border-b px-3.5 py-2.5 lg:px-4 lg:py-3">
          <span className="text-[0.8125rem] font-semibold tracking-[-0.01em] text-fm-ink">
            Tokeny
          </span>
          <span className="rounded-full bg-fm-fill px-2 py-0.5 text-[0.6875rem] font-medium text-fm-ink-2">
            Forma
          </span>
        </div>
        <dl className="px-3.5 py-1.5 lg:px-4 lg:py-2">
          {TOKEN_ROWS.map((row, index) => (
            <div
              key={row.label}
              className="tf-token flex h-8 items-center justify-between gap-3 text-[0.75rem] lg:h-9 lg:gap-4 lg:text-[0.8125rem]"
              style={{ "--i": index } as CSSProperties}
            >
              <dt className="text-fm-ink-3">{row.label}</dt>
              <dd className="flex items-center gap-2 font-mono text-[0.6875rem] whitespace-nowrap text-fm-ink tabular-nums lg:text-[0.75rem]">
                {row.swatch === "radius" && (
                  <span className="size-3.5 rounded-tl-[6px] border-t-[1.5px] border-l-[1.5px] border-fm-ink" />
                )}
                {row.swatch === "ink" && (
                  <span className="size-3.5 rounded-[4px] bg-fm-ink shadow-fm-ring" />
                )}
                {row.swatch === "canvas" && (
                  <span className="size-3.5 rounded-[4px] bg-fm-canvas shadow-fm-ring" />
                )}
                {row.swatch === "ink" || row.swatch === "canvas" ? (
                  <>
                    <span className="dark:hidden">
                      {row.swatch === "ink" ? "oklch(0.205 0 0)" : "oklch(0.985 0 0)"}
                    </span>
                    <span className="hidden dark:inline">
                      {row.swatch === "ink" ? "oklch(0.975 0 0)" : "oklch(0.145 0 0)"}
                    </span>
                  </>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

const TOKEN_CLASS: Record<CodeLine[number]["kind"], string> = {
  keyword: "text-[var(--tf-code-ink-2)]",
  fn: "text-[var(--tf-code-ink)] font-medium",
  tag: "text-[var(--tf-code-ink)]",
  attr: "text-[var(--tf-code-ink-2)]",
  string: "text-[var(--tf-code-ink-3)]",
  punct: "text-[var(--tf-code-ink-3)]",
  text: "text-[var(--tf-code-ink)]",
}

/** Kod pisze się wiersz po wierszu: 51,5% sceny + 0,6% na wiersz. */
const LINE_START = 51.5
const LINE_STEP = 0.6
const LINE_LENGTH = 1.6
/** Log: wiersz co 1,25% sceny od 62%; „Ready” dostaje zieloną kropkę — produkcja żyje. */
const LOG_START = 62
const LOG_STEP = 1.25

/**
 * Edytor = jedna nakładka: kod u góry, terminal na dole (nic na siebie nie
 * nachodzi). Okna kodu i terminala przewijają się same za wierszem, który
 * właśnie powstaje (przesunięcie listy sterowane sceną).
 */
export function EditorPanel({
  file,
  lines,
  log,
}: {
  file: string
  lines: readonly CodeLine[]
  log: readonly LogLine[]
}) {
  return (
    <div aria-hidden="true" className="tf-panel tf-panel--editor">
      <div className="tf-codebox flex h-full flex-col overflow-hidden rounded-fm-2xl">
        <div className="flex h-9 shrink-0 items-center justify-between border-b border-[var(--tf-code-edge)] px-4">
          <span className="flex items-center gap-2 font-mono text-[0.75rem] text-[var(--tf-code-ink)]">
            <span className="size-1.5 rounded-full bg-[var(--tf-code-ink-3)]" />
            {file}
          </span>
          <span className="font-mono text-[0.6875rem] text-[var(--tf-code-ink-3)]">TSX</span>
        </div>
        <div className="tf-codewin relative min-h-0 flex-1 overflow-hidden">
          <ol className="tf-code tf-code__list tf-anim py-2.5 font-mono">
            {lines.map((line, index) => (
              <li key={index} className="flex">
                <span className="w-9 shrink-0 pr-3 text-right text-[var(--tf-code-ink-3)]/70 tabular-nums select-none">
                  {index + 1}
                </span>
                <span
                  className="tf-code-line tf-anim min-w-0 flex-1 overflow-hidden pr-4 whitespace-pre"
                  style={sceneRange(
                    LINE_START + index * LINE_STEP,
                    LINE_START + index * LINE_STEP + LINE_LENGTH
                  )}
                >
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} className={TOKEN_CLASS[token.kind]}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="tf-termwin shrink-0 overflow-hidden border-t border-[var(--tf-code-edge)] px-4">
          <ol className="tf-log tf-log__list tf-anim py-2 font-mono">
            {log.map((line, index) => {
              const start = LOG_START + index * LOG_STEP
              return (
                <li
                  key={index}
                  className="tf-log-line tf-anim flex items-center gap-2.5"
                  style={sceneRange(start, start + 1)}
                >
                  <LogMarker kind={line.kind} pendingRange={sceneRange(start + 1, start + 1.5)} />
                  <span
                    className={cn(
                      "min-w-0 truncate",
                      line.kind === "command" || line.kind === "ready"
                        ? "text-[var(--tf-code-ink)]"
                        : "text-[var(--tf-code-ink-2)]"
                    )}
                  >
                    {line.text}
                  </span>
                  {line.detail && (
                    <span className="ml-auto shrink-0 pl-3 text-[var(--tf-code-ink-3)]">
                      {line.detail}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

function LogMarker({
  kind,
  pendingRange,
}: {
  kind: LogLine["kind"]
  pendingRange: ReturnType<typeof sceneRange>
}) {
  const box = "relative grid w-3.5 shrink-0 place-items-center"
  if (kind === "command") return <span className={cn(box, "text-[var(--tf-code-ink-3)]")}>$</span>
  if (kind === "info") return <span className={cn(box, "text-[var(--tf-code-ink)]")}>▲</span>
  if (kind === "route") return <span className={cn(box, "text-[var(--tf-code-ink-3)]")}>○</span>
  if (kind === "ready")
    return (
      <span className={box}>
        <LiveDot />
      </span>
    )
  return (
    <span className={box}>
      <Check className="size-3.5 text-[var(--tf-code-ink-2)]" />
      {/* Kółko „w toku” znika, gdy krok się kończy — zostaje ptaszek. */}
      <span
        className="tf-pending tf-anim absolute inset-0 grid place-items-center bg-[var(--tf-code)]"
        style={pendingRange}
      >
        <span className="size-3 rounded-full border-[1.5px] border-[var(--tf-code-ink-3)]/50 border-t-[var(--tf-code-ink)]" />
      </span>
    </span>
  )
}
