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
import "server-only"
import { DEFAULT_LOCALE, ROUTES, INTL_LOCALE, postPath, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"
import {
  AUTHOR,
  CONTACT_EMAIL,
  SAME_AS,
  SITE_DOMAIN,
  SITE_URL,
  absoluteImage,
  absoluteUrl,
} from "@/lib/site"
import type { Post } from "@/lib/posts"

type Schema = Record<string, unknown>

/** Identyfikatory encji — adres z fragmentem, stały między wdrożeniami. */
export const PERSON_ID = `${SITE_URL}/#person`

/**
 * Jeden adres osoby niezależnie od języka strony — encja jest jedna. Angielski
 * profil wskazuje `ProfilePage` na `/en/about` (`about-page.tsx`).
 */
const PERSON_URL = absoluteUrl(ROUTES.about[DEFAULT_LOCALE])

function websiteId(locale: Locale): string {
  return `${absoluteUrl(ROUTES.home[locale])}#website`
}

/** Odwołanie do autora z innych encji: identyfikator plus minimum pól. */
const PERSON_REF: Schema = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: AUTHOR.name,
  url: PERSON_URL,
}

/** Pełny opis autora — publikowany na stronie głównej i na „o mnie". */
export function personSchema(locale: Locale): Schema {
  const about = getPages(locale).about

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle[locale],
    description: AUTHOR.bio[locale],
    url: PERSON_URL,
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
    // Ta sama nazwa co sufiks tytułów — Google wybiera z niej nazwę witryny w wynikach.
    name: AUTHOR.name,
    alternateName: SITE_DOMAIN,
    url: absoluteUrl(ROUTES.home[locale]),
    inLanguage: INTL_LOCALE[locale],
    publisher: { "@id": PERSON_ID },
  }
}

/**
 * Okruszki: strona główna dokładana automatycznie, ostatni element to
 * bieżąca strona.
 */
export function breadcrumbSchema(locale: Locale, items: { name: string; path: string }[]): Schema {
  const trail = [{ name: getCommon(locale).nav.home, path: ROUTES.home[locale] }, ...items]
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
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
    inLanguage: INTL_LOCALE[locale],
    wordCount: post.wordCount,
    articleSection: frontmatter.categories[0],
    keywords: frontmatter.tags.join(", ") || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": websiteId(locale) },
    author: PERSON_REF,
    publisher: PERSON_REF,
  }
}

/**
 * Strona-lista albo strona kontaktu: typ schema.org, adres, nazwa i opis
 * z metadanych strony, przynależność do witryny i autora.
 */
export function webPageSchema(
  type: "CollectionPage" | "ContactPage",
  locale: Locale,
  page: { name: string; description: string; path: string },
  extra: Schema = {}
): Schema {
  const url = absoluteUrl(page.path)
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: page.name,
    description: page.description,
    inLanguage: INTL_LOCALE[locale],
    isPartOf: { "@id": websiteId(locale) },
    ...extra,
  }
}

/** Indeks bloga: `Blog` z odwołaniami do wpisów z bieżącej strony listy. */
export function blogSchema(
  locale: Locale,
  page: { name: string; description: string; path: string },
  posts: readonly Post[]
): Schema {
  const url = absoluteUrl(page.path)
  return {
    "@type": "Blog",
    "@id": `${absoluteUrl(ROUTES.blog[locale])}#blog`,
    url,
    name: page.name,
    description: page.description,
    inLanguage: INTL_LOCALE[locale],
    isPartOf: { "@id": websiteId(locale) },
    publisher: { "@id": PERSON_ID },
    blogPost: posts.map((post) => ({
      "@id": `${absoluteUrl(postPath(locale, post.slug))}#article`,
    })),
  }
}

/** Kilka encji w jednym bloku — jeden `<script>` zamiast kilku. */
export function graph(...nodes: Schema[]): Schema {
  return { "@context": "https://schema.org", "@graph": nodes }
}
