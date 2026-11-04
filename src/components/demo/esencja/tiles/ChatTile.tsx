"use client"

import { useEffect, useState } from "react"
import { ArrowUp, ArrowUpRight, RotateCcw } from "lucide-react"
import { cn } from "../../forma/cn"
import { replayButton } from "../Tile"
import { useStage, useTimers } from "../use-stage"

export interface ChatPrompt {
  /** Krótka etykieta podpowiedzi w polu polecenia. */
  label: string
  /** Pytanie wpisywane w pole i wysyłane jako dymek. */
  question: string
  answer: string
  /** Metadane odpowiedzi jako chipy (np. data i czas lektury wpisu). */
  tools: readonly string[]
  /** Źródło odpowiedzi — link na końcu chipów. */
  href?: string
}

type Phase = "sent" | "thinking" | "streaming" | "done"

const WORD_MS = 46
const THINK_MS = 720

/**
 * AI & Automatyzacja: rozmowa, która rusza, gdy kafel wejdzie w kadr.
 * Pytanie stoi w dymku od początku, po chwili „myślenia” (połysk) odpowiedź
 * płynie słowo po słowie (każde wyostrza się z rozmycia), na końcu chipy
 * z metadanymi i źródłem. Wysokość wątku jest zarezerwowana pod najdłuższą
 * odpowiedź (niewidoczne kopie w tej samej komórce siatki) — bez pustej
 * dziury i bez skoku układu. Odpowiedzi to treści strony, uczciwie podpisane
 * jako demonstracja. Czytnik ekranu dostaje całą odpowiedź raz, po strumieniu.
 */
