import { Pager } from "@/app/main-page/_components/page/pager"
import { blogPageHref } from "@/app/main-page/_lib/routes"

/**
 * Strony archiwum: pierwsza, ostatnia i sąsiedzi bieżącej, w lukach wielokropek. Sześć stron
 * pokazuje wielokropek, a archiwum ma ich mniej — strony spoza niego to kotwice (bez
 * pobierania nieistniejących adresów).
 */
export function PagerExample() {
  return (
    <Pager
      current={3}
      total={6}
      href={(page) => (page <= 3 ? blogPageHref("pl", page) : `#strona-${page}`)}
      labels={{ aria: "Strony archiwum (przykład)", previous: "Poprzednia", next: "Następna" }}
    />
  )
}
