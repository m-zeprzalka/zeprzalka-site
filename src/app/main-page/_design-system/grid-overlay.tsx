"use client"

import { useState } from "react"
import { Columns3Icon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"

/**
 * Siatka nałożona na stronę z prawdziwych klas (`column`, `rail`, `stage-track`, `top-rail`):
 * pokazuje układ dokładnie tak, jak liczy go CSS przy tej szerokości okna. Nakładka nie łapie
 * kliknięć; tory i linia `top-rail` są od 1280 px, jak w powłoce.
 */
export function GridOverlay() {
  const [shown, setShown] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={shown}
        onClick={() => setShown((value) => !value)}
        className="w-fit"
      >
        <Columns3Icon />
        Siatka na stronie
      </Button>
      {shown && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 text-xs">
          <div className="column h-full">
            <div className="h-full bg-foreground/5 outline-1 -outline-offset-1 outline-foreground/30 outline-dashed">
              <span className="block p-2 text-muted-foreground">kolumna</span>
            </div>
          </div>
          <div className="fixed inset-y-0 rail hidden bg-foreground/10 xl:block">
            <span className="block p-2 text-muted-foreground">tor · menu</span>
          </div>
          <div className="fixed inset-y-0 stage-track hidden bg-foreground/10 xl:block">
            <span className="block p-2 text-muted-foreground">tor · karta, spis</span>
          </div>
          <div className="fixed inset-x-0 top-16 h-px bg-foreground/30" />
          <div className="fixed inset-x-0 top-rail hidden h-px bg-foreground/30 xl:block" />
        </div>
      )}
    </>
  )
}
