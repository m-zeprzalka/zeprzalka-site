/**
 * Trasy bloga z parametrem — jedna definicja dla obu wersji językowych i dla obu
 * warstw widoku (serwis: `src/routes/blog.tsx`, podgląd nowej wersji:
 * `src/app/main-page/_routes/blog.tsx`). Widoki i opakowanie metadanych (np. `noindex`
 * podglądu) wstrzykuje wywołujący, więc moduł nie importuje żadnych komponentów.
 *
 * Literałem w pliku trasy zostaje tylko `dynamicParams` — Next czyta konfigurację
 * segmentu statycznie z kodu pliku, więc nie może przyjść z importu.
 */
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import type { Locale } from "@/i18n/config"
import { mapLocales } from "@/i18n/alternates"
import { blogPageMetadata, categoryMetadata, postMetadata, tagMetadata } from "@/i18n/page-metadata"
import { getBlogPageCount } from "@/lib/blog-pages"
import { getPostBySlug, getTerm, type Post, type TaxonomyField, type Term } from "@/lib/posts"
import { archiveParams, postParams, readParam, termParams, type ParamsProps } from "@/routes/params"

type View<P> = (props: P) => ReactNode | Promise<ReactNode>

export interface BlogViews {
  Post: View<{ post: Post; locale: Locale }>
  Taxonomy: View<{ locale: Locale; field: TaxonomyField; term: Term }>
  Index: View<{ locale: Locale; page?: number }>
}

/*
 * Przy `dynamicParams = false` Next wywołuje te funkcje wyłącznie dla adresów
 * z `generateStaticParams`, więc brak wpisu albo terminu to błąd danych —
 * `notFound()` zamiast pustych metadanych i typów z `null`.
 */
export function blogRoutes(
  { Post: PostView, Taxonomy: TaxonomyView, Index: IndexView }: BlogViews,
  wrap: (metadata: Metadata) => Metadata = (metadata) => metadata
) {
  /** Wpis: `/blog/[slug]`, `/en/blog/[slug]`. */
  function postRoute(locale: Locale) {
    const postFor = async (props: ParamsProps<"slug">) =>
      getPostBySlug(locale, await readParam(props, "slug")) ?? notFound()

    return {
      generateStaticParams: () => postParams(locale),
      generateMetadata: async (props: ParamsProps<"slug">): Promise<Metadata> =>
        wrap(postMetadata(locale, await postFor(props))),
      Page: async (props: ParamsProps<"slug">) => (
        <PostView post={await postFor(props)} locale={locale} />
      ),
    }
  }

  /** Kategoria albo tag: `/blog/kategoria/[kategoria]`, `/en/blog/tag/[tag]`… */
  function taxonomyRoute<K extends string>(locale: Locale, field: TaxonomyField, key: K) {
    const termFor = async (props: ParamsProps<K>) =>
      getTerm(locale, field, await readParam(props, key)) ?? notFound()

    return {
      generateStaticParams: () => termParams(locale, field, key),
      generateMetadata: async (props: ParamsProps<K>): Promise<Metadata> => {
        const term = await termFor(props)
        return wrap(
          field === "categories" ? categoryMetadata(locale, term) : tagMetadata(locale, term)
        )
      },
      Page: async (props: ParamsProps<K>) => (
        <TaxonomyView locale={locale} field={field} term={await termFor(props)} />
      ),
    }
  }

  /** Kolejne strony archiwum: `/blog/strona/[strona]`, `/en/blog/page/[page]`. */
  function blogArchiveRoute<K extends string>(locale: Locale, key: K) {
    const pageFor = async (props: ParamsProps<K>) => Number(await readParam(props, key))

    return {
      generateStaticParams: () => archiveParams(locale, key),
      generateMetadata: async (props: ParamsProps<K>): Promise<Metadata> =>
        wrap(blogPageMetadata(locale, await pageFor(props), mapLocales(getBlogPageCount))),
      Page: async (props: ParamsProps<K>) => (
        <IndexView locale={locale} page={await pageFor(props)} />
      ),
    }
  }

  return { postRoute, taxonomyRoute, blogArchiveRoute }
}
