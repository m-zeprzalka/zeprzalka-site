import Image from "next/image"
import { LiveDot } from "@/components/demo/forma/Chip"
import type { CodeLine } from "./types"

/**
 * Kadry etapów na kartach kompetencji: szkic → projekt, kod, produkt — ta sama
 * historia co w scenie, bez ruchu (przy „ogranicz ruch” to jedyna jej wersja).
 * Dekoracja (aria-hidden) — treść niosą nagłówki i opisy kompetencji.
 */
export function StageStill({
  index,
  stages,
  code,
  poster,
}: {
  index: number
  stages: readonly string[]
  code: readonly CodeLine[]
  poster: string
}) {
  const frame = "tf-r-2xl relative mb-6 aspect-[16/10] overflow-hidden bg-fm-surface shadow-fm-ring"
  const tag =
    "absolute top-3 left-3 rounded-full bg-fm-surface px-2.5 py-1 text-[0.6875rem] font-medium text-fm-ink-2 shadow-fm-ring"

  if (index === 0)
    return (
      <div aria-hidden="true" className={frame}>
        <div className="grid h-full grid-cols-2">
          <div className="flex flex-col gap-2.5 border-r border-dashed p-5 pt-12">
            <span className="h-2.5 w-3/4 rounded-full bg-fm-ink/10" />
            <span className="h-2.5 w-1/2 rounded-full bg-fm-ink/10" />
            <span className="mt-1 h-6 w-20 rounded-full outline-1 -outline-offset-1 outline-fm-ink-3/60 outline-dashed" />
            <span className="mt-auto h-1/3 rounded-md outline-1 -outline-offset-1 outline-fm-ink-3/60 outline-dashed" />
          </div>
          <div className="flex flex-col gap-2 p-5 pt-12">
            <span className="text-[1.125rem] leading-[1.05] font-medium tracking-[-0.04em] text-fm-ink">
              Aa
            </span>
            <span className="h-1.5 w-4/5 rounded-full bg-fm-ink/25" />
            <span className="mt-1 h-6 w-20 rounded-full bg-fm-ink" />
            <span className="mt-auto h-1/3 rounded-xl bg-fm-fill-strong" />
          </div>
        </div>
        <span className={tag}>{stages[0]}</span>
        <span className={tag} style={{ left: "calc(50% + 0.75rem)" }}>
          {stages[1]}
        </span>
      </div>
    )

  if (index === 1)
    return (
      <div aria-hidden="true" className={`${frame} tf-codebox`}>
        <ol className="tf-code flex flex-col px-4 pt-12 font-mono">
          {code.slice(0, 9).map((line, lineIndex) => (
            <li key={lineIndex} className="truncate whitespace-pre">
              {line.map((token) => token.text).join("")}
            </li>
          ))}
        </ol>
        <span className="absolute inset-x-4 bottom-3 flex items-center gap-2 font-mono text-[0.6875rem] text-[var(--tf-code-ink-2)]">
          <LiveDot /> Ready
        </span>
        <span className={tag}>{stages[2]}</span>
      </div>
    )

  return (
    <div aria-hidden="true" className={frame}>
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 28rem, 100vw"
        className="object-cover"
      />
      <span className={tag}>{stages[3]}</span>
    </div>
  )
}
