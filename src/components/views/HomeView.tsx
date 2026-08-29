import { preload } from "react-dom"
import { Hero } from "@/components/home/Hero"
import { Skills } from "@/components/home/Skills"
import { Gallery } from "@/components/home/Gallery"
import { Contact } from "@/components/home/Contact"
import { BlogPreview } from "@/components/home/BlogPreview"
import { SAME_AS, SITE_URL, absoluteUrl } from "@/lib/site"
import { BCP47, ROUTES, type Locale } from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"

/**
 * Strona główna — jeden układ dla obu wersji językowych. Wygląd jest
 * dokładnie ten sam co przed wprowadzeniem angielskiego; zmieniło się
 * wyłącznie to, skąd bierze się tekst.
 */
export function HomeView({ locale }: { locale: Locale }) {
  const m = getMeta(locale)

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: m.root.titleDefault,
    url: absoluteUrl(ROUTES.home[locale]),
    inLanguage: BCP47[locale],
  }

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Michał Zeprzałka",
    jobTitle: "Digital Solutions Architect",
    url: SITE_URL,
    image: `${SITE_URL}/avatar.png`,
    sameAs: SAME_AS,
  }

  // Poster hero maluje się jako pierwszy duży element — niech pobiera się
  // równolegle z dokumentem, a nie dopiero po odnalezieniu w HTML.
  preload("/hero-poster.webp", { as: "image", fetchPriority: "high" })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero locale={locale} />
      <Skills locale={locale} />
      <Gallery locale={locale} />
      <BlogPreview locale={locale} />
      <Contact locale={locale} />
    </>
  )
}
