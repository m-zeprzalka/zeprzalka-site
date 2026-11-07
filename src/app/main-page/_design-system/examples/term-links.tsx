import { TermLinks } from "@/app/main-page/_components/page/term-links"
import { categoryHref, tagHref } from "@/app/main-page/_lib/routes"

export function TermLinksExample() {
  return (
    <div className="grid gap-4">
      <TermLinks
        label="Kategorie"
        terms={[
          { label: "AI", href: categoryHref("pl", "ai"), count: 11 },
          { label: "Next.js", href: categoryHref("pl", "next.js"), count: 10 },
          { label: "Design", href: categoryHref("pl", "design"), count: 4 },
        ]}
      />
      <TermLinks variant="outline" terms={[{ label: "#Kurs", href: tagHref("pl", "kurs") }]} />
    </div>
  )
}