export function ChatTile({
  prompts,
  labels,
}: {
  prompts: readonly ChatPrompt[]
  labels: {
    thinking: string
    send: string
    note: string
    replay: string
    composer: string
    source: string
  }
}) {
  const { ref, run, replay, idle, reduced } = useStage<HTMLDivElement>()
  const { after, clear } = useTimers()
  // Stan rozmowy przypisany do przebiegu sceny; HTML z serwera — pełna pierwsza odpowiedź.
  const [chat, setChat] = useState<{ run: number; active: number; phase: Phase; words: number }>({
    run: 0,
    active: 0,
    phase: "done",
    words: Number.POSITIVE_INFINITY,
  })
  // Przed startem (i zanim ruszą timery nowego przebiegu) widać samo pytanie.
  const pending = idle || run > chat.run
  const { active, phase, words } = pending ? { active: 0, phase: "sent" as Phase, words: 0 } : chat
  const prompt = prompts[active] ?? prompts[0]
  const tokens = prompt?.answer.split(" ") ?? []

  function ask(index: number, forRun: number) {
    clear()
    const next = prompts[index]
    if (!next) return
    if (reduced) {
      setChat({ run: forRun, active: index, phase: "done", words: Number.POSITIVE_INFINITY })
      return
    }
    setChat({ run: forRun, active: index, phase: "sent", words: 0 })
    let t = 320
    after(t, () => setChat((c) => ({ ...c, phase: "thinking" })))
    t += THINK_MS
    after(t, () => setChat((c) => ({ ...c, phase: "streaming" })))
    const total = next.answer.split(" ").length
    for (let i = 1; i <= total; i++) {
      after(t + i * WORD_MS, () => setChat((c) => ({ ...c, words: i })))
    }
    after(t + total * WORD_MS + 200, () => setChat((c) => ({ ...c, phase: "done" })))
  }

  // Pierwsze pytanie zadaje się samo — przy wejściu w kadr i przy powtórce.
  useEffect(() => {
    if (run === 0) return
    after(0, () => ask(0, run))
    return clear
    // `ask` zmienia się co render; scena zależy tylko od numeru przebiegu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  const answering = phase === "streaming" || phase === "done"

  return (
    <div ref={ref} className="relative flex flex-1 flex-col p-2">
      <button type="button" onClick={replay} aria-label={labels.replay} className={replayButton}>
        <RotateCcw className="size-4" />
      </button>

      {/* Wątek: warstwa na żywo i niewidoczne kopie wszystkich odpowiedzi w jednej komórce */}
      <div className="mt-auto grid px-3 pt-14 pb-3">
        {prompts.map((item) => (
          <Exchange
            key={item.label}
            prompt={item}
            source={labels.source}
            className="invisible col-start-1 row-start-1"
          />
        ))}
        <div className="col-start-1 row-start-1 flex flex-col gap-3 self-start">
          <p
            key={`q-${run}-${active}`}
            className="es-bubble ms-auto max-w-[85%] rounded-[1.125rem] rounded-br-md bg-fm-ink px-3.5 py-2 text-[0.875rem] text-fm-inverse"
          >
            {prompt?.question}
          </p>
          {phase === "thinking" && (
            <p className="es-shimmer w-fit text-[0.875rem] font-medium">{labels.thinking}</p>
          )}
          {answering && prompt && (
            <div className="max-w-[94%]">
              <p
                aria-hidden="true"
                className="text-[0.9375rem] leading-[1.6] text-pretty text-fm-ink"
              >
                {tokens.map((token, index) => (
                  <span
                    key={`${active}-${index}`}
                    className={cn(
                      "transition-[opacity,filter] duration-300 ease-fm-snap",
                      index < words ? "opacity-100 blur-none" : "opacity-0 blur-[3px]"
                    )}
                  >
                    {token}{" "}
                  </span>
                ))}
              </p>
              <Meta
                prompt={prompt}
                source={labels.source}
                interactive={phase === "done"}
                className={cn(
                  "mt-3 transition-[opacity,translate] duration-300 ease-fm-snap",
                  phase === "done" ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                )}
              />
            </div>
          )}
        </div>
        <p role="status" className="sr-only">
          {phase === "done" && prompt ? `${prompt.question} ${prompt.answer}` : ""}
        </p>
      </div>

      {/* Pole polecenia z podpowiedziami */}
      <div className="rounded-[1.125rem] bg-fm-surface p-2 shadow-fm-ring">
        <p className="flex min-h-9 items-center px-2 text-[0.875rem] text-fm-ink-3">
          {labels.composer}
        </p>
        <div className="flex items-center justify-between gap-2">
          <ul className="es-chips flex min-w-0 [scrollbar-width:none] gap-1.5 overflow-x-auto">
            {prompts.map((item, index) => (
              <li key={item.label}>
                <button
                  type="button"
                  aria-pressed={index === active}
                  onClick={() => ask(index, run)}
                  className={cn(
                    "h-8 fm-press rounded-full px-3 text-fm-micro font-medium whitespace-nowrap fm-focus transition-[background-color,color,scale] duration-150",
                    index === active
                      ? "bg-fm-ink text-fm-inverse"
                      : "bg-fm-fill text-fm-ink-2 hover:bg-fm-fill-strong hover:text-fm-ink"
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-label={labels.send}
            onClick={() => ask((active + 1) % prompts.length, run)}
            className="relative grid size-8 shrink-0 fm-press place-items-center rounded-full bg-fm-ink text-fm-inverse fm-focus transition-[scale] after:absolute after:-inset-1.5 after:content-['']"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
      <p className="px-2 pt-2 text-[0.75rem] leading-4 text-pretty text-fm-ink-3">{labels.note}</p>
    </div>
  )
}

/** Gotowa wymiana (pytanie, odpowiedź, chipy) — kopia rezerwująca wysokość wątku. */
function Exchange({
  prompt,
  source,
  className,
}: {
  prompt: ChatPrompt
  source: string
  className?: string
}) {
  return (
    <div aria-hidden="true" className={cn("flex flex-col gap-3", className)}>
      <p className="ms-auto max-w-[85%] rounded-[1.125rem] px-3.5 py-2 text-[0.875rem]">
        {prompt.question}
      </p>
      <div className="max-w-[94%]">
        <p className="text-[0.9375rem] leading-[1.6] text-pretty">{prompt.answer}</p>
        <Meta prompt={prompt} source={source} interactive={false} className="mt-3" />
      </div>
    </div>
  )
}

/** Chipy pod odpowiedzią: data, czas lektury i link do wpisu. */
function Meta({
  prompt,
  source,
  interactive,
  className,
}: {
  prompt: ChatPrompt
  source: string
  interactive: boolean
  className?: string
}) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {prompt.tools.map((tool) => (
        <li
          key={tool}
          className="inline-flex h-6 items-center rounded-md bg-fm-surface px-2 font-mono text-[0.75rem] text-fm-ink-2 shadow-fm-ring"
        >
          {tool}
        </li>
      ))}
      {prompt.href && (
        <li>
          <a
            href={prompt.href}
            tabIndex={interactive ? undefined : -1}
            className="group relative inline-flex h-6 items-center gap-1 rounded-md bg-fm-ink px-2 text-[0.75rem] font-medium text-fm-inverse fm-focus after:absolute after:-inset-2 after:content-['']"
          >
            {source}
            <ArrowUpRight
              aria-hidden="true"
              className="size-3 transition-transform duration-150 group-hover:translate-x-px group-hover:-translate-y-px"
            />
          </a>
        </li>
      )}
    </ul>
  )
}
