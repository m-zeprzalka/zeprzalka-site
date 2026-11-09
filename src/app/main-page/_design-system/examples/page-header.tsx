import { PageHeader } from "@/app/main-page/_components/page/page-header"
import { breadcrumb } from "@/app/main-page/_lib/content/pages"

/** Nagłówek tej strony — każda podstrona zaczyna się tak samo. */
export function PageHeaderExample() {
  return (
    <PageHeader
      breadcrumb={breadcrumb("pl", "Design system")}
      title="Design system"
      lead="shadcn i Tailwind na własnych tokenach. Co jest, gdzie mieszka i jak tego używać."
    >
      {/* `children` — dodatki pod tytułem: dane wpisu, kategorie, działania. */}
      <p className="text-sm text-muted-foreground">
        Strona wewnętrzna: tylko po polsku, poza wyszukiwarkami.
      </p>
    </PageHeader>
  )
}
