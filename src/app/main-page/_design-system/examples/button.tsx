import Link from "next/link"
import { LinkArrow } from "@/app/main-page/_components/page/link-arrow"
import { Button } from "@/app/main-page/_components/ui/button"
import { pageHref } from "@/app/main-page/_lib/routes"

export function ButtonExample() {
  return (
    <>
      {/* Link to link: `asChild` oddaje wygląd przycisku elementowi `<a>` (Button jest serwerowy),
          a ↗ (`LinkArrow`) wychyla się, gdy najedziesz na link z `group/link`. */}
      <Button asChild className="group/link">
        <Link href={pageHref("contact", "pl")}>
          Default
          <LinkArrow />
        </Link>
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
      <Button disabled>Disabled</Button>
    </>
  )
}
