"use client"

import { useEffect, useRef, useState, type ComponentProps } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { copyText } from "@/app/main-page/_lib/clipboard"
import { useTransientFlag } from "@/app/main-page/_lib/hooks"

/**
 * Blok kodu we wpisie: przewijany w poziomie (osiągalny z klawiatury) i z
 * przyciskiem kopiowania. Do schowka idzie `textContent`, więc znaczniki
 * kolorowania składni nie trafiają do kopii. Wygląd — `article.css`.
 */
export function CodeBlock({
  children,
  copyLabel,
  copiedLabel,
  regionLabel,
  ...props
}: ComponentProps<"pre"> & { copyLabel: string; copiedLabel: string; regionLabel: string }) {
  const [copied, confirm] = useTransientFlag(2000)
  const pre = useRef<HTMLPreElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  // Przystanek Tab tylko wtedy, gdy kod przewija się w poziomie (inaczej 17 pustych przystanków).
  const [scrolls, setScrolls] = useState(false)
  useEffect(() => {
    const box = frame.current
    if (!box) return
    const observer = new ResizeObserver(() => setScrolls(box.scrollWidth > box.clientWidth))
    observer.observe(box)
    return () => observer.disconnect()
  }, [])
  // Bez schowka (brak uprawnień, http) nic nie udajemy — przycisk po prostu nie potwierdza.
  const copy = () => void copyText(pre.current?.textContent ?? "").then((ok) => ok && confirm())

  return (
    <div className="code-block group relative">
      {/* `group`, nie `region`: kilka bloków nie mnoży jednakowych punktów orientacyjnych. */}
      <div
        ref={frame}
        role="group"
        aria-label={regionLabel}
        tabIndex={scrolls ? 0 : undefined}
        className="overflow-x-auto"
      >
        <pre ref={pre} {...props}>
          {children}
        </pre>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copyLabel}
        className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-lg border bg-background/80 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none pointer-coarse:opacity-100 [&_svg]:size-4"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      {/* Ekran zmienia tylko ikonę — potwierdzenie musi dotrzeć też do czytnika. */}
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  )
}
