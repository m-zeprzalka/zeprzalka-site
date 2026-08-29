/**
 * Metadane poszczególnych stron — jedno miejsce dla obu wersji językowych.
 *
 * Każda funkcja zwraca komplet: tytuł, opis, `canonical` i `hreflang`.
 * Trasy z segmentem (wpis, kategoria, tag) liczą odpowiednik w drugim języku
 * z mapy w `src/i18n/blog-map.ts`; brak tłumaczenia oznacza po prostu brak
 * znacznika `alternate` dla tego języka, a nie link prowadzący donikąd.
 */
import type { Metadata } from "next"
import {
  ROUTES,
  alternatesFor,
  categoryPath,
  locales,
  postPath,
  tagPath,
  type Locale,
  type Localized,
} from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"
import { fill } from "@/i18n/content/common"
import {
  translateCategorySlug,
  translatePostSlug,
  translateTagSlug,
} from "@/i18n/blog-map"
import { pageAlternates } from "@/i18n/metadata"
import { AUTHOR, SITE_URL, absoluteUrl } from "@/lib/site"
import type { Post } from "@/lib/posts"

export { pageAlternates }

export function servicesMetadata(locale: Locale): Metadata {
  const m = getMeta(locale).services
  return {
    title: m.title,
    description: m.description,
    alternates: pageAlternates(locale, "services"),
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      type: "website",
    },
  }
}

export function aboutMetadata(locale: Locale): Metadata {
  const m = getMeta(locale).about
  return {
    title: m.title,
    description: m.description,
    alternates: pageAlternates(locale, "about"),
  }
}

export function contactMetadata(locale: Locale): Metadata {
  const m = getMeta(locale).contact
  return {
    title: m.title,
    description: m.description,
    alternates: pageAlternates(locale, "contact"),
  }
}

export function portfolioMetadata(locale: Locale): Metadata {
  const m = getMeta(locale).portfolio
  return {
    title: m.title,
    description: m.description,
    alternates: pageAlternates(locale, "portfolio"),
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      type: "website",
    },
  }
}

export function blogMetadata(locale: Locale): Metadata {
  const m = getMeta(locale).blog
  return {
    title: m.title,
    description: m.description,
    // Paginacja przez ?page= — canonical zawsze wskazuje na indeks bloga
    alternates: pageAlternates(locale, "blog"),
    openGraph: {
      title: m.ogTitle,
      description: m.description,
      type: "website",
    },
  }
}

export function categoriesMetadata(locale: Locale): Metadata {
  const m = getMeta(locale).categories
  return {
    title: m.title,
    description: m.description,
    alternates: pageAlternates(locale, "categories"),
  }
}

/** Buduje parę ścieżek na podstawie slugów w obu językach. */
function pathsFor(
  locale: Locale,
  slug: string,
  translate: (slug: string, from: Locale, to: Locale) => string | null,
  build: (locale: Locale, slug: string) => string
): Localized<string | null> {
  const result = {} as Record<Locale, string | null>
  for (const other of locales) {
    if (other === locale) {
      result[other] = build(locale, slug)
      continue
    }
    const translated = translate(slug, locale, other)
    result[other] = translated ? build(other, translated) : null
  }
  return result
}

export function categoryMetadata(locale: Locale, slug: string, label: string): Metadata {
  const m = getMeta(locale).category
  return {
    title: fill(m.title, { name: label }),
    description: fill(m.description, { name: label }),
    alternates: alternatesFor(
      locale,
      pathsFor(locale, slug, translateCategorySlug, categoryPath)
    ),
  }
}

export function tagMetadata(locale: Locale, slug: string, label: string): Metadata {
  const m = getMeta(locale).tag
  return {
    title: fill(m.title, { name: label }),
    description: fill(m.description, { name: label }),
    alternates: alternatesFor(
      locale,
      pathsFor(locale, slug, translateTagSlug, tagPath)
    ),
  }
}

/** `canonical` i `hreflang` dla pojedynczego wpisu. */
export function postAlternates(locale: Locale, slug: string) {
  return alternatesFor(
    locale,
    pathsFor(locale, slug, translatePostSlug, postPath)
  )
}

/**
 * Metadane wpisu. Obraz musi być adresem bezwzględnym — podgląd linku
 * w komunikatorze nie zna kontekstu strony i nie doklei domeny sam.
 */
export function postMetadata(locale: Locale, post: Post | null): Metadata {
  if (!post) {
    return {}
  }

  const imageUrl = post.frontmatter.image
    ? post.frontmatter.image.startsWith("http")
      ? post.frontmatter.image
      : `${SITE_URL}${post.frontmatter.image}`
    : `${SITE_URL}/avatar.png`

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: postAlternates(locale, post.slug),
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      url: absoluteUrl(postPath(locale, post.slug)),
      publishedTime: post.frontmatter.date,
      authors: [AUTHOR.name],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [imageUrl],
    },
  }
}

export { ROUTES }
