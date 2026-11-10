import { Pager } from "@/components/page/pager"
import { getBlogPageCount } from "@/lib/blog-pages"
import { blogPageHref } from "@/lib/routes"

/**
 * Strony archiwum: pierwsza, ostatnia i sąsiedzi bieżącej, w lukach wielokropek. Sześć stron
 * pokazuje wielokropek; strony spoza archiwum prowadzą do samego przykładu (bez pobierania
 * nieistniejących adresów).
 */
export function PagerExample() {
  // Strony, które archiwum naprawdę ma — dalsze prowadzą do samego przykładu.
  const pages = getBlogPageCount("pl")
  return (
    <div id="przyklad-stron" className="w-full">
      <Pager
        current={3}
        total={6}
        href={(page) => (page <= pages ? blogPageHref("pl", page) : "#przyklad-stron")}
        labels={{ aria: "Strony archiwum (przykład)", previous: "Poprzednia", next: "Następna" }}
      />
    </div>
  )
}
