import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/demo/forma/Button"
import { typo } from "@/components/demo/forma/typo"
import { cn } from "../forma/cn"

export interface JournalPost {
  href: string
  title: string
  category: string
  image: string
  date: string
  dateTime: string
  reading: string
}

/**
 * Trzy najnowsze wpisy. Telefon: zwarte wiersze z miniaturą (szybciej się
 * je skanuje niż trzy wielkie karty pod sobą). Desktop: karty 20 px
 * z okładką 12 px w środku (20 − 8 px odstępu). Data i czas czytania
 * rozsunięte na boki zamiast sklejania kropką.
 */
export function Journal({
  title,
  lead,
  cta,
  ctaHref,
  posts,
}: {
  title: string
  lead: string
  cta: string
  ctaHref: string
  posts: readonly JournalPost[]
}) {
  const all = (
    <Link href={ctaHref} className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
      {cta}
    </Link>
  )

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2 id="blog-tytul" className="text-fm-h2 font-semibold">
            {title}
          </h2>
          <p className="mt-3 text-fm-lead text-pretty text-fm-ink-2">{typo(lead)}</p>
        </div>
        <div className="hidden md:block">{all}</div>
      </div>

      <ul className="mt-8 grid gap-3 md:mt-10 md:grid-cols-3 md:gap-4 lg:gap-5">
        {posts.map((post) => (
          <li key={post.href}>
            <Link
              href={post.href}
              className="group flex h-full fm-press-soft gap-4 rounded-fm-2xl bg-fm-surface p-2 shadow-fm-card fm-focus transition-[box-shadow,scale] duration-300 hover:shadow-fm-pop md:flex-col md:gap-0"
            >
              <span className="relative block aspect-square w-24 shrink-0 overflow-hidden rounded-fm-lg bg-fm-fill md:aspect-video md:w-full">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 24rem, 6rem"
                  className="object-cover transition-[scale] duration-700 ease-fm-snap group-hover:scale-[1.04]"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col py-1 pe-2 md:px-3 md:pt-4 md:pb-3">
                <span className="text-fm-micro font-medium text-fm-ink-3">{post.category}</span>
                <span className="mt-1 line-clamp-2 text-[0.9375rem] leading-snug font-medium tracking-[-0.01em] text-balance md:mt-2 md:line-clamp-3 md:text-[1.0625rem]">
                  {typo(post.title)}
                </span>
                <span className="mt-auto flex justify-between gap-3 pt-3 text-fm-micro text-fm-ink-3 md:pt-6">
                  <time dateTime={post.dateTime}>{post.date}</time>
                  <span>{post.reading}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 md:hidden [&>a]:w-full">{all}</div>
    </div>
  )
}
