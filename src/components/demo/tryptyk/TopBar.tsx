import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import { BarContact } from "./BarContact"
import { PaletteTrigger } from "./CommandPalette"
import { Logo } from "./Logo"
import { MenuSheet } from "./MenuSheet"
import type { NavItem } from "./types"

/**
 * Pasek poniżej 1280 px — lewe skrzydło zwinięte do jednej linii: znak,
 * wyszukiwanie i menu (arkusz). Lepki; po przewinięciu wokół niego wyrasta
 * kapsuła z rozmyciem tła (CSS `animation-timeline: scroll()`, zero JS).
 */
export function TopBar({
  person,
  status,
  nav,
  labels,
}: {
  person: {
    name: string
    email: string
    locality: string
    socials: readonly { label: string; url: string }[]
  }
  status: string
  nav: readonly NavItem[]
  labels: {
    contact: string
    cta: string
    search: string
    menu: string
    close: string
    sections: string
    copied: string
    theme: string
  }
}) {
  return (
    <header className="sticky top-0 z-40 xl:hidden">
      <div className="tk-bar relative flex h-(--tk-header) items-center justify-between gap-4">
        <span aria-hidden="true" className="tk-capsule" />
        <Logo name={person.name} className="relative" />
        <div className="relative -me-1.5 flex shrink-0 items-center gap-1 sm:me-0 sm:gap-1.5">
          <BarContact label={labels.contact} />
          <PaletteTrigger label={labels.search} variant="bar" />
          <ThemeSwitch label={labels.theme} className="hidden size-9 sm:grid" />
          <MenuSheet person={person} status={status} nav={nav} labels={labels} />
        </div>
      </div>
    </header>
  )
}
