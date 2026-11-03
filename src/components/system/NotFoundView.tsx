import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ROUTES, type Locale } from "@/i18n/config"
import { getSystem } from "@/i18n/content/system"

/** Strona 404 — jedna treść, dwa układy główne. */
export function NotFoundView({ locale }: { locale: Locale }) {
  const copy = getSystem(locale).notFound

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      {/* Jeden nagłówek H1; liczba 404 jest ozdobnikiem nad nim. */}
      <p
        aria-hidden="true"
        className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-6xl"
      >
        404
      </p>
      <h1 className="mb-6 text-2xl font-medium md:text-3xl">{copy.title}</h1>
      <p className="mb-8 max-w-md text-muted-foreground">{copy.description}</p>
      <Button asChild>
        <Link href={ROUTES.home[locale]}>{copy.cta}</Link>
      </Button>
    </div>
  )
}
