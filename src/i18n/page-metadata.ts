/**
 * Metadane poszczególnych stron — jedno miejsce dla obu wersji językowych.
 *
 * Wszystkie strony przechodzą przez `buildMetadata`, które zwraca komplet:
 * tytuł, opis, `canonical`, `hreflang`, odnośnik do kanału RSS, kartę
 * Open Graph z adresem tej strony i kartę Twittera.
 *
 * Dlaczego jeden builder: Next scala metadane płytko. Strona, która podawała
 * własne `openGraph`, gubiła odziedziczony obrazek (stąd `/uslugi` i `/blog`
 * bez karty przy udostępnieniu), a strona, która `openGraph` nie podawała,
 * dziedziczyła `og:url` strony głównej (60 podstron „udostępniało" stronę
 * główną). Tak samo `alternates` strony nadpisywało odnośnik RSS z układu —
 * znacznik kanału był na jednej stronie na 232.
 *
 * Obrazki kart dostarczają pliki `opengraph-image.tsx` w segmentach tras.
 */
import type { Metadata } from "next"
import {
  OG_LOCALE,
  ROUTES,
  alternatesFor,
  blogPagePath,
  categoryPath,
  locales,
  otherLocale,
  postPath,
  tagPath,
  type Locale,
  type Localized,
  type RouteKey,
} from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"
import { getPages } from "@/i18n/content/pages"
import { fill } from "@/i18n/format"
import { translateCategorySlug, translatePostSlug, translateTagSlug } from "@/i18n/blog-map"
import { AUTHOR, absoluteUrl } from "@/lib/site"
import type { Post, Term } from "@/lib/posts"

/** Kategoria z mniejszą liczbą wpisów to „cienka" strona — bez indeksu. */
export const MIN_POSTS_TO_INDEX_CATEGORY = 2

interface PageMetaInput {
  title: string
  description: string
  /** Ta sama strona w obu językach; `null` = brak odpowiednika. */
  paths: Localized<string | null>
  ogDescription?: string
  /** `noindex, follow` — strona dostępna, ale poza wynikami wyszukiwania. */
  noindex?: boolean
  openGraph?: Partial<NonNullable<Metadata["openGraph"]>>
}

/**
 * Tytuł z doklejonym „| Michał Zeprzałka" mieści się w ~60 znakach, które
 * Google pokazuje w wynikach — dłuższy dostaje tytuł bez sufiksu, żeby
 * ucięcie nie zjadło jego końca.
 */
function pageTitle(locale: Locale, title: string): Metadata["title"] {
  const suffix = getMeta(locale).root.titleTemplate.replace("%s", "")
  return title.length + suffix.length > 60 ? { absolute: title } : title
}

/** Odnośnik do kanału RSS w `<head>` — na każdej stronie, w jej języku. */
export function feedAlternate(locale: Locale) {
  return {
    "application/rss+xml": [{ url: ROUTES.feed[locale], title: getMeta(locale).root.feedTitle }],
  }
}

/** Ta sama wartość dla każdego języka serwisu. */
function mapLocales<T>(fn: (locale: Locale) => T): Localized<T> {
  return Object.fromEntries(locales.map((locale) => [locale, fn(locale)])) as Record<Locale, T>
}

/**
 * `og:title` to sam tytuł strony, bez sufiksu marki — tak zaleca Open Graph,
 * a markę niesie `og:site_name`. Sufiks dostaje tylko `<title>`.
 */
