"use client"

import { useEffect, useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"

/** Jak długo przycisk pokazuje potwierdzenie po skopiowaniu. */
const CONFIRM_MS = 1600

/**
 * Adres e-mail jako przycisk kopiujący. Bez schowka (stara przeglądarka,
 * brak uprawnień) działa zwykły link `mailto:`.
 */
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
    const timer = setTimeout(() => setCopied(false), CONFIRM_MS)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <Button asChild variant="outline" size="lg" className={className}>
      <a
        href={`mailto:${email}`}
        aria-label={label}
        onClick={(event) => {
          if (!navigator.clipboard) return
          event.preventDefault()
          navigator.clipboard.writeText(email).then(() => setCopied(true))
        }}
      >
        {email}
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span aria-live="polite" className="sr-only">
          {copied ? copiedLabel : ""}
        </span>
      </a>
    </Button>
  )
}
