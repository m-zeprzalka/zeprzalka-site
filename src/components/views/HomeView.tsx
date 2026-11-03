import { preload } from "react-dom"
import { Hero } from "@/components/home/Hero"
import { Skills } from "@/components/home/Skills"
import { PortfolioPreview } from "@/components/home/PortfolioPreview"
import { Contact } from "@/components/home/Contact"
import { BlogPreview } from "@/components/home/BlogPreview"
import { JsonLd } from "@/components/JsonLd"
import { graph, personSchema, websiteSchema } from "@/lib/schema"
import type { Locale } from "@/i18n/config"

/**
 * Strona główna — jeden układ dla obu wersji językowych. Wygląd jest
 * zamrożony: każda zmiana pliku z `src/components/home/*` musi przejść
 * porównanie zrzutów (`pnpm visual`).
 */
export function HomeView({ locale }: { locale: Locale }) {
  // Poster hero maluje się jako pierwszy duży element — niech pobiera się
  // równolegle z dokumentem, a nie dopiero po odnalezieniu w HTML.
  preload("/hero-poster.webp", { as: "image", fetchPriority: "high" })

  return (
    <>
      {/* Pełny opis autora i serwisu; pozostałe strony odwołują się do niego przez @id. */}
      <JsonLd data={graph(websiteSchema(locale), personSchema(locale))} />
      <Hero locale={locale} />
      <Skills locale={locale} />
      <PortfolioPreview locale={locale} />
      <BlogPreview locale={locale} />
      <Contact locale={locale} />
    </>
  )
}
