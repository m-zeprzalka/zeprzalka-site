"use client"

import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import { copyText } from "@/app/main-page/_lib/clipboard"
import { useTransientFlag } from "@/app/main-page/_lib/hooks"

/** Jak długo przycisk pokazuje potwierdzenie po skopiowaniu. */
const CONFIRM_MS = 1600

/**
 * Adres e-mail jako przycisk kopiujący. Bez schowka (stara przeglądarka,
 * brak uprawnień, odmowa zapisu) działa zwykły link `mailto:`. Nazwa dla
 * czytnika zaczyna się od widocznego adresu (WCAG 2.5.3), dopisek mówi, co robi.
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
  const [copied, confirm] = useTransientFlag(CONFIRM_MS)

  return (
    <>
      <Button asChild variant="outline" size="lg" className={className}>
        <a
          href={`mailto:${email}`}
          onClick={(event) => {
            if (!navigator.clipboard) return
            event.preventDefault()
            const mailto = event.currentTarget.href
            void copyText(email).then((ok) => (ok ? confirm() : window.location.assign(mailto)))
          }}
        >
          {email}
          <span className="sr-only"> — {label}</span>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </a>
      </Button>
      {/* Poza linkiem: komunikat nie zmienia jego nazwy dostępnej. */}
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  )
}
