"use client"

import { useEffect, useRef, useState, type ComponentProps } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

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
  const [copied, setCopied] = useState(false)
  const pre = useRef<HTMLPreElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = () =>
    navigator.clipboard?.writeText(pre.current?.textContent ?? "").then(
      () => {
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), 2000)
      },
      () => {}
    )

  return (
    <div className="code-block group relative">
      {/* `group`, nie `region`: kilka bloków nie mnoży jednakowych punktów orientacyjnych. */}
      <div role="group" aria-label={regionLabel} tabIndex={0} className="overflow-x-auto">
        <pre ref={pre} {...props}>
          {children}
        </pre>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copyLabel}
        className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-lg border bg-background/80 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none pointer-coarse:opacity-100 [&_svg]:size-4"
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
