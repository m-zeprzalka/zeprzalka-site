/**
 * Trasy bloga z parametrem w podglądzie — te same fabryki co `src/routes/blog.tsx`
 * serwisu, z widokami nowej wersji. Literałem w pliku trasy zostaje tylko
 * `dynamicParams` (Next czyta konfigurację segmentu statycznie z kodu pliku).
 */
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogPage } from "@/app/main-page/_components/views/blog-page"
import { PostPage } from "@/app/main-page/_components/views/post-page"
import { TaxonomyPage } from "@/app/main-page/_components/views/taxonomy-page"
import { preview } from "@/app/main-page/_lib/metadata"
import { mapLocales } from "@/i18n/alternates"
import type { Locale } from "@/i18n/config"
import { blogPageMetadata, categoryMetadata, postMetadata, tagMetadata } from "@/i18n/page-metadata"
import { getBlogPageCount } from "@/lib/blog-pages"
import { getPostBySlug, getTerm, type TaxonomyField } from "@/lib/posts"
import { archiveParams, postParams, readParam, termParams, type ParamsProps } from "@/routes/params"

/** Wpis: `/main-page/blog/[slug]`. */
export function postRoute(locale: Locale) {
  const postFor = async (props: ParamsProps<"slug">) =>
    getPostBySlug(locale, await readParam(props, "slug")) ?? notFound()

  return {
    generateStaticParams: () => postParams(locale),
    generateMetadata: async (props: ParamsProps<"slug">): Promise<Metadata> =>
      preview(postMetadata(locale, await postFor(props))),
    Page: async (props: ParamsProps<"slug">) => (
      <PostPage post={await postFor(props)} locale={locale} />
    ),
  }
}

/** Kategoria albo tag: `/main-page/blog/kategoria/[kategoria]`, `/main-page/blog/tag/[tag]`. */
export function taxonomyRoute<K extends string>(locale: Locale, field: TaxonomyField, key: K) {
  const termFor = async (props: ParamsProps<K>) =>
    getTerm(locale, field, await readParam(props, key)) ?? notFound()

  return {
    generateStaticParams: () => termParams(locale, field, key),
    generateMetadata: async (props: ParamsProps<K>): Promise<Metadata> => {
      const term = await termFor(props)
      return preview(
        field === "categories" ? categoryMetadata(locale, term) : tagMetadata(locale, term)
      )
    },
    Page: async (props: ParamsProps<K>) => (
      <TaxonomyPage locale={locale} field={field} term={await termFor(props)} />
    ),
  }
}

/** Kolejne strony archiwum: `/main-page/blog/strona/[strona]`. */
export function blogArchiveRoute<K extends string>(locale: Locale, key: K) {
  const pageFor = async (props: ParamsProps<K>) => Number(await readParam(props, key))

  return {
    generateStaticParams: () => archiveParams(locale, key),
    generateMetadata: async (props: ParamsProps<K>): Promise<Metadata> =>
      preview(blogPageMetadata(locale, await pageFor(props), mapLocales(getBlogPageCount))),
    Page: async (props: ParamsProps<K>) => <BlogPage locale={locale} page={await pageFor(props)} />,
  }
}
