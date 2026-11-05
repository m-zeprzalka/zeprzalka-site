import { Fragment, type CSSProperties, type ReactNode } from "react"
import { cn } from "../forma/cn"
import { typo } from "../forma/typo"

/** „Umiejętności, które…” → „umiejętności, które…” — dalszy ciąg zdania po pauzie. */
const continuation = (text: string) => text.charAt(0).toLocaleLowerCase("pl") + text.slice(1)

/**
 * Nagłówek sekcji — jeden wzór dla całej strony (właściciel: nie dwa wyrazy
 * z wielkiej litery obok siebie, „raczej jedna linia”). Tytuł i opis to jedno
 * zdanie: „**Kompetencje** — umiejętności, które…”: tytuł w skali display,
 * dalszy ciąg małą literą, wyraźnie mniejszy i przygaszony. Akcja (link „Wszystkie…”) po prawej, na telefonie pod spodem.
 * Słowa wyostrzają się po kolei przy wejściu w kadr (`Appear`); czytnik dostaje
 * całe zdanie raz.
 */
export function SectionHeader({
  id,
  title,
  lead,
  aside,
  asideClassName,
  className,
}: {
  id: string
  title: string
  lead: string
  /** Akcja po prawej (link do pełnej strony). */
  aside?: ReactNode
  /** Klasy kontenera akcji (np. ukrycie towarzysza na telefonie). */
  asideClassName?: string
  className?: string
}) {
  const head = typo(title).split(" ")
  const tail = typo(continuation(lead)).split(" ")
  const words = (list: string[], offset: number) =>
    list.map((text, index) => (
      <Fragment key={index}>
        <span className="b2-w" style={{ "--i": offset + index } as CSSProperties}>
          {text}
        </span>
        {index < list.length - 1 && " "}
      </Fragment>
    ))

  return (
    <header
      className={cn("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-(--b2-gap)", className)}
    >
      {/* Tytuł w skali display, dalszy ciąg zdania wyraźnie mniejszy i przygaszony — na wspólnej
          linii bazowej obok tytułu (gdy brak miejsca: pod nim). Jeden wzór we wszystkich sekcjach. */}
      <h2
        id={id}
        data-b2-words=""
        className={cn(
          "flex flex-wrap items-baseline gap-x-5 gap-y-2",
          aside ? "lg:col-span-9" : "lg:col-span-12"
        )}
      >
        <span className="sr-only">{`${title} — ${continuation(lead)}`}</span>
        {/* Pauza zostaje przy tytule (twarda spacja, rozmiar dalszego ciągu) — gdy ciąg schodzi
            pod tytuł, wiersz nigdy nie zaczyna się od pauzy. */}
        <span aria-hidden="true" className="b2-h2 whitespace-nowrap">
          {words(head, 0)}
          <span className="text-[clamp(1rem,0.9rem+0.45vw,1.25rem)] font-normal tracking-normal text-fm-ink-3">
            {"\u00a0—"}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="max-w-[46rem] min-w-[min(100%,18rem)] flex-1 text-[clamp(1rem,0.9rem+0.45vw,1.25rem)] leading-snug font-normal tracking-[-0.01em] text-pretty text-fm-ink-3"
        >
          {words(tail, head.length)}
        </span>
      </h2>
      {aside && (
        <div
          data-b2-in=""
          style={{ "--i": 3 } as CSSProperties}
          className={cn("flex lg:col-span-3 lg:justify-end lg:pb-2", asideClassName)}
        >
          {aside}
        </div>
      )}
    </header>
  )
}
