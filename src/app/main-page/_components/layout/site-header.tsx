import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { LanguageSwitch } from "./language-switch"
import { Logo } from "./logo"
import { SearchMenu } from "./search-menu"
import { ThemeToggle } from "./theme-toggle"

/**
 * Rozmycie pod nagłówkiem: trzy warstwy o rosnącej sile, każda ucięta maską
 * wyżej — najmocniej u góry, łagodnie wygaszane w dół. Bez koloru i bez kreski.
 */
const BLUR_LAYERS = [
  "backdrop-blur-[2px] mask-[linear-gradient(to_bottom,black_40%,transparent)]",
  "backdrop-blur-sm mask-[linear-gradient(to_bottom,black_30%,transparent_75%)]",
  "backdrop-blur-lg mask-[linear-gradient(to_bottom,black_15%,transparent_55%)]",
]

/**
 * Nagłówek na osi kolumny: rysunek logo zaczyna się, a ikona motywu kończy
 * dokładnie na jej krawędziach (ujemny margines = wcięcie ikony w przycisku).
 * Wchodzi pierwszy w „harmonijce” startu.
 */
export function SiteHeader({
  domain,
  homeHref,
  themeLabel,
  language,
  search,
}: {
  domain: string
  homeHref: string
  themeLabel: string
  language: ComponentProps<typeof LanguageSwitch>
  search: ComponentProps<typeof SearchMenu>
}) {
  return (
    <header className="sticky top-0 z-40 motion-safe:animate-enter-down motion-safe:[animation-delay:var(--enter-header)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24">
        {BLUR_LAYERS.map((layer) => (
          <div key={layer} className={cn("absolute inset-0", layer)} />
        ))}
      </div>
      {/* Przy 320 px rząd mieści się co do piksela (mniejszy odstęp i logo poniżej 360 px) —
          inaczej wystawałby poza kolumnę, a z nim pola dotyku przycisków (`after:`). */}
      <div className="relative column flex h-16 items-center justify-between gap-2 min-[22.5rem]:gap-3">
        <Logo domain={domain} href={homeHref} />
        <div className="-me-2.5 flex items-center gap-1 min-[22.5rem]:gap-1.5">
          <SearchMenu {...search} />
          <LanguageSwitch {...language} />
          <ThemeToggle label={themeLabel} />
        </div>
      </div>
    </header>
  )
}
