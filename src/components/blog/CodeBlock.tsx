"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CodeBlock({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    // Wyciągnij tekst z children (może być zagnieżdżony w <code>)
    let codeText = ""
    if (typeof children === "string") {
      codeText = children
    } else if (children && typeof children === "object") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extractText = (node: any): string => {
        if (typeof node === "string") return node
        if (Array.isArray(node)) return node.map(extractText).join("")
        if (node?.props?.children) return extractText(node.props.children)
        return ""
      }
      codeText = extractText(children)
    }

    await navigator.clipboard.writeText(codeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-6">
      <pre
        {...props}
        className={`bg-white dark:bg-muted/50 rounded-lg p-4 overflow-x-auto border ${
          className || ""
        }`}
      >
        {children}
      </pre>
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
