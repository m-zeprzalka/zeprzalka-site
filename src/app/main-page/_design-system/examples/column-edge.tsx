import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { INDEX_ROW } from "@/app/main-page/_components/page/index-row"
import { Button } from "@/app/main-page/_components/ui/button"
import { pageHref } from "@/app/main-page/_lib/routes"

export function ColumnEdgeExample() {
  return (
    // Przerywane linie = krawędzie kolumny (tylko w tym przykładzie).
    <div className="grid w-full gap-3 border-x border-dashed border-ring">
      <p>Tekst zaczyna się na krawędzi kolumny.</p>
      <Link href={pageHref("blog", "pl")} className={INDEX_ROW}>
        <span>Wiersz indeksu — tło wychodzi poza linię</span>
        <span className="shrink-0 text-sm text-muted-foreground tabular-nums">02.11</span>
      </Link>
      <Button asChild variant="ghost" size="sm" className="-ms-2.5 w-fit">
        <Link href={pageHref("portfolio", "pl")}>
          Przycisk z wcięciem
          <ArrowRightIcon />
        </Link>
      </Button>
    </div>
  )
}
