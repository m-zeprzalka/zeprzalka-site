import Link from "next/link"
import { LogoGlyph } from "@/components/layout/LogoGlyph"
import { ROUTES, type Locale } from "@/i18n/config"

/** Znak serwisu: zmienny sygnet + nazwa domeny. Kliencki jest tylko sygnet. */
export function Logo({ locale, onClick }: { locale: Locale; onClick?: () => void }) {
  return (
    <Link href={ROUTES.home[locale]} onClick={onClick} className="flex items-center gap-2 text-xl">
      <LogoGlyph />
      zeprzalka.com
    </Link>
  )
}
