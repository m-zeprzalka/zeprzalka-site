/**
 * Trasy bloga z parametrem — jedna definicja dla obu wersji językowych.
 *
 * Pliki `page.tsx` w `src/app/(pl)` i `src/app/en` różniły się wyłącznie
 * literałem języka i nazwą parametru („kategoria” / „category”). Teraz każdy
 * z nich re-eksportuje gotowe funkcje z fabryki. Literałem w pliku trasy
 * zostaje tylko `dynamicParams` — Next czyta konfigurację segmentu statycznie
 * z kodu pliku, więc nie może przyjść z importu. `generateStaticParams`,
 * `generateMetadata` i komponent są wywoływane w czasie wykonania.
 */
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PostView } from "@/components/views/PostView"
import { TaxonomyView } from "@/components/views/TaxonomyView"
import { BlogIndexView } from "@/components/views/BlogIndexView"
import { locales, type Locale } from "@/i18n/config"
import {
  blogPageMetadata,
  categoryMetadata,
  postMetadata,
  tagMetadata,
} from "@/i18n/page-metadata"
import { getBlogPageCount } from "@/lib/blog-pages"
import { getAllPosts, getPostBySlug, getTerm, getTerms, type TaxonomyField } from "@/lib/posts"

type Props<K extends string> = { params: Promise<Record<K, string>> }

/** Wpis: `/blog/[slug]`, `/en/blog/[slug]`. */
export function postRoute(locale: Locale) {
  const postFor = async ({ params }: Props<"slug">) => getPostBySlug(locale, (await params).slug)

  return {
    generateStaticParams: () => getAllPosts(locale).map((post) => ({ slug: post.slug })),
    generateMetadata: async (props: Props<"slug">): Promise<Metadata> =>
      postMetadata(locale, await postFor(props)),
    Page: async (props: Props<"slug">) => {
      const post = await postFor(props)
      if (!post) notFound()
      return <PostView post={post} locale={locale} />
    },
  }
}

/** Kategoria albo tag: `/blog/kategoria/[kategoria]`, `/en/blog/tag/[tag]`… */
export function taxonomyRoute<K extends string>(locale: Locale, field: TaxonomyField, param: K) {
  const termFor = async ({ params }: Props<K>) => getTerm(locale, field, (await params)[param])

  return {
    generateStaticParams: () =>
      getTerms(locale, field).map((term) => ({ [param]: term.slug }) as Record<K, string>),
    generateMetadata: async (props: Props<K>): Promise<Metadata> => {
      const term = await termFor(props)
      if (!term) return {}
      return field === "categories" ? categoryMetadata(locale, term) : tagMetadata(locale, term)
    },
    Page: async (props: Props<K>) => {
      const term = await termFor(props)
      if (!term) notFound()
      return <TaxonomyView locale={locale} field={field} term={term} />
    },
  }
}

/** Kolejne strony archiwum: `/blog/strona/[strona]`, `/en/blog/page/[page]`. */
export function blogArchiveRoute<K extends string>(locale: Locale, param: K) {
  const pageFor = async ({ params }: Props<K>) => Number((await params)[param])
  const pageCounts = () =>
    Object.fromEntries(locales.map((other) => [other, getBlogPageCount(other)])) as Record<
      Locale,
      number
    >

  return {
    // Strona 1 to sam indeks bloga, więc archiwum zaczyna się od 2.
    generateStaticParams: () =>
      Array.from(
        { length: getBlogPageCount(locale) - 1 },
        (_, i) => ({ [param]: String(i + 2) }) as Record<K, string>
      ),
    generateMetadata: async (props: Props<K>): Promise<Metadata> =>
      blogPageMetadata(locale, await pageFor(props), pageCounts()),
    Page: async (props: Props<K>) => {
      const page = await pageFor(props)
      if (!Number.isInteger(page) || page < 2) notFound()
      return <BlogIndexView locale={locale} page={page} />
    },
  }
}
