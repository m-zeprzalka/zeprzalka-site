"use client"

import { createElement, type CSSProperties, type HTMLAttributes } from "react"
import { useInView } from "react-intersection-observer"

type RevealTag =
  | "div"
  | "span"
  | "p"
  | "h2"
  | "h3"
  | "li"
  | "ul"
  | "ol"
  | "article"
  | "figure"
  | "header"
  | "footer"

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: RevealTag
  /** `mask` — tekst wyjeżdża spod własnej krawędzi; `fade` — delikatne wejście. */
  variant?: "mask" | "fade"
  /** Numer w grupie: przesuwa start o 90 ms, budując kaskadę. */
  i?: number
}

/**
 * Ujawnianie przy wejściu w kadr — jednorazowe (`triggerOnce`), więc treść raz
 * pokazana zostaje widoczna: przewijanie w górę niczego nie chowa, wyszukiwarka
 * w przeglądarce i druk zawsze mają pełny tekst.
 *
 * JavaScript ustawia tu tylko atrybut `data-shown`; cały ruch opisuje CSS.
 */
export function Reveal({
  as = "div",
  variant = "fade",
  i = 0,
  style,
  ...props
}: RevealProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.12,
    rootMargin: "0px 0px -6% 0px",
  })

  return createElement(as, {
    ref,
    "data-reveal": variant,
    "data-shown": inView ? "" : undefined,
    style: { "--d": `${i * 90}ms`, ...style } as CSSProperties,
    ...props,
  })
}
