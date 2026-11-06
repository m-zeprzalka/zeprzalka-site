import { PeekProvider } from "@/app/main-page/_components/peek/peek-context"
import { PeekStage } from "@/app/main-page/_components/peek/peek-stage"
import { PeekTrigger } from "@/app/main-page/_components/peek/peek-trigger"
import type { Peek } from "@/app/main-page/_lib/types"

const PEEKS: Record<string, Peek> = {
  demo: {
    title: "Karta podglądu",
    body: "Desktop z myszą: prawy tor, tylko na czas najechania. Dotyk: popover pod frazą.",
    media: [{ src: "/portfolio/prfct.webp", alt: "prfct.dev", width: 1200, height: 750 }],
  },
}

export function PeekTriggerExample() {
  return (
    <PeekProvider peeks={PEEKS}>
      <p className="text-2xl font-medium tracking-tight text-muted-foreground">
        Tekst z <PeekTrigger id="demo">frazą</PeekTrigger> i{" "}
        <PeekTrigger id="demo" variant="quiet">
          podpisem
        </PeekTrigger>
        .
      </p>
      <PeekStage />
    </PeekProvider>
  )
}
