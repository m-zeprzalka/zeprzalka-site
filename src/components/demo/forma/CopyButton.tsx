"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

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
        "group fm-focus fm-press bg-fm-surface text-fm-ink shadow-fm-ring hover:bg-fm-fill inline-flex h-10 items-center gap-2.5 rounded-full ps-4 pe-3.5 text-sm font-medium transition-[background-color,scale]",
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
      <span aria-hidden="true" className="text-fm-ink-3 grid">
        <Copy
          className={cn(
            icon,
            "group-data-copied:scale-50 group-data-copied:opacity-0 group-data-copied:blur-[2px]"
          )}
        />
        <Check
          className={cn(
            icon,
            "text-fm-ink scale-50 opacity-0 blur-[2px] group-data-copied:scale-100 group-data-copied:opacity-100 group-data-copied:blur-none"
          )}
        />
      </span>
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  )
}
