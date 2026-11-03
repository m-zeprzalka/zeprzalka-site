import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ROUTES, type Locale } from "@/i18n/config"
import { getSystem } from "@/i18n/content/system"

/** Strona 404 — jedna treść, dwa układy główne. */
export function NotFoundView({ locale }: { locale: Locale }) {
  const copy = getSystem(locale).notFound

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Jeden nagłówek H1; liczba 404 jest ozdobnikiem nad nim. */}
      <p aria-hidden="true" className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-primary">404</p>
      <h1 className="text-2xl md:text-3xl font-medium mb-6">{copy.title}</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        {copy.description}
      </p>
      <Button asChild>
        <Link href={ROUTES.home[locale]}>{copy.cta}</Link>
      </Button>
    </div>
  )
}
