import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import { pageHref } from "@/app/main-page/_lib/routes"

export function ButtonExample() {
  return (
    <>
      {/* Link to link: `asChild` oddaje wygląd przycisku elementowi `<a>` (Button jest serwerowy). */}
      <Button asChild>
        <Link href={pageHref("contact", "pl")}>
          Default
          <ArrowRightIcon />
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
