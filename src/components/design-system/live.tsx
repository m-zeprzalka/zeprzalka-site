"use client"

import {
  useCallback,
  useState,
  useSyncExternalStore,
  type ElementType,
} from "react"
import { cn } from "@/lib/utils"

/**
 * Pomiary wykonywane na wyrenderowanej stronie: rozmiary typografii i krój,
 * którego przeglądarka faktycznie użyła. Odczyty idą przez
 * `useSyncExternalStore` — styl wyliczony to stan spoza Reacta, więc go
 * subskrybujemy, zamiast kopiować do stanu w efekcie.
 *
 * Wartości tokenów czyta natomiast serwer, prosto z globals.css
 * (`design-system/tokens.ts`).
 */

/** Zmiana motywu = zmiana klasy na <html> (next-themes). */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

const serverFallback = () => ""

interface SpecimenProps {
  as?: ElementType
  /** Klasy użyte w serwisie — to one są dokumentacją, nie opis słowny. */
  className: string
  children: string
  /** Gdzie ten stopień skali występuje. */
  usage: string
}

/**
 * Wiersz skali typograficznej. Rozmiar, interlinia i grubość są mierzone na
 * wyrenderowanej próbce — także po zmianie szerokości okna, bo skala jest
 * responsywna.
 */
export function Specimen({
  as: Tag = "p",
  className,
  children,
  usage,
}: SpecimenProps) {
  const [node, setNode] = useState<HTMLElement | null>(null)

  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!node) return () => {}
      // ResizeObserver zgłasza też pomiar początkowy, więc nie potrzeba
      // osobnego odczytu przy montowaniu.
      const observer = new ResizeObserver(onChange)
      observer.observe(document.documentElement)
      return () => observer.disconnect()
    },
    [node]
  )

  const read = useCallback(() => {
    if (!node) return ""
    const style = getComputedStyle(node)
    const size = Math.round(parseFloat(style.fontSize) * 100) / 100
    const leading = parseFloat(style.lineHeight)
    const tracking = style.letterSpacing === "normal" ? "0" : style.letterSpacing
    return `${size}px / ${Number.isNaN(leading) ? "normal" : `${Math.round(leading * 100) / 100}px`} · ${style.fontWeight} · ${tracking}`
  }, [node])

  const spec = useSyncExternalStore(subscribe, read, serverFallback)

  return (
    <div className="flex flex-col gap-3 border-b py-6 last:border-b-0 lg:grid lg:grid-cols-12 lg:items-baseline lg:gap-8">
      <div className="lg:col-span-7">
        <Tag ref={setNode} className={cn(className, "text-balance")}>
          {children}
        </Tag>
      </div>
      <div className="flex flex-col gap-1.5 lg:col-span-5">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          {spec || "—"}
        </span>
        <code className="block overflow-x-auto rounded border bg-muted px-2 py-1 font-mono text-[0.6875rem] text-muted-foreground">
          {className}
        </code>
        <span className="text-xs text-muted-foreground">{usage}</span>
      </div>
    </div>
  )
}

/** Odczyt faktycznie renderowanego kroju — dla sekcji o typografii. */
export function ComputedFont({ selector }: { selector: string }) {
  const read = useCallback(() => {
    const element = document.querySelector(selector)
    return element ? getComputedStyle(element).fontFamily : ""
  }, [selector])

  const value = useSyncExternalStore(subscribeToTheme, read, serverFallback)

  return (
    <span className="font-mono text-xs text-muted-foreground">
      {value || "—"}
    </span>
  )
}
