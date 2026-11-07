import Image from "next/image"
import Link from "next/link"
import { HALF_COLUMN_SIZES } from "@/app/main-page/_lib/media"
import type { Post } from "@/app/main-page/_lib/types"

/**
 * Wyróżniony wpis: okładka, tytuł, opis i data. Link stoi na tytule (jego nazwa to
 * sam tytuł), a rozciągnięty `::after` robi z całej karty pole kliknięcia.
 */
export function FeaturedPost({
  post,
  description,
  date,
  priority = false,
}: {
  post: Post
  description: string
  /** Data w zapisie języka strony (`formatDate`). */
  date: string
  /** Pierwsza karta w pierwszym ekranie — kandydat na LCP. */
  priority?: boolean
}) {
  return (
    <article className="group relative -m-2 grid gap-4 rounded-3xl p-2 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
      <span className="block overflow-hidden rounded-2xl bg-muted">
        <Image
          src={post.cover.src}
          alt=""
          width={post.cover.width}
          height={post.cover.height}
          sizes={HALF_COLUMN_SIZES}
          preload={priority}
          className="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      </span>
      <div className="grid gap-1.5 px-1">
        <h3 className="font-medium text-pretty">
          <Link
            href={post.href}
            className="underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 after:rounded-3xl"
          >
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-pretty text-muted-foreground">{description}</p>
        <time dateTime={post.iso} className="text-sm text-muted-foreground tabular-nums">
          {date}
        </time>
      </div>
    </article>
  )
}
