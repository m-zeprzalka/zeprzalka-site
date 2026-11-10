import Link from "next/link"
import { LinkArrow } from "@/components/page/link-arrow"
import { PageHeader } from "@/components/page/page-header"
import { Button } from "@/components/ui/button"
import { breadcrumb } from "@/lib/content/pages"
import { pageHref } from "@/lib/routes"
import type { Locale } from "@/i18n/config"
import { getSystem } from "@/i18n/content/system"

/** 404: ten sam nagłówek co podstrony i powrót na start. */
export function NotFoundPage({ locale }: { locale: Locale }) {
  const copy = getSystem(locale).notFound

  return (
    <PageHeader breadcrumb={breadcrumb(locale, "404")} title={copy.title} lead={copy.description}>
      <Button asChild size="lg" className="group/link">
        <Link href={pageHref("home", locale)}>
          {copy.cta}
          <LinkArrow />
        </Link>
      </Button>
    </PageHeader>
  )
}
