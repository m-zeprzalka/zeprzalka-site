import { MetadataRoute } from "next"
import { getAllPosts, getAllCategorySlugs } from "@/lib/posts"
import { absoluteUrl } from "@/lib/site"
import {
  ROUTES,
  categoryPath,
  locales,
  postPath,
  type Locale,
} from "@/i18n/config"
import {
  translateCategorySlug,
  translatePostSlug,
} from "@/i18n/blog-map"

/**
 * Mapa strony obejmuje obie wersje językowe. Każdy wpis niesie `alternates`,
 * czyli te same pary co znaczniki `hreflang` w nagłówku — wyszukiwarka
 * dostaje sygnał dwa razy, z dwóch niezależnych źródeł.
 */
function languageAlternates(
  paths: Partial<Record<Locale, string | null>>
): MetadataRoute.Sitemap[number]["alternates"] {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    const path = paths[locale]
    if (path) languages[locale] = absoluteUrl(path)
  }
  return { languages }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    const posts = getAllPosts(locale)

    // Data ostatniego posta — stabilniejsza niż new Date() przy każdym buildzie
    const newestPostDate = posts.length
      ? new Date(posts[0].frontmatter.date)
      : new Date()

    const staticPages: {
      path: string
      alternates: Partial<Record<Locale, string | null>>
      lastModified?: Date
      changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
      priority: number
    }[] = [
      {
        path: ROUTES.home[locale],
        alternates: ROUTES.home,
        lastModified: newestPostDate,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        path: ROUTES.blog[locale],
        alternates: ROUTES.blog,
        lastModified: newestPostDate,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        // Strona ofertowa — najwyższa intencja zakupowa po stronie głównej.
        path: ROUTES.services[locale],
        alternates: ROUTES.services,
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        // Komplet dowodów kompetencji — wyszukiwarka powinna ją znać
        // niezależnie od tego, czy stoi w menu.
        path: ROUTES.portfolio[locale],
        alternates: ROUTES.portfolio,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        path: ROUTES.about[locale],
        alternates: ROUTES.about,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        path: ROUTES.contact[locale],
        alternates: ROUTES.contact,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        path: ROUTES.categories[locale],
        alternates: ROUTES.categories,
        lastModified: newestPostDate,
        changeFrequency: "weekly",
        priority: 0.5,
      },
    ]

    for (const page of staticPages) {
      entries.push({
        url: absoluteUrl(page.path),
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: languageAlternates(page.alternates),
      })
    }

    for (const post of posts) {
      const other = locale === "pl" ? "en" : "pl"
      const twin = translatePostSlug(post.slug, locale, other)
      entries.push({
        url: absoluteUrl(postPath(locale, post.slug)),
        lastModified: new Date(
          post.frontmatter.updated || post.frontmatter.date
        ),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: languageAlternates({
          [locale]: postPath(locale, post.slug),
          [other]: twin ? postPath(other, twin) : null,
        }),
      })
    }

    for (const slug of getAllCategorySlugs(locale)) {
      const other = locale === "pl" ? "en" : "pl"
      const twin = translateCategorySlug(slug, locale, other)
      entries.push({
        url: absoluteUrl(categoryPath(locale, slug)),
        lastModified: newestPostDate,
        changeFrequency: "weekly",
        priority: 0.5,
        alternates: languageAlternates({
          [locale]: categoryPath(locale, slug),
          [other]: twin ? categoryPath(other, twin) : null,
        }),
      })
    }
  }

  // Strony tagów celowo poza sitemapą: ~110 tagów przy 26 wpisach to zbyt
  // rozdrobnione (thin content) strony — pozostają dostępne przez linki.
  return entries
}

