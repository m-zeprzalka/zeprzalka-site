/**
 * Karty Open Graph (1200×630) — wygląd i treść w jednym miejscu.
 *
 * Pliki `opengraph-image.tsx` w segmentach tras są kilkulinijkowcami nad
 * fabrykami z tego modułu: `pageOgImage` (strony stałe), `postOgImage`
 * (wpisy), `categoryOgImage` (kategorie), `archiveOgImage` i `tagOgImage`. Wszystko powstaje
 * przy buildzie — w produkcji to zwykłe statyczne PNG.
 *
 * Renderuje Satori (next/og), które zna wyłącznie flexbox — stąd jawne
 * `display: flex` przy każdym elemencie z wieloma dziećmi. Kolory to tokeny
 * motywu ciemnego, domyślnego w serwisie: karta ma wyglądać jak jego przedłużenie.
 */
import "server-only"
import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"
import type { Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getMeta } from "@/i18n/content/meta"
import { fill, formatReadingTime, plural } from "@/i18n/format"
import { portfolioItems } from "@/lib/portfolio"
import { getAllPosts, getPostBySlug, getTerm } from "@/lib/posts"
import { SITE_HOST, SITE_NAME } from "@/lib/site"
import { archiveParams, postParams, readParam, termParams, type ParamsProps } from "@/routes/params"

export const OG_SIZE = { width: 1200, height: 630 }

const INK = "#0a0a0a"
const PAPER = "#fafafa"
const MUTED = "#a1a1a1"
const LINE = "#2a2a2a"

interface Card {
  /** Wiersz nad tytułem: rola, sekcja albo kategorie wpisu. */
  eyebrow: string
  /** Nadrzędny komunikat — także tekst alternatywny obrazka. */
  title: string
  /** Wiersz pod tytułem: krótki opis albo metadane. */
  footer?: string
}

function OgCard({ title, eyebrow, footer }: Card) {
  // Długie tytuły dostają mniejszy stopień, żeby zawsze mieściły się w kadrze.
  const fontSize = title.length > 70 ? 58 : title.length > 45 ? 68 : 82

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: INK,
        color: PAPER,
        padding: "72px 80px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${LINE}`,
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: PAPER }}>{SITE_NAME}</div>
        <div style={{ display: "flex", fontSize: 24, color: MUTED }}>{footer ?? SITE_HOST}</div>
      </div>
    </div>
  )
}

function render(card: Card) {
  return new ImageResponse(<OgCard {...card} />, OG_SIZE)
}

function articles(count: number, locale: Locale) {
  return plural(count, locale, getCommon(locale).plurals.articles)
}

type CardKey = keyof ReturnType<typeof getMeta>["og"]["cards"]
type PageCardKey = Exclude<CardKey, "category">

/** Wartości `{count}` liczone z treści serwisu — dla kart, które je mają. */
function pageCounts(locale: Locale, key: PageCardKey): Record<string, string | number> {
  if (key === "blog" || key === "categories") {
    return { count: articles(getAllPosts(locale).length, locale) }
  }
  if (key === "portfolio") return { count: portfolioItems.length }
  return {}
}

/**
 * Strona stała. Tytuł karty nie zależy od liczników, więc `alt` jest gotowe
 * przy imporcie, a treść wpisów czytamy dopiero przy renderze obrazka.
 */
export function pageOgImage(locale: Locale, key: PageCardKey) {
  const card = getMeta(locale).og.cards[key]
  return {
    alt: card.title,
    Image: () => {
      const values = pageCounts(locale, key)
      return render({ ...card, footer: fill(card.footer, values) })
    },
  }
}

/**
 * Kart wpisów i kategorii nie opisujemy przez `generateImageMetadata`
 * (osobny `alt` dla każdej): w Next 16.4 takie obrazki nie są prerenderowane
 * razem z `generateStaticParams` i przy `dynamicParams = false` kończą się 404.
 * Stały `alt` na plik to cena za karty generowane wyłącznie przy buildzie.
 */
function sectionAlt(locale: Locale, key: "blog" | "category") {
  return `${getMeta(locale).og.cards[key].eyebrow} · ${SITE_NAME}`
}

/** Wpis: kategorie, tytuł i czas lektury. */
export function postOgImage(locale: Locale) {
  return {
    alt: sectionAlt(locale, "blog"),
    generateStaticParams: () => postParams(locale),
    Image: async (props: ParamsProps<"slug">) => {
      const post = getPostBySlug(locale, await readParam(props, "slug")) ?? notFound()
      return render({
        eyebrow: post.frontmatter.categories.slice(0, 3).join(" · "),
        title: post.frontmatter.title,
        footer: formatReadingTime(post.readingMinutes, locale),
      })
    },
  }
}

/** Kategoria: nazwa i liczba wpisów. Parametr trasy ma inną nazwę w każdym języku. */
export function categoryOgImage<K extends string>(locale: Locale, key: K) {
  const template = getMeta(locale).og.cards.category
  const cardFor = (slug: string): Card => {
    const term = getTerm(locale, "categories", slug)
    const values = { name: term?.label ?? slug, count: articles(term?.posts.length ?? 0, locale) }
    return {
      eyebrow: template.eyebrow,
      title: fill(template.title, values),
      footer: fill(template.footer, values),
    }
  }
  return {
    alt: sectionAlt(locale, "category"),
    generateStaticParams: () => termParams(locale, "categories", key),
    Image: async (props: ParamsProps<K>) => render(cardFor(await readParam(props, key))),
  }
}

/**
 * Archiwum bloga i strony tagów dostają kartę bloga (bez nowego tekstu).
 * Bez własnego pliku obrazka strona gubiła kartę: jej `openGraph` zastępuje
 * rodzica, więc obrazek z segmentu `blog/` nie przechodzi niżej.
 */
export function archiveOgImage<K extends string>(locale: Locale, key: K) {
  const { alt, Image } = pageOgImage(locale, "blog")
  return { alt, Image, generateStaticParams: () => archiveParams(locale, key) }
}

export function tagOgImage<K extends string>(locale: Locale, key: K) {
  const { alt, Image } = pageOgImage(locale, "blog")
  return { alt, Image, generateStaticParams: () => termParams(locale, "tags", key) }
}
