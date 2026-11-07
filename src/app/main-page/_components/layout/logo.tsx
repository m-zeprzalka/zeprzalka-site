import Link from "next/link"
import { GlyphText } from "@/app/main-page/_components/motion/glyph-text"
import { LogoMark } from "./logo-mark"

/**
 * Znak serwisu: zmienny sygnet + domena. Najechanie puszcza szum sygnetu i falę
 * znaków przez domenę, litera po literze. Rysunek zaczyna się na linii kolumny;
 * większe pole trafienia daje pseudo-element.
 */
export function Logo({ domain, href }: { domain: string; href: string }) {
  return (
    <Link
      href={href}
      // Bez prefetchu: logo jest na każdej stronie, a start pobierałby sam siebie (ok. 21 KB).
      prefetch={false}
      className="relative flex items-center gap-1.5 rounded-full text-base font-medium tracking-tight whitespace-nowrap outline-none after:absolute after:-inset-x-2 after:-inset-y-3 focus-visible:ring-[3px] focus-visible:ring-ring min-[22.5rem]:text-lg"
    >
      <LogoMark />
      <GlyphText text={domain} mode="wave" />
    </Link>
  )
}
