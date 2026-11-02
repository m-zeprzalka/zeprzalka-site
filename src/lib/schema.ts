/**
 * Dane strukturalne (schema.org) w jednym miejscu.
 *
 * Najważniejsza zasada: **autor istnieje raz**. Encja `Person` ma stały
 * identyfikator (`@id`), a strona główna, „o mnie", wpisy i oferta tylko się
 * do niego odwołują. Wcześniej każda strona budowała własną osobę z innym
 * zestawem pól (strona główna bez kompetencji, wpisy z adresem domeny zamiast
 * profilu), więc wyszukiwarka dostawała pięć częściowo sprzecznych opisów
 * zamiast jednego bytu, który da się skleić w panel wiedzy.
 */
import { ROUTES, BCP47, postPath, type Locale } from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"
import { getPages } from "@/i18n/content/pages"
import {
  AUTHOR,
  CONTACT_EMAIL,
  SAME_AS,
  SITE_URL,
  absoluteImage,
  absoluteUrl,
} from "@/lib/site"
import type { Post } from "@/lib/posts"

type Schema = Record<string, unknown>

/** Identyfikatory encji — adres z fragmentem, stały między wdrożeniami. */
export const PERSON_ID = `${SITE_URL}/#person`

export function websiteId(locale: Locale): string {
  return `${absoluteUrl(ROUTES.home[locale])}#website`
}

/** Odwołanie do autora z innych encji: identyfikator plus minimum pól. */
export function personRef(locale: Locale): Schema {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR.name,
    url: absoluteUrl(ROUTES.about[locale]),
  }
}

/** Pełny opis autora — publikowany na stronie głównej i na „o mnie". */
export function personSchema(locale: Locale): Schema {
  const about = getPages(locale).about

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.bio[locale],
    url: absoluteUrl(ROUTES.about[locale]),
    image: absoluteImage(AUTHOR.avatar),
    email: `mailto:${CONTACT_EMAIL}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: about.addressLocality,
      addressCountry: "PL",
    },
    knowsAbout: about.knowsAbout,
    alumniOf: about.education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.school,
    })),
    sameAs: SAME_AS,
  }
}

export function websiteSchema(locale: Locale): Schema {
  return {
    "@type": "WebSite",
    "@id": websiteId(locale),
    name: getMeta(locale).root.titleDefault,
    url: absoluteUrl(ROUTES.home[locale]),
    inLanguage: BCP47[locale],
    publisher: { "@id": PERSON_ID },
  }
}

/** Okruszki: zawsze od strony głównej, ostatni element to bieżąca strona. */
export function breadcrumbSchema(
  items: { name: string; path: string }[]
): Schema {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function blogPostingSchema(post: Post): Schema {
  const { locale, frontmatter } = post
  const url = absoluteUrl(postPath(locale, post.slug))

  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    headline: frontmatter.title,
    description: frontmatter.description,
    image: absoluteImage(frontmatter.image),
    datePublished: frontmatter.date,
    // Data aktualizacji, jeśli wpis był odświeżany — inaczej data publikacji.
    dateModified: frontmatter.updated || frontmatter.date,
    inLanguage: BCP47[locale],
    wordCount: post.wordCount,
    articleSection: frontmatter.categories[0],
    keywords: frontmatter.tags.join(", ") || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": websiteId(locale) },
    author: personRef(locale),
    publisher: personRef(locale),
  }
}

/** Kilka encji w jednym bloku — jeden `<script>` zamiast kilku. */
export function graph(...nodes: Schema[]): Schema {
  return { "@context": "https://schema.org", "@graph": nodes }
}
