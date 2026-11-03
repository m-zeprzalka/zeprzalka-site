"use client"

import { useEffect, useRef, useState, type ComponentProps } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Blok kodu we wpisie: przewijany w poziomie (osiągalny z klawiatury) i z
 * przyciskiem kopiowania. Tekst do schowka pochodzi z `textContent`, więc
 * znaczniki kolorowania składni nie trafiają do kopii.
 */
export function CodeBlock({
  children,
  className,
  copyLabel,
  copiedLabel,
  regionLabel,
  ...props
}: ComponentProps<"pre"> & { copyLabel: string; copiedLabel: string; regionLabel: string }) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(preRef.current?.textContent ?? "")
    } catch {
      return // brak uprawnień albo niebezpieczny kontekst (http) — nic nie udajemy
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-border bg-white dark:bg-muted/50">
      <div className="overflow-x-auto" role="region" aria-label={regionLabel} tabIndex={0}>
        <pre
          ref={preRef}
          {...props}
          className={cn(className, "m-0! bg-transparent p-6! text-sm leading-relaxed")}
        >
          {children}
        </pre>
      </div>

      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 rounded-md border bg-background/80 p-2 opacity-0 transition-[opacity,background-color] group-hover:opacity-100 hover:bg-background focus:opacity-100 [@media(hover:none)]:opacity-100"
        aria-label={copyLabel}
        type="button"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </button>
      {/* Ekran nie zmienia się poza ikoną — potwierdzenie musi dotrzeć też do czytnika. */}
      <span className="sr-only" role="status">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  )
}
