import { Pager } from "@/app/main-page/_components/page/pager"
import { blogPageHref } from "@/app/main-page/_lib/routes"

/** Strony archiwum: pierwsza, ostatnia i sąsiedzi bieżącej, w lukach wielokropek. */
export function PagerExample() {
  return (
    <Pager
      current={3}
      total={6}
      href={(page) => blogPageHref("pl", page)}
      labels={{ aria: "Strony archiwum (przykład)", previous: "Poprzednia", next: "Następna" }}
    />
  )
}
