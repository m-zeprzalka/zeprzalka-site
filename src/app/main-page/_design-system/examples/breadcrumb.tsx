import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/main-page/_components/ui/breadcrumb"
import { pageHref } from "@/app/main-page/_lib/routes"

export function BreadcrumbExample() {
  return (
    <Breadcrumb aria-label="Okruszki (przykład)">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={pageHref("home", "pl")}>Start</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={pageHref("blog", "pl")}>Blog</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* Długi tytuł stoi w nagłówku w całości — w okruszkach wystarczy początek. */}
          <BreadcrumbPage className="max-w-[30ch] truncate text-muted-foreground">
            Tytuł wpisu, który bywa dłuższy niż miejsce w okruszkach
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
