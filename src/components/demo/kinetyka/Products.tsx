"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "../forma/cn"
import { finePointer, kinetic, motionAllowed } from "./gsap"

export interface Product {
  slug: string
  title: string
  category: string
  description: string
  url: string
  poster: string
  width: number
  height: number
}

/** Czas dekodowania, opóźnienie odsłaniania liter i rytm zmiany cyfr (ms). */
const DECODE_MS = 700
const DECODE_HOLD = 0.15
const FLICKER_MS = 40

/**
 * Dekodowanie z kodu binarnego (zamiast wtyczki ScrambleText, ok. 4 KB): litery
 * po lewej odsłaniają się kolejno, reszta to migające 0/1 (spacje zostają).
 * Zwraca sprzątanie, które od razu przywraca pełny tekst.
 */
function decodeBinary(label: HTMLElement, text: string) {
  const chars = Array.from(text)
  const start = performance.now()
  let last = 0
  let frame = requestAnimationFrame(function tick(now) {
    const progress = Math.min(1, (now - start) / DECODE_MS)
    if (now - last >= FLICKER_MS || progress === 1) {
      last = now
      const shown = Math.floor(
        Math.max(0, (progress - DECODE_HOLD) / (1 - DECODE_HOLD)) * chars.length
      )
      label.textContent = chars
        .map((char, index) =>
          index < shown || char === " " ? char : Math.random() < 0.5 ? "0" : "1"
        )
        .join("")
    }
    if (progress < 1) frame = requestAnimationFrame(tick)
  })
  return () => {
    cancelAnimationFrame(frame)
    label.textContent = text
  }
}

/**
 * Produkty jako indeks wielkich tytułów (tytuł jest przyciskiem i miniaturą
 * zarazem). Na myszy podgląd płynie za kursorem w strefie tytułów (nigdy nad
 * kolumną opisów) z opóźnieniem (quickTo,
 * 0,55 s), wyłania się z rozmycia, a przy zmianie wiersza obraz zmienia się
 * na miejscu przez rozmycie; pozostałe tytuły przygasają. Na dotyku kadr
 * stoi w wierszu, pod tytułem — nic nie jest ukryte pod najechaniem.
 */
export function Products({ products, newTab }: { products: readonly Product[]; newTab: string }) {
  const listRef = useRef<HTMLUListElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const list = listRef.current
    const preview = previewRef.current
    if (!list || !preview || !finePointer()) return
    const { gsap } = kinetic()
    const follow = { duration: 0.55, ease: "power3.out" }
    const x = gsap.quickTo(preview, "x", follow)
    const y = gsap.quickTo(preview, "y", follow)
    let placed = false
    const move = (event: PointerEvent) => {
      const box = list.getBoundingClientRect()
      // Podgląd żyje w strefie tytułów: prawa krawędź zatrzymuje się 24 px przed kolumną opisów.
      const meta = list.querySelector(".kn-index-meta")?.getBoundingClientRect()
      const limit = (meta ? meta.left - box.left : box.width) - 24 - preview.offsetWidth
      const px = gsap.utils.clamp(
        0,
        Math.max(0, limit),
        event.clientX - box.left - preview.offsetWidth / 2
      )
      const py = event.clientY - box.top - preview.offsetHeight / 2
      // Pierwsze wejście: podgląd pojawia się od razu pod kursorem (bez przelotu z rogu).
      if (!placed) {
        gsap.set(preview, { x: px, y: py })
        placed = true
      }
      x(px)
      y(py)
    }
    const leave = () => {
      placed = false
      setActive(null)
    }
    list.addEventListener("pointermove", move)
    list.addEventListener("pointerleave", leave)
    return () => {
      list.removeEventListener("pointermove", move)
      list.removeEventListener("pointerleave", leave)
    }
  }, [])

  // Kategoria aktywnego wiersza „dekoduje się” z kodu binarnego (0,7 s, litery od lewej).
  useEffect(() => {
    if (active === null || !motionAllowed()) return
    const label = listRef.current?.querySelectorAll<HTMLElement>("[data-kn-code]")[active]
    if (!label) return
    return decodeBinary(label, label.dataset.knCode ?? "")
  }, [active])

  return (
    <div className="relative">
      <ul ref={listRef} className="kn-index" data-active={active === null ? undefined : ""}>
        {products.map((product, index) => (
          <li key={product.slug} className="border-t border-fm-edge last:border-b">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className={cn("kn-index-row group fm-focus", active === index && "is-hot")}
            >
              <span className="kn-index-title">{product.title}</span>
              <span className="kn-index-meta">
                <span className="font-medium text-fm-ink">
                  <span className="sr-only">{product.category}</span>
                  {/* Dekodowanie z kodu binarnego jest tylko dla oka — czytnik dostaje etykietę wyżej. */}
                  <span aria-hidden="true" data-kn-code={product.category}>
                    {product.category}
                  </span>
                </span>
                <span className="text-pretty">{product.description}</span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="kn-index-arrow size-6 shrink-0 transition-[translate] duration-300 ease-fm-snap group-hover:translate-x-1 group-hover:-translate-y-1 sm:size-8"
              />
              <span className="sr-only"> ({newTab})</span>
              <span
                className="kn-index-thumb"
                style={{ "--kn-ratio": product.width / product.height } as CSSProperties}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- zrzuty w docelowym rozmiarze (1200 px WebP) */}
                <img src={product.poster} alt="" loading="lazy" decoding="async" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div
        ref={previewRef}
        aria-hidden="true"
        className="kn-index-preview"
        data-on={active === null ? undefined : ""}
      >
        {products.map((product, index) => (
          // eslint-disable-next-line @next/next/no-img-element -- jw.
          <img
            key={product.slug}
            src={product.poster}
            alt=""
            loading="lazy"
            decoding="async"
            data-on={active === index ? "" : undefined}
          />
        ))}
      </div>
    </div>
  )
}
