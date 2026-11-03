import "server-only"
import type { Locale } from "@/i18n/config"
import { getBlogPageCount } from "@/lib/blog-pages"
import { getAllPosts, getTerms, type TaxonomyField } from "@/lib/posts"

/**
 * Parametry tras bloga — wspólne dla stron (`routes/blog.tsx`) i kart OG
 * (`lib/og.tsx`), żeby lista adresów strony i jej obrazka nie mogła się rozjechać.
 */
export type ParamsProps<K extends string> = { params: Promise<Record<K, string>> }

/** Obiekt `{ [key]: value }` z kluczem znanym dopiero w wywołaniu (nazwa parametru zależy od języka). */
function param<K extends string>(key: K, value: string) {
  return { [key]: value } as Record<K, string>
}

export async function readParam<K extends string>({ params }: ParamsProps<K>, key: K) {
  return (await params)[key]
}

export function postParams(locale: Locale) {
  return getAllPosts(locale).map((post) => ({ slug: post.slug }))
}

export function termParams<K extends string>(locale: Locale, field: TaxonomyField, key: K) {
  return getTerms(locale, field).map((term) => param(key, term.slug))
}

/** Strona 1 to sam indeks bloga, więc archiwum zaczyna się od 2. */
export function archiveParams<K extends string>(locale: Locale, key: K) {
  return Array.from({ length: getBlogPageCount(locale) - 1 }, (_, i) => param(key, String(i + 2)))
}
