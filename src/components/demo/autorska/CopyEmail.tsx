"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "../forma/cn"

/** Pigułka z adresem: klik kopiuje (stan „Skopiowano” 1,8 s), ikona bez skoku szerokości. */
export function CopyEmail({
  email,
  label,
  copiedLabel,
  className,
}: {
  email: string
  label: string
  copiedLabel: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <button
      type="button"
      onClick={() => void navigator.clipboard?.writeText(email).then(() => setCopied(true))}
      className={cn(
        "inline-flex h-12 fm-press items-center gap-2.5 rounded-full ps-5 pe-4 text-[0.9375rem] font-medium fm-focus transition-[background-color,scale]",
        className
      )}
    >
      <span>{email}</span>
      <span className="grid size-4 place-items-center" aria-hidden="true">
        {copied ? <Check className="size-4" /> : <Copy className="size-4 opacity-70" />}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : label}
      </span>
    </button>
  )
}
