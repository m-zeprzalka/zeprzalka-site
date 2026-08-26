"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SmartVideo } from "@/components/media/SmartVideo"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { portfolio } from "@/lib/home-content"

const pad = (value: number) => String(value).padStart(2, "0")

/** "771 / 500" → 1.542. Szerokość kafelka liczymy z proporcji materiału,
 *  żeby pas miał jedną wysokość, a rytm budowały różne formaty. */
function ratioOf(aspect: string): number {
  const [w, h] = aspect.split("/").map((part) => Number(part.trim()))
  return h > 0 ? w / h : 16 / 9
}

/**
 * Poziomy pas realizacji ze scroll-snap. Materiały mają różne proporcje
 * (16:9, 4:5, panorama) — przy stałej wysokości różnica szerokości staje się
 * rytmem, zamiast dziurą w siatce, jak w układzie kafelkowym.
 *
 * Dostępność: kontener jest fokusowalnym regionem (strzałki, PageUp/Down),
 * przyciski dają alternatywę dla gestu, a licznik informuje o pozycji.
 * Samo przewijanie jest natywne — bez przechwytywania kółka myszy.
 */
export function PortfolioStrip() {
  const reducedMotion = useReducedMotion()
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const measure = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const max = scroller.scrollWidth - scroller.clientWidth
    const scrollable = max > 8
    setProgress(scrollable ? scroller.scrollLeft / max : 1)

    // Na samym końcu ostatni kafelek nie dosunie się już do lewej krawędzi —
    // licznik musi wtedy pokazać ostatnią pozycję, a nie przedostatnią.
    if (scrollable && scroller.scrollLeft >= max - 2) {
      setIndex(scroller.children.length - 1)
      return
    }

    // Pozycje liczymy względem samego pasa (getBoundingClientRect), nie przez
    // offsetLeft — ten jest liczony do najbliższego pozycjonowanego przodka,
    // czyli zawierałby też marginesy strony.
    const origin = scroller.getBoundingClientRect().left
    const items = Array.from(scroller.children) as HTMLElement[]
    let nearest = 0
    let smallest = Number.POSITIVE_INFINITY
    items.forEach((item, i) => {
      const distance = Math.abs(item.getBoundingClientRect().left - origin)
      if (distance < smallest) {
        smallest = distance
        nearest = i
      }
    })
    setIndex(nearest)
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    measure()
    scroller.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      scroller.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [measure])

  const go = (direction: -1 | 1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const target = scroller.children[index + direction] as HTMLElement | undefined
    if (!target) return
    const delta =
      target.getBoundingClientRect().left - scroller.getBoundingClientRect().left
    scroller.scrollTo({
      left: scroller.scrollLeft + delta,
      behavior: reducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ul
        ref={scrollerRef}
        tabIndex={0}
        aria-label="Realizacje — galeria przewijana w poziomie"
        className="m3-strip"
      >
        {portfolio.map((item) => (
          <li
            key={item.id}
            className="m3-shot group"
            style={{ "--ratio": ratioOf(item.aspect) } as CSSProperties}
          >
            <figure className="flex flex-col gap-3">
              <SmartVideo
                sources={[{ src: item.src, type: "video/mp4" }]}
                poster={item.poster}
                aspect={item.aspect}
                label={item.title}
                sizes="(min-width: 1024px) 40vw, 86vw"
                className="h-[var(--m3-shot-h)] w-full"
                mediaClassName="transition-[scale,filter] duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
              />
              <figcaption className="m3-caption">
                <h3>{item.title}</h3>
                <span>{item.category}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        <p className="m3-label m3-num shrink-0" aria-live="polite">
          {pad(index + 1)} <span className="text-muted-foreground/50">/</span>{" "}
          {pad(portfolio.length)}
        </p>
        <div className="h-px flex-1 bg-border" aria-hidden="true">
          <div
            className="h-full origin-left bg-foreground transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${Math.max(progress, 0.02)})` }}
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-none"
            onClick={() => go(-1)}
            disabled={progress <= 0.001}
            aria-label="Poprzednia realizacja"
          >
            <ArrowLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-none"
            onClick={() => go(1)}
            disabled={progress >= 0.999}
            aria-label="Następna realizacja"
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