function buildMetadata(locale: Locale, input: PageMetaInput): Metadata {
  const root = getMeta(locale).root
  const path = input.paths[locale]
  const ogTitle = input.title
  const ogDescription = input.ogDescription ?? input.description

  return {
    title: pageTitle(locale, input.title),
    description: input.description,
    alternates: {
      ...alternatesFor(locale, input.paths),
      types: feedAlternate(locale),
    },
    openGraph: {
      type: "website",
      siteName: root.siteName,
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[otherLocale(locale)],
      url: path ? absoluteUrl(path) : undefined,
      title: ogTitle,
      description: ogDescription,
      ...input.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

/** Strona z mapy `ROUTES` — ten sam adres w obu językach. */
function staticPage(
  locale: Locale,
  key: RouteKey,
  m: { title: string; description: string; ogDescription?: string }
): Metadata {
  return buildMetadata(locale, { ...m, paths: ROUTES[key] })
}

/**
 * Strona główna dziedziczy tytuł, opis i kartę Open Graph z układu (tam
 * `og:url` wskazuje właśnie ją) — dokłada tylko canonical, hreflang i RSS.
 */
export function homeMetadata(locale: Locale): Metadata {
  return {
    alternates: {
      ...alternatesFor(locale, ROUTES.home),
      types: feedAlternate(locale),
    },
  }
}

export const servicesMetadata = (locale: Locale) =>
  staticPage(locale, "services", getMeta(locale).services)

export const aboutMetadata = (locale: Locale) => staticPage(locale, "about", getMeta(locale).about)

export const contactMetadata = (locale: Locale) =>
  staticPage(locale, "contact", getMeta(locale).contact)

export const privacyMetadata = (locale: Locale) =>
  staticPage(locale, "privacy", getMeta(locale).privacy)

export const portfolioMetadata = (locale: Locale) =>
  staticPage(locale, "portfolio", getMeta(locale).portfolio)

export const categoriesMetadata = (locale: Locale) =>
  staticPage(locale, "categories", getMeta(locale).categories)

export const blogMetadata = (locale: Locale) => staticPage(locale, "blog", getMeta(locale).blog)

/**
 * Kolejna strona archiwum bloga. Canonical wskazuje ją samą (nie pierwszą
 * stronę) — tak zaleca Google: inaczej wpisy z dalszych stron tracą jedyną
 * ścieżkę linków z listy. `hreflang` powstaje tylko wtedy, gdy druga wersja
 * językowa ma stronę o tym samym numerze.
 */
export function blogPageMetadata(
  locale: Locale,
  page: number,
  pageCount: Localized<number>
): Metadata {
  const copy = getPages(locale).blog
  return buildMetadata(locale, {
    title: fill(copy.pageTitle, { current: page }),
    description: fill(copy.pageDescription, { current: page }),
    paths: mapLocales((other) => (page <= pageCount[other] ? blogPagePath(other, page) : null)),
  })
}

/** Buduje parę ścieżek na podstawie slugów w obu językach. */
function pathsFor(
  locale: Locale,
  slug: string,
  translate: (slug: string, from: Locale, to: Locale) => string | null,
  build: (locale: Locale, slug: string) => string
): Localized<string | null> {
  return mapLocales((other) => {
    if (other === locale) return build(locale, slug)
    const translated = translate(slug, locale, other)
    return translated ? build(other, translated) : null
  })
}

export function categoryMetadata(locale: Locale, term: Term): Metadata {
  const m = getMeta(locale).category
  return buildMetadata(locale, {
    title: fill(m.title, { name: term.label }),
    description: fill(m.description, { name: term.label }),
    paths: pathsFor(locale, term.slug, translateCategorySlug, categoryPath),
    noindex: term.posts.length < MIN_POSTS_TO_INDEX_CATEGORY,
  })
}

/**
 * Tagi są zawsze `noindex, follow`: to wąskie listy po kilka wpisów, które
 * powielają strony kategorii. Robot nadal przechodzi przez nie do wpisów.
 */
export function tagMetadata(locale: Locale, term: Term): Metadata {
  const m = getMeta(locale).tag
  return buildMetadata(locale, {
    title: fill(m.title, { name: term.label }),
    description: fill(m.description, { name: term.label }),
    paths: pathsFor(locale, term.slug, translateTagSlug, tagPath),
    noindex: true,
  })
}

/**
 * Metadane wpisu. Obrazu świadomie tu nie ma: kartę 1200×630 z tytułem
 * dostarcza plik `opengraph-image.tsx` obok trasy. Wcześniej jawne `images`
 * nadpisywały ją zdjęciem z frontmattera — w WebP albo SVG (część
 * komunikatorów ich nie pokazuje) i z fałszywie zadeklarowanym 1200×630.
 */
export function postMetadata(locale: Locale, post: Post | null): Metadata {
  if (!post) {
    return {}
  }

  const { frontmatter } = post

  return {
    ...buildMetadata(locale, {
      title: frontmatter.title,
      description: frontmatter.description,
      paths: pathsFor(locale, post.slug, translatePostSlug, postPath),
      openGraph: {
        type: "article",
        publishedTime: frontmatter.date,
        modifiedTime: frontmatter.updated || frontmatter.date,
        authors: [absoluteUrl(ROUTES.about[locale])],
        section: frontmatter.categories[0],
        tags: frontmatter.tags,
      },
    }),
    authors: [{ name: AUTHOR.name, url: absoluteUrl(ROUTES.about[locale]) }],
  }
}
