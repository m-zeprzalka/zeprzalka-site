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
import type { Locale } from "@/i18n/config"
import { mapLocales } from "@/i18n/alternates"
import { blogPageMetadata, categoryMetadata, postMetadata, tagMetadata } from "@/i18n/page-metadata"
import { getBlogPageCount } from "@/lib/blog-pages"
import { getPostBySlug, getTerm, type TaxonomyField } from "@/lib/posts"
import { archiveParams, postParams, readParam, termParams, type ParamsProps } from "@/routes/params"

/*
 * Przy `dynamicParams = false` Next wywołuje te funkcje wyłącznie dla adresów
 * z `generateStaticParams`, więc brak wpisu albo terminu to błąd danych —
 * `notFound()` zamiast pustych metadanych i typów z `null`.
 */

/** Wpis: `/blog/[slug]`, `/en/blog/[slug]`. */
export function postRoute(locale: Locale) {
  const postFor = async (props: ParamsProps<"slug">) =>
    getPostBySlug(locale, await readParam(props, "slug")) ?? notFound()

  return {
    generateStaticParams: () => postParams(locale),
    generateMetadata: async (props: ParamsProps<"slug">): Promise<Metadata> =>
      postMetadata(locale, await postFor(props)),
    Page: async (props: ParamsProps<"slug">) => (
      <PostView post={await postFor(props)} locale={locale} />
    ),
  }
}

/** Kategoria albo tag: `/blog/kategoria/[kategoria]`, `/en/blog/tag/[tag]`… */
export function taxonomyRoute<K extends string>(locale: Locale, field: TaxonomyField, key: K) {
  const termFor = async (props: ParamsProps<K>) =>
    getTerm(locale, field, await readParam(props, key)) ?? notFound()

  return {
    generateStaticParams: () => termParams(locale, field, key),
    generateMetadata: async (props: ParamsProps<K>): Promise<Metadata> => {
      const term = await termFor(props)
      return field === "categories" ? categoryMetadata(locale, term) : tagMetadata(locale, term)
    },
    Page: async (props: ParamsProps<K>) => (
      <TaxonomyView locale={locale} field={field} term={await termFor(props)} />
    ),
  }
}

/** Kolejne strony archiwum: `/blog/strona/[strona]`, `/en/blog/page/[page]`. */
export function blogArchiveRoute<K extends string>(locale: Locale, key: K) {
  const pageFor = async (props: ParamsProps<K>) => Number(await readParam(props, key))
  const pageCounts = () => mapLocales(getBlogPageCount)

  return {
    generateStaticParams: () => archiveParams(locale, key),
    generateMetadata: async (props: ParamsProps<K>): Promise<Metadata> =>
      blogPageMetadata(locale, await pageFor(props), pageCounts()),
    Page: async (props: ParamsProps<K>) => (
      <BlogIndexView locale={locale} page={await pageFor(props)} />
    ),
  }
}
