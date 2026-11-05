"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "../../forma/cn"
import { useStage, useTimers } from "../use-stage"
import { ReplayButton } from "./ReplayButton"

export interface Prompt {
  label: string
  answer: string
}

type Phase = "sent" | "thinking" | "streaming" | "done"

interface Chat {
  run: number
  active: number
  phase: Phase
  words: number
  /** Wcześniejsze wymiany (indeksy podpowiedzi) — nad bieżącą, przygaszone. */
  history: readonly number[]
}

/** Spokojne tempo „strumienia” (ok. 14 słów/s) i chwila „myślenia” przed odpowiedzią. */
const WORD_MS = 72
const THINK_MS = 820
/** Ile wcześniejszych wymian zostaje w wątku. */
const HISTORY = 2

/**
 * AI & Automatyzacja: rozmowa w duchu `zywy-interfejs/tiles/AskTile.tsx`
 * (treść ze strony, nie z bloga) z ruchem z Esencji. Wątek stoi przy polu
 * polecenia, jak w komunikatorze: nad bieżącą wymianą jest już krótka historia
 * (przygaszona, gaśnie ku górze), więc kafel nie ma martwego miejsca. Gdy kafel
 * wejdzie w kadr, polecenie wjeżdża dymkiem, chwilę „myśli” (połysk), odpowiedź
 * płynie spokojnie słowo po słowie, każde wyostrza się z rozmycia. Miejsce na
 * odpowiedź jest zajęte od początku (niewidoczne słowa) — bez skoku układu.
 * Odpowiedzi to treści strony, uczciwie podpisane jako demonstracja. Czytnik
 * ekranu dostaje całą odpowiedź raz, po strumieniu.
 */
