"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { SearchIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import { Kbd, KbdGroup } from "@/app/main-page/_components/ui/kbd"
import type { SearchGroup } from "@/app/main-page/_lib/types"
import type { SearchLabels } from "./search-dialog"

const loadDialog = () => import("./search-dialog")
/** Okno z `cmdk` i `vaul` dochodzi dopiero przy pierwszej potrzebie — nie obciąża wejścia strony. */
const SearchDialog = dynamic(loadDialog, { ssr: false })

/**
 * Skrót: ⌘K na urządzeniach Apple, Ctrl+K gdzie indziej — wybiera atrybut
 * `data-os` na `<html>` (skrypt przed pierwszym malowaniem), bez podmiany.
 */
function Shortcut() {
  return (
    <KbdGroup className="hidden text-muted-foreground sm:inline-flex">
      <Kbd>
        <span className="in-data-[os=other]:hidden">⌘</span>
        <span className="hidden in-data-[os=other]:inline">Ctrl</span>
      </Kbd>
      <span aria-hidden="true" className="hidden text-[0.625rem] in-data-[os=other]:inline">
        +
      </span>
      <Kbd>K</Kbd>
    </KbdGroup>
  )
}

/**
 * Przycisk wyszukiwarki w nagłówku i skrót klawiszowy. Na telefonie sama ikona.
 * Kod okna pobiera się przy najechaniu albo fokusie, najpóźniej przy otwarciu.
 */
export function SearchMenu({
  groups,
  labels,
  email,
}: {
  groups: readonly SearchGroup[]
  labels: SearchLabels
  email: string
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const button = useRef<HTMLButtonElement>(null)

  const show = (next: boolean) => {
    if (next) setMounted(true)
    setOpen(next)
  }

  useEffect(() => {
    // Na Apple tylko ⌘K: Ctrl+K w polu tekstowym usuwa tam do końca wiersza.
    const apple = document.documentElement.dataset.os === "apple"
    const onKeyDown = (event: KeyboardEvent) => {
      // `key` bywa pusty (np. wybór podpowiedzi autouzupełniania w formularzu).
      if (event.key?.toLowerCase() !== "k" || !(apple ? event.metaKey : event.ctrlKey)) return
      event.preventDefault()
      setMounted(true)
      setOpen((value) => !value)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <Button
        ref={button}
        variant="secondary"
        onClick={() => show(true)}
        onPointerEnter={() => void loadDialog()}
        onFocus={() => void loadDialog()}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+K Control+K"
        className="size-9 px-0 text-muted-foreground sm:w-auto sm:gap-2 sm:ps-3 sm:pe-1.5"
      >
        <SearchIcon />
        <span className="sr-only sm:not-sr-only">{labels.search}</span>
        <Shortcut />
      </Button>
      {mounted && (
        <SearchDialog
          open={open}
          onOpenChange={show}
          groups={groups}
          labels={labels}
          email={email}
          trigger={button}
        />
      )}
    </>
  )
}
