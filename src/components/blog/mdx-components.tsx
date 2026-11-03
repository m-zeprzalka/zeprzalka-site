import type { ComponentProps } from "react"
import Image from "next/image"
import Link from "next/link"
import { CodeBlock } from "@/components/blog/CodeBlock"
import { YouTubeEmbed } from "@/components/blog/YouTubeEmbed"
import type { Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { cn } from "@/lib/utils"

/** Szerokość kolumny artykułu: `container` (max 64/80/96 rem) × 6/12 lub 7/12 kolumn. */
export const ARTICLE_IMAGE_SIZES =
  "(min-width: 1536px) 860px, (min-width: 1280px) 710px, (min-width: 1024px) 475px, calc(100vw - 2rem)"

/** Adres w obrębie serwisu: zaczyna się od „/”, ale nie od „//” (to adres bez protokołu). */
const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//")

/**
 * Komponenty MDX — wyłącznie zmiany **semantyczne** (next/link, next/image,
 * blok kodu z kopiowaniem, przewijana tabela, leniwy obraz). Wygląd treści
 * opisuje w jednym miejscu klasa `prose` z modyfikatorami w `PostView`.
 */
export function mdxComponents(locale: Locale) {
  const ui = getCommon(locale).ui

  return {
    YouTubeEmbed: (props: Omit<ComponentProps<typeof YouTubeEmbed>, "playLabel">) => (
      <YouTubeEmbed playLabel={ui.youtubePlay} {...props} />
    ),
    Image: ({ src, alt, width, height, className, ...props }: ComponentProps<typeof Image>) => (
      // Domyślne 1280×720 to proporcje wszystkich obrazów `<Image>` w treści.
      <Image
        src={src}
        alt={alt ?? ""}
        width={width ?? 1280}
        height={height ?? 720}
        sizes={ARTICLE_IMAGE_SIZES}
        className={cn("h-auto w-full", className)}
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
    // Szeroka tabela przewija się we własnym kontenerze, osiągalnym z klawiatury.
    table: (props: ComponentProps<"table">) => (
      <div className="overflow-x-auto" role="region" aria-label={ui.scrollableTable} tabIndex={0}>
        <table {...props} />
      </div>
    ),
    // Linki wewnętrzne przez next/link (prefetch, bez przeładowania dokumentu),
    // zewnętrzne w nowej karcie.
    a: ({ href = "", ...props }: ComponentProps<"a">) => {
      if (isInternal(href)) return <Link href={href} {...props} />
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
