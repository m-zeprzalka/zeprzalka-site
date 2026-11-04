import Image from "next/image"
import { cn } from "@/components/demo/forma/cn"
import type { DemoPost } from "@/components/demo/shared/content"

/**
 * `sizes` opisuje prawdziwą szerokość kafla w siatce 2 kolumn obok szyny
 * (dziś przy 1024–1279 px strona pobierała za duże pliki — dług nr 13).
 */
const SIZES =
  "(min-width: 1440px) 460px, (min-width: 1280px) 33vw, (min-width: 1024px) 29vw, (min-width: 640px) 46vw"

/**
 * Karta wpisu w drugim wydaniu: okładka z pierścieniem i powolnym
 * przybliżeniem pod kursorem, kategorie jako ciche chipy, tytuł jako jedyny
 * link rozciągnięty na kartę. `compact`: na telefonie wiersz z miniaturą
 * (sześć pełnych kart to dziś ponad dwa ekrany przewijania samego bloga).
 */
export function PostCard({ post, compact = false }: { post: DemoPost; compact?: boolean }) {
  const mobileRow = (className: string) => (compact ? className : undefined)

  return (
    <article
      className={cn(
        "re-post group relative",
        mobileRow(
          "max-sm:grid max-sm:grid-cols-[7.5rem_minmax(0,1fr)] max-sm:items-center max-sm:gap-4"
        )
      )}
    >
      <div
        className={cn(
          "re-cover relative aspect-video overflow-hidden rounded-fm-2xl bg-fm-fill",
          mobileRow("max-sm:rounded-fm-lg")
        )}
      >
        <Image
          src={post.image}
          alt=""
          fill
          sizes={`${SIZES}, ${compact ? "120px" : "100vw"}`}
          className="object-cover"
        />
      </div>
      <div className={cn("mt-4 px-1", mobileRow("max-sm:mt-0 max-sm:px-0"))}>
        <ul className={cn("flex flex-wrap gap-1.5", mobileRow("max-sm:hidden"))}>
          {post.categories.slice(0, 2).map((category) => (
            <li
              key={category}
              className="inline-flex h-6 items-center rounded-full bg-fm-fill px-2.5 text-xs font-medium text-fm-ink-2"
            >
              {category}
            </li>
          ))}
        </ul>
        <h3
          className={cn(
            "mt-3 text-[1.125rem] leading-snug font-medium tracking-[-0.015em] text-balance",
            mobileRow("max-sm:mt-0 max-sm:line-clamp-2 max-sm:text-base max-sm:text-pretty")
          )}
        >
          <a
            href={post.href}
            className="rounded-fm-xs decoration-fm-edge-strong underline-offset-4 fm-focus group-hover:underline after:absolute after:inset-0 after:rounded-fm-2xl"
          >
            {post.title}
          </a>
        </h3>
        <p
          className={cn(
            "mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-pretty text-fm-ink-2",
            mobileRow("max-sm:hidden")
          )}
        >
          {post.description}
        </p>
        <p
          className={cn(
            "mt-3 flex flex-wrap gap-x-4 text-[0.8125rem] text-fm-ink-3",
            mobileRow("max-sm:mt-1.5")
          )}
        >
          <time dateTime={post.date}>{post.dateLabel}</time>
          <span>{post.readingTime}</span>
        </p>
      </div>
    </article>
  )
}
