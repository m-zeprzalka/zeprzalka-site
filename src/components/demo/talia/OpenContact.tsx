"use client"

import type { ComponentProps } from "react"
import { useTalia } from "./TaliaProvider"

/**
 * Link `mailto:`, który po hydratacji otwiera formularz (szufladę albo
 * dialog). Bez JS albo przed hydratacją działa jak zwykły adres e-mail.
 */
export function OpenContact({ onClick, ...props }: ComponentProps<"a">) {
  const { openContact } = useTalia()
  return (
    <a
      {...props}
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event)
        event.preventDefault()
        openContact()
      }}
    />
  )
}
