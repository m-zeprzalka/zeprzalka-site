import type { ReactNode } from "react"
import { cn } from "../../forma/cn"
import { typo } from "../../forma/typo"
import { Deferred } from "./Deferred"
import { highlightHtml } from "./highlight"

/**
 * Klisza sekcji: warstwa kodu leżąca dokładnie na warstwie projektu
 * (`absolute inset-0` w sekcji z `data-rg-host`). Treść dochodzi po
 * hydratacji (`Deferred`) — HTML z serwera to sam projekt. Bez JS jest niewidoczna;
 * soczewka odsłania ją `clip-path`, przełącznik „Kod” — w całości.
 * `inert` + `aria-hidden`: dla czytnika i klawiatury istnieje tylko projekt.
 */
export function Face({
  children,
  className,
  guides = true,
  variant,
  lensOnly = false,
}: {
  children: ReactNode
  className?: string
  /** Linie kontenera (krawędzie i kolumny siatki) jako tło kliszy. */
  guides?: boolean
  /** `live` — gospodarz się porusza (nagłówek, karta w rzędzie); `scan` — przycina CSS skanu. */
  variant?: "live" | "scan"
  /** Tylko pod soczewką — także w trybie „Kod” (nagłówek: przełącznik zostaje przełącznikiem). */
  lensOnly?: boolean
}) {
  return (
    <div
      data-rg-face={variant ?? ""}
      data-rg-lens-only={lensOnly || undefined}
      aria-hidden="true"
      inert
      className={cn("rg-face", variant && `rg-face--${variant}`, className)}
    >
      <Deferred>
        {guides && (
          <div className="rg-guides fm-container">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
        )}
        {children}
      </Deferred>
    </div>
  )
}

type Kind = "text" | "inspect" | "media" | "block"

/**
 * Bliźniak elementu: kod, który pod soczewką leży w miejscu oryginału.
 * `for` = `data-rg-key` oryginału; pozycję i rozmiar ustawia pomiar
 * po stronie klienta (`lens/measure.ts`), więc zgodność z układem nie zależy
 * od tego, jak sekcja jest zbudowana. `[data-rg-size]` dostaje wymiary „W × H”.
 */
export function Twin({
  for: key,
  kind,
  children,
  className,
}: {
  for: string
  kind: Kind
  children: ReactNode
  className?: string
}) {
  return (
    <div
      data-rg-for={key}
      data-kind={kind}
      className={cn("rg-twin", `rg-twin--${kind}`, className)}
    >
      {children}
    </div>
  )
}

/** Blok kodu z podświetleniem (`pre` z zawijaniem — bliźniak ma szerokość oryginału). */
export function Code({
  src,
  start = "js",
  className,
}: {
  src: string
  start?: "js" | "children"
  className?: string
}) {
  return (
    <pre
      className={cn("rg-code", className)}
      dangerouslySetInnerHTML={{ __html: highlightHtml(src, start) }}
    />
  )
}

/** Etykieta inspektora: selektor i zmierzony rozmiar elementu. */
export function Tag({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("rg-tag", className)}>
      <span className="rg-t-g">{name}</span>
      <span className="rg-tag__size" data-rg-size="" />
    </span>
  )
}

/** Bliźniak „inspect”: ramka elementu, etykieta i kod w środku (przyciski, pola, pigułki). */
export function Inspect({
  for: key,
  name,
  src,
  className,
  start = "js",
}: {
  for: string
  name: string
  src: string
  className?: string
  start?: "js" | "children"
}) {
  return (
    <Twin for={key} kind="inspect" className={className}>
      <Tag name={name} />
      <Code src={src} start={start} />
    </Twin>
  )
}

/** Bliźniak „block”: znacznik otwierający u góry, zamykający u dołu, delikatna ramka. */
export function Block({
  for: key,
  open,
  close,
  className,
}: {
  for: string
  open: string
  close?: string
  className?: string
}) {
  return (
    <Twin for={key} kind="block" className={className}>
      <Code src={open} className="rg-block__open" />
      {close && <Code src={close} className="rg-block__close" />}
    </Twin>
  )
}

/**
 * Bliźniak „outline” dla dużego pisma: ten sam tekst tym samym krojem i tą
 * samą szerokością (więc te same łamania), ale jako kontur z liniami pisma —
 * tryb „outline” z narzędzi projektanta. Znacznik JSX w pigułce nad
 * elementem, obok prawdziwa reguła CSS klasy.
 */
export function Outline({
  for: key,
  tag,
  classes,
  text,
  css,
  label,
  className,
}: {
  for: string
  tag: string
  /** Etykieta znacznika zamiast pełnej listy klas (gdy klas jest dużo). */
  label?: string
  /** Klasy typograficzne oryginału (bez wejść i ruchu) — gwarantują ten sam skład. */
  classes: string
  text: string
  css?: string
  className?: string
}) {
  return (
    <Twin for={key} kind="text" className={cn("rg-twin--outline", className)}>
      <div className={cn("rg-outline", classes)}>{typo(text)}</div>
      <Code className="rg-outline__tag" src={label ?? `<${tag} className="${classes}">`} />
      {css && <Code className="rg-outline__css" src={css} />}
    </Twin>
  )
}
