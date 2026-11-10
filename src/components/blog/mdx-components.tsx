import type { ComponentProps } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { COLUMN_SIZES } from "@/lib/media"
import { getCommon } from "@/i18n/content/common"
import { CodeBlock } from "./code-block"
import { YouTubeEmbed } from "./youtube-embed"

/** Adres w obrębie serwisu: zaczyna się od „/”, ale nie od „//” (to adres bez protokołu). */
const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//")

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
    // Wewnętrzne przez next/link, zewnętrzne w nowej karcie.
    a: ({ href = "", ...props }: ComponentProps<"a">) => {
      // Adres wykonywalny (`javascript:`, `data:`) z treści nie staje się linkiem.
      if (/^\s*(?:javascript|data|vbscript):/i.test(href)) return <span {...props} />
      if (isInternal(href)) return <Link href={href} {...props} />
      if (!/^(https?:)?\/\//.test(href)) return <a href={href} {...props} />
      // Nowa karta zapowiedziana czytnikowi — jak przy każdym linku zewnętrznym w UI.
      const { children, ...rest } = props
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
          <span className="sr-only"> ({ui.newTab})</span>
        </a>
      )
    },
  }
}
