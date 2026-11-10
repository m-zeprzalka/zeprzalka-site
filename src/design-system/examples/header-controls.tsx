import { LanguageSwitch } from "@/components/layout/language-switch"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { mapLocales } from "@/i18n/alternates"
import { getBlogPageCount } from "@/lib/blog-pages"
import { pageHref } from "@/lib/routes"

export function HeaderControlsExample() {
  return (
    // Rząd nagłówka bez wyszukiwarki: `SearchMenu` słucha ⌘K na całym dokumencie — jeden na stronę.
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <Logo domain="zeprzalka.com" href={pageHref("home", "pl")} />
      {/* Ujemny margines = wcięcie ikony: rysunek kończy się na krawędzi kolumny. */}
      <div className="-me-2.5 flex items-center gap-1.5">
        {/* Adres drugiej wersji z bieżącej ścieżki: na tej stronie (bez odpowiednika) — start EN. */}
        <LanguageSwitch
          label="Język (przykład)"
          aria="Zmień język na angielski"
          locale="pl"
          pageCounts={mapLocales(getBlogPageCount)}
        />
        <ThemeToggle label="Zmień motyw" />
      </div>
    </div>
  )
}
