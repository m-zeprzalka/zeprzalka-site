import { LanguageSwitch } from "@/app/main-page/_components/layout/language-switch"
import { Logo } from "@/app/main-page/_components/layout/logo"
import { ThemeToggle } from "@/app/main-page/_components/layout/theme-toggle"
import { pageHref } from "@/app/main-page/_lib/routes"

export function HeaderControlsExample() {
  return (
    // Rząd nagłówka bez wyszukiwarki: `SearchMenu` słucha ⌘K na całym dokumencie — jeden na stronę.
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <Logo domain="zeprzalka.com" href={pageHref("home", "pl")} />
      {/* Ujemny margines = wcięcie ikony: rysunek kończy się na krawędzi kolumny. */}
      <div className="-me-2.5 flex items-center gap-1.5">
        <LanguageSwitch label="Język (przykład)" locale="pl" fallback="/en" />
        <ThemeToggle label="Zmień motyw" />
      </div>
    </div>
  )
}
