"use client"

import { useState, useRef } from "react"
import { Check, Copy } from "lucide-react"

export function CodeBlock({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
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
    <div className="relative group my-6 rounded-lg border border-border overflow-hidden bg-white dark:bg-muted/50">
      <div className="overflow-x-auto">
        <pre
          ref={preRef}
          {...props}
          className={className || ""}
          style={{
            margin: 0,
            padding: "1.5rem", // 24px wszędzie - inline style ZAWSZE działa!
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.7",
          }}
        >
          {children}
        </pre>
      </div>

      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-background/80 border hover:bg-background transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Kopiuj kod"
        type="button"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
