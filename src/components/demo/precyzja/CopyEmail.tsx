"use client"

import { useState } from "react"

/** Adres e-mail kopiowany jednym kliknięciem; link mailto zostaje obok. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <span className="pz-copy">
      <a href={`mailto:${email}`} className="pz-link">
        {email}
      </a>
      <button
        type="button"
        className="pz-copy__btn"
        onClick={async () => {
          await navigator.clipboard.writeText(email)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        }}
      >
        {copied ? "Skopiowano" : "Kopiuj"}
      </button>
      <span className="sr-only" role="status">
        {copied ? "Adres skopiowany do schowka" : ""}
      </span>
    </span>
  )
}
