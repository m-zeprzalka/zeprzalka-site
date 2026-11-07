"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import dynamic from "next/dynamic"
import { SearchIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import { Kbd, KbdGroup } from "@/app/main-page/_components/ui/kbd"
import { useTransientFlag } from "@/app/main-page/_lib/hooks"
import type { SearchGroup } from "@/app/main-page/_lib/types"
import type { Locale } from "@/i18n/config"
import type { SearchLabels } from "./search-dialog"

const loadDialog = () => import("./search-dialog")
const noSubscription = () => () => {}
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
  homeHref,
  locale,
}: {
  groups: readonly SearchGroup[]
  labels: SearchLabels
  email: string
  homeHref: string
  locale: Locale
}) {
  const [open, setOpen] = useState(false)
  const [copied, confirmCopied] = useTransientFlag(1600)
  // Skrót, który na tej platformie naprawdę działa (do hydratacji — oba).
  const shortcut = useSyncExternalStore(
    noSubscription,
    () => (document.documentElement.dataset.os === "apple" ? "Meta+K" : "Control+K"),
    () => "Meta+K Control+K"
  )
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
        aria-keyshortcuts={shortcut}
        className="relative size-9 px-0 text-muted-foreground after:absolute after:-inset-1 sm:w-auto sm:gap-2 sm:ps-3 sm:pe-1.5"
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
          homeHref={homeHref}
          locale={locale}
          trigger={button}
          onCopied={confirmCopied}
        />
      )}
      <span role="status" className="sr-only">
        {copied ? labels.copied : ""}
      </span>
    </>
  )
}