export function AskTile({
  prompts,
  labels,
}: {
  prompts: readonly Prompt[]
  labels: { thinking: string; ask: string; note: string; replay: string }
}) {
  const { ref, run, replay, idle, reduced } = useStage<HTMLDivElement>()
  const { after, clear } = useTimers()
  const opening = [prompts.length - 1]
  // HTML z serwera, bez JS i przy „ogranicz ruch”: historia i pełna pierwsza odpowiedź.
  const [chat, setChat] = useState<Chat>({
    run: 0,
    active: 0,
    phase: "done",
    words: Number.POSITIVE_INFINITY,
    history: opening,
  })
  // Przed startem przebiegu widać historię i samo polecenie (odpowiedź jeszcze nie przyszła).
  const pending = idle || run > chat.run
  const view: Chat = pending ? { run, active: 0, phase: "sent", words: 0, history: opening } : chat

  function ask(index: number, forRun: number, fresh = false) {
    clear()
    if (!prompts[index]) return
    setChat((current) => {
      const history = fresh
        ? opening
        : [...current.history, current.active].filter((item) => item !== index).slice(-HISTORY)
      return reduced
        ? { run: forRun, active: index, phase: "done", words: Number.POSITIVE_INFINITY, history }
        : { run: forRun, active: index, phase: "sent", words: 0, history }
    })
    if (reduced) return
    let t = 380
    after(t, () => setChat((c) => ({ ...c, phase: "thinking" })))
    t += THINK_MS
    after(t, () => setChat((c) => ({ ...c, phase: "streaming" })))
    const total = (prompts[index]?.answer ?? "").split(" ").length
    for (let i = 1; i <= total; i++) {
      after(t + i * WORD_MS, () => setChat((c) => ({ ...c, words: i })))
    }
    after(t + total * WORD_MS + 240, () => setChat((c) => ({ ...c, phase: "done" })))
  }

  // Pierwsze pytanie zadaje się samo — przy wejściu w kadr i przy powtórce.
  useEffect(() => {
    if (run === 0) return
    after(0, () => ask(0, run, true))
    return clear
    // `ask` zmienia się co render; scena zależy tylko od numeru przebiegu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  const prompt = prompts[view.active] ?? prompts[0]

  return (
    <div ref={ref} className="relative flex flex-1 flex-col p-2">
      <ReplayButton label={labels.replay} onClick={replay} />

      {/* Wątek przyklejony do pola polecenia; nadmiar historii gaśnie ku górze. */}
      <div className="bo-thread relative min-h-44 flex-1 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 px-3 pb-4">
          {view.history.map((index) => {
            const item = prompts[index]
            return item ? <Exchange key={`h-${index}`} prompt={item} past /> : null
          })}
          {prompt && (
            <Exchange
              key={`${view.run}-${view.active}`}
              prompt={prompt}
              phase={view.phase}
              words={view.words}
              thinking={labels.thinking}
            />
          )}
        </div>
        <p role="status" className="sr-only">
          {view.phase === "done" && prompt ? `${prompt.label}. ${prompt.answer}` : ""}
        </p>
      </div>

      {/* Pole polecenia z podpowiedziami (wygląd z „Żywego interfejsu”). */}
      <div className="rounded-[1.125rem] bg-fm-surface p-2 shadow-fm-ring">
        <div className="flex min-h-9 items-center gap-2 px-2 text-[0.875rem] text-fm-ink-3">
          <span className="truncate">{prompt?.label}</span>
          <span
            aria-hidden="true"
            className="h-4 w-px animate-[fm-caret_1.05s_steps(1)_6] bg-fm-ink motion-reduce:animate-none"
          />
        </div>
        <div className="-my-1.5 flex items-center justify-between gap-2">
          <ul className="bo-chips flex min-w-0 [scrollbar-width:none] gap-1.5 overflow-x-auto">
            {prompts.map((item, index) => (
              <li key={item.label}>
                {/* Pole trafienia 44 px, widoczna pigułka 32 px. */}
                <button
                  type="button"
                  aria-pressed={index === view.active}
                  onClick={() => ask(index, run)}
                  className="group/chip flex h-11 items-center rounded-full fm-focus"
                >
                  <span
                    className={cn(
                      "inline-flex h-8 items-center rounded-full px-3 text-fm-micro font-medium whitespace-nowrap transition-[background-color,color,scale] duration-150 ease-fm-snap group-active/chip:scale-[0.97]",
                      index === view.active
                        ? "bg-fm-ink text-fm-inverse"
                        : "bg-fm-fill text-fm-ink-2 group-hover/chip:bg-fm-fill-strong group-hover/chip:text-fm-ink"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-label={labels.ask}
            onClick={() => ask((view.active + 1) % prompts.length, run)}
            className="group/send -me-1.5 grid size-11 shrink-0 place-items-center rounded-full fm-focus"
          >
            <span className="grid size-8 place-items-center rounded-full bg-fm-ink text-fm-inverse transition-[scale] duration-150 ease-fm-snap group-active/send:scale-[0.97]">
              <ArrowUp aria-hidden="true" className="size-4" />
            </span>
          </button>
        </div>
      </div>
      <p className="px-2 pt-2 text-[0.75rem] leading-4 text-pretty text-fm-ink-3">{labels.note}</p>
    </div>
  )
}

/**
 * Jedna wymiana: dymek polecenia i odpowiedź. Wcześniejsza (`past`) jest
 * przygaszona i kompletna; bieżąca odsłania słowa po kolei — wszystkie słowa
 * są w układzie od początku (niewidoczne), więc wysokość się nie zmienia.
 */
function Exchange({
  prompt,
  past = false,
  phase = "done",
  words = Number.POSITIVE_INFINITY,
  thinking,
}: {
  prompt: Prompt
  past?: boolean
  phase?: Phase
  words?: number
  thinking?: string
}) {
  const tokens = prompt.answer.split(" ")
  return (
    <div aria-hidden={!past || undefined} className="flex flex-col gap-3">
      <p
        className={cn(
          "ms-auto max-w-[85%] rounded-[1.125rem] rounded-br-md px-3.5 py-2 text-[0.875rem]",
          past ? "bg-fm-fill-strong text-fm-ink-2" : "bo-bubble bg-fm-ink text-fm-inverse"
        )}
      >
        {prompt.label}
      </p>
      <div className="relative">
        {phase === "thinking" && (
          <p className="bo-shimmer absolute top-0 left-0 w-fit text-[0.875rem] font-medium">
            {thinking}
          </p>
        )}
        <p
          className={cn(
            "text-[0.9375rem] leading-[1.65] text-pretty",
            past ? "text-fm-ink-3" : "text-fm-ink"
          )}
        >
          {tokens.map((token, index) => (
            <span
              key={index}
              className={cn(
                "transition-[opacity,filter] duration-[420ms] ease-fm-snap",
                index < words && (phase === "streaming" || phase === "done")
                  ? "opacity-100 blur-none"
                  : "opacity-0 blur-[3px]"
              )}
            >
              {token}{" "}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
