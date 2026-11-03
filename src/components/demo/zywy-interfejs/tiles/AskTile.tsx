"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "../../forma/cn"
import { useReducedMotion } from "../../forma/use-in-view"

export interface Prompt {
  label: string
  answer: string
}

/** Tempo „strumienia” — ok. 55 ms na słowo, jak szybki model. */
const WORD_MS = 55
const THINK_MS = 650

/**
 * AI: pole polecenia z podpowiedziami. Odpowiedź płynie słowo po słowie,
 * każde słowo wyostrza się z lekkiego rozmycia; przed nią krótko „myśli”.
 * Odpowiedzi są złożone z treści serwisu i uczciwie podpisane jako
 * demonstracja — strona jest statyczna, nie woła żadnego modelu.
 */
export function AskTile({
  prompts,
  labels,
}: {
  prompts: Prompt[]
  labels: { thinking: string; note: string; ask: string }
}) {
  const [active, setActive] = useState(0)
  const [phase, setPhase] = useState<"thinking" | "streaming">("streaming")
  const [words, setWords] = useState(() => (prompts[0]?.answer ?? "").split(" ").length)
  const reduced = useReducedMotion()
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const answer = prompts[active]?.answer ?? ""
  const tokens = answer.split(" ")

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function ask(index: number) {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setActive(index)
    const total = (prompts[index]?.answer ?? "").split(" ").length
    if (reduced) {
      setPhase("streaming")
      setWords(total)
      return
    }
    setPhase("thinking")
    setWords(0)
    timers.current.push(
      setTimeout(() => {
        setPhase("streaming")
        for (let i = 1; i <= total; i++) {
          timers.current.push(setTimeout(() => setWords(i), i * WORD_MS))
        }
      }, THINK_MS)
    )
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 p-4 md:p-5">
      <div className="min-h-40" aria-live="polite" aria-busy={phase === "thinking"}>
        {phase === "thinking" ? (
          <p className="zi-shimmer w-fit text-sm font-medium">{labels.thinking}</p>
        ) : (
          <p className="text-[0.9375rem] leading-7 text-pretty">
            {tokens.map((token, index) => (
              <span
                key={`${active}-${index}`}
                className={cn(
                  "inline transition-[opacity,filter] duration-300 ease-fm-snap",
                  index < words ? "opacity-100 blur-none" : "opacity-0 blur-[3px]"
                )}
              >
                {token}{" "}
              </span>
            ))}
          </p>
        )}
      </div>

      <div className="rounded-fm-2xl bg-fm-surface p-2 shadow-fm-ring">
        <div className="flex items-center gap-2 px-2 pt-1.5 pb-2.5 text-sm text-fm-ink-3">
          <span className="truncate">{prompts[active]?.label}</span>
          <span
            aria-hidden="true"
            className="h-4 w-px animate-[fm-caret_1.05s_steps(1)_infinite] bg-fm-ink"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <ul className="flex min-w-0 [scrollbar-width:none] gap-1.5 overflow-x-auto">
            {prompts.map((prompt, index) => (
              <li key={prompt.label}>
                <button
                  type="button"
                  aria-pressed={index === active}
                  onClick={() => ask(index)}
                  className={cn(
                    "h-8 fm-press rounded-full px-3 text-fm-micro font-medium whitespace-nowrap fm-focus transition-[background-color,color,scale] duration-150",
                    index === active
                      ? "bg-fm-ink text-fm-inverse"
                      : "bg-fm-fill text-fm-ink-2 hover:bg-fm-fill-strong hover:text-fm-ink"
                  )}
                >
                  {prompt.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-label={labels.ask}
            onClick={() => ask((active + 1) % prompts.length)}
            className="grid size-8 shrink-0 fm-press place-items-center rounded-full bg-fm-ink text-fm-inverse fm-focus"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
      <p className="text-[0.6875rem] text-fm-ink-3" style={{ textWrap: "pretty" } as CSSProperties}>
        {labels.note}
      </p>
    </div>
  )
}
