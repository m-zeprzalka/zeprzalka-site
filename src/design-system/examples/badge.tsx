import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { categoryHref } from "@/lib/routes"

export function BadgeExample() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      {/* `md` — tagi kompetencji, umiejętności i plakietki-linki bloga. */}
      <Badge variant="secondary" size="md">
        Next.js
      </Badge>
      <Badge variant="outline" size="md">
        TypeScript
      </Badge>
      <Badge asChild variant="secondary" size="md">
        <Link href={categoryHref("pl", "ai")} prefetch={false}>
          AI — link
        </Link>
      </Badge>
    </>
  )
}
