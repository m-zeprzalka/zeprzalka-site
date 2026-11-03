"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "./cn"

/**
 * Kopiuje wartość (np. adres e-mail) jednym kliknięciem. Ikona przechodzi
 * w ptaszek (skala + rozmycie, 300 ms), a komunikat dla czytnika ekranu idzie
 * przez region `status`. Oba stany etykiety leżą w jednej komórce siatki,
 * więc szerokość przycisku nie skacze.
 */
export function CopyButton({
  value,
  label,
  copiedLabel,
  className,
}: {
  value: string
  label: string
  copiedLabel: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return // brak uprawnień albo niebezpieczny kontekst — zostaje zwykły tekst
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }

  const icon =
    "col-start-1 row-start-1 size-4 transition-[opacity,scale,filter] duration-300 ease-fm-snap"

  return (
    <button
      type="button"
      onClick={copy}
      data-copied={copied || undefined}
      className={cn(
        "group inline-flex h-10 fm-press items-center gap-2.5 rounded-full bg-fm-surface ps-4 pe-3.5 text-sm font-medium text-fm-ink shadow-fm-ring fm-focus transition-[background-color,scale] hover:bg-fm-fill",
        className
      )}
    >
      <span className="grid">
        <span className="col-start-1 row-start-1 transition-opacity duration-200 group-data-copied:opacity-0">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="col-start-1 row-start-1 opacity-0 transition-opacity duration-200 group-data-copied:opacity-100"
        >
          {copiedLabel}
        </span>
      </span>
      <span aria-hidden="true" className="grid text-fm-ink-3">
        <Copy
          className={cn(
            icon,
            "group-data-copied:scale-50 group-data-copied:opacity-0 group-data-copied:blur-[2px]"
          )}
        />
        <Check
          className={cn(
            icon,
            "scale-50 text-fm-ink opacity-0 blur-[2px] group-data-copied:scale-100 group-data-copied:opacity-100 group-data-copied:blur-none"
          )}
        />
      </span>
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  )
}
