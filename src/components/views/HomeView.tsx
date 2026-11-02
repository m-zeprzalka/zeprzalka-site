import { preload } from "react-dom"
import { Hero } from "@/components/home/Hero"
import { Skills } from "@/components/home/Skills"
import { Gallery } from "@/components/home/Gallery"
import { Contact } from "@/components/home/Contact"
import { BlogPreview } from "@/components/home/BlogPreview"
import { JsonLd } from "@/components/JsonLd"
import { graph, personSchema, websiteSchema } from "@/lib/schema"
import type { Locale } from "@/i18n/config"

/**
 * Strona główna — jeden układ dla obu wersji językowych. Wygląd jest
 * dokładnie ten sam co przed wprowadzeniem angielskiego; zmieniło się
 * wyłącznie to, skąd bierze się tekst.
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
      <Gallery locale={locale} />
      <BlogPreview locale={locale} />
      <Contact locale={locale} />
    </>
  )
}
