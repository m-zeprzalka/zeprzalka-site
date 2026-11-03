"use client"

import { useState, useRef } from "react"
import { Check, Copy } from "lucide-react"

export function CodeBlock({
  children,
  className,
  copyLabel,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & { copyLabel: string }) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = async () => {
    // Użyj .textContent z DOM node, aby wyciągnąć czysty tekst bez tagów HTML
    if (preRef.current) {
      const codeText = preRef.current.textContent || ""
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-border bg-white dark:bg-muted/50">
      <div className="overflow-x-auto">
        <pre
          ref={preRef}
          {...props}
          className={`${className || ""} !m-0 bg-transparent !p-6 text-sm leading-relaxed`}
        >
          {children}
        </pre>
      </div>

      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 rounded-md border bg-background/80 p-2 opacity-0 transition-all group-hover:opacity-100 hover:bg-background focus:opacity-100 [@media(hover:none)]:opacity-100"
        aria-label={copyLabel}
        type="button"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </button>
      {/* Ekran nie zmienia się poza ikoną — potwierdzenie musi dotrzeć też do czytnika. */}
      <span className="sr-only" role="status">
        {copied ? "✓" : ""}
      </span>
    </div>
  )
}
