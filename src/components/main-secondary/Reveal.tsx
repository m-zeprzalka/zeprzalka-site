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
  | "article"
  | "figure"
  | "header"

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: RevealTag
  /** Opóźnienie w ms — do schodkowania elementów w grupie. */
  delay?: number
}

/**
 * Ujawnianie przy wejściu w viewport. Jedyna rola JS: ustawić `data-inview`.
 * Sam ruch to CSS (opacity + translate) — patrz main-secondary.css.
 * Bez JS (`@media (scripting: none)`) i przy `prefers-reduced-motion`
 * treść jest widoczna od razu.
 */
export function Reveal({
  as = "div",
  delay = 0,
  style,
  ...props
}: RevealProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px -8% 0px",
  })

  return createElement(as, {
    ref,
    "data-reveal": "",
    "data-inview": inView ? "" : undefined,
    style: { "--reveal-delay": `${delay}ms`, ...style } as CSSProperties,
    ...props,
  })
}
