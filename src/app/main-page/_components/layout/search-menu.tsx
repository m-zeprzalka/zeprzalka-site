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

/** Skrót: ⌘ na urządzeniach Apple, Ctrl gdzie indziej — wybiera atrybut `data-os` na `<html>`. */
function ModifierKey() {
  return (
    <Kbd>
      <span className="in-data-[os=other]:hidden">⌘</span>
      <span className="hidden in-data-[os=other]:inline">Ctrl</span>
    </Kbd>
  )
}

/**
 * Przycisk wyszukiwarki ⌘K w nagłówku i skrót klawiszowy. Kod okna pobiera
 * się przy najechaniu albo fokusie na przycisku, a najpóźniej przy otwarciu.
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return
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
        size="sm"
        onClick={() => show(true)}
        onPointerEnter={() => void loadDialog()}
        onFocus={() => void loadDialog()}
        aria-keyshortcuts="Meta+K Control+K"
        className="h-9 gap-2 pr-1.5 pl-3 text-muted-foreground"
      >
        <SearchIcon />
        <span className="sr-only sm:not-sr-only">{labels.search}</span>
        <KbdGroup className="hidden sm:inline-flex">
          <ModifierKey />
          <Kbd>K</Kbd>
        </KbdGroup>
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
