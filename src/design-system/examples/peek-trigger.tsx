import { PeekTrigger } from "@/components/peek/peek-trigger"

/** Karty daje `PeekProvider`, a rysuje jeden `PeekStage` — oba raz na stronę (tu: `app/(pl)/design-system/page.tsx`). */
export function PeekTriggerExample() {
  return (
    <p className="text-2xl font-medium tracking-tight text-muted-foreground">
      Tekst z <PeekTrigger id="systems">frazą</PeekTrigger> i{" "}
      <PeekTrigger id="lectures" variant="quiet">
        podpisem
      </PeekTrigger>
      .
    </p>
  )
}
