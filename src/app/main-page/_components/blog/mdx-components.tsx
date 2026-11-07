import type { ComponentProps } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { COLUMN_SIZES } from "@/app/main-page/_lib/media"
import { withBase } from "@/app/main-page/_lib/routes"
import { getCommon } from "@/i18n/content/common"
import { CodeBlock } from "./code-block"
import { YouTubeEmbed } from "./youtube-embed"

/** Adres w obrębie serwisu: zaczyna się od „/”, ale nie od „//” (to adres bez protokołu). */
const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//")
/** Plik z `public/` (PDF, obraz, wideo, kanał) — nie dostaje prefiksu podglądu. Lista, nie
 * dowolna kropka: slug kategorii „next.js” to strona, nie plik. */
const isFile = (href: string) =>
  /\.(?:pdf|png|jpe?g|webp|avif|gif|svg|mp4|webm|xml|txt|zip)(?:[?#].*)?$/i.test(href)

/**
 * Komponenty MDX — wyłącznie zmiany semantyczne (next/link, next/image, blok
 * kodu z kopiowaniem, przewijana tabela, film bez śledzenia). Wygląd treści
 * opisuje w jednym miejscu `article.css`.
 */
export function mdxComponents(locale: Locale) {
  const ui = getCommon(locale).ui

  return {
    YouTubeEmbed: (props: Omit<ComponentProps<typeof YouTubeEmbed>, "playLabel">) => (
      <YouTubeEmbed playLabel={ui.youtubePlay} {...props} />
    ),
    Image: ({ src, alt, width, height, ...props }: ComponentProps<typeof Image>) => (
      // Domyślne 1280×720 to proporcje wszystkich obrazów `<Image>` w treści.
      <Image
        src={src}
        alt={alt ?? ""}
        width={width ?? 1280}
        height={height ?? 720}
        sizes={COLUMN_SIZES}
        className="h-auto w-full"
        {...props}
      />
    ),
    pre: (props: ComponentProps<"pre">) => (
      <CodeBlock
        copyLabel={ui.copyCode}
        copiedLabel={ui.copied}
        regionLabel={ui.codeBlock}
        {...props}
      />
    ),
    // Obrazy z markdownu mają nieznane wymiary — świadomie zwykły <img>, leniwy.
    img: ({ alt, ...props }: ComponentProps<"img">) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img {...props} alt={alt ?? ""} loading="lazy" decoding="async" />
    ),
    // Szeroka tabela przewija się we własnym kontenerze, osiągalnym z klawiatury
    // (`group`, nie `region` — kilka tabel nie mnoży jednakowych punktów orientacyjnych).
    table: (props: ComponentProps<"table">) => (
      <div role="group" aria-label={ui.scrollableTable} tabIndex={0} className="overflow-x-auto">
        <table {...props} />
      </div>
    ),
    // Wewnętrzne przez next/link (strony — w obrębie podglądu), zewnętrzne w nowej karcie.
    a: ({ href = "", ...props }: ComponentProps<"a">) => {
      if (isInternal(href)) return <Link href={isFile(href) ? href : withBase(href)} {...props} />
      const external = /^(https?:)?\/\//.test(href)
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          {...props}
        />
      )
    },
  }
}
