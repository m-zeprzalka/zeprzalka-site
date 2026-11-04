import type { CSSProperties } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import type { DemoHomeContent } from "../shared/content"
import { SectionHeader } from "./SectionHeader"

/**
 * Blog: sześć najnowszych wpisów. Telefon — karuzela ze snapem (następna
 * karta zagląda zza krawędzi, przewijanie natywne); szerzej — siatka 2 i 3
 * kolumn. Okładki mają kolor — jedyne kolorowe obrazy poza realizacjami.
 */
export function Blog({ blog }: { blog: DemoHomeContent["blog"] }) {
  const posts = blog.posts.slice(0, 6)

  return (
    <section
      id="blog"
      data-es-section="blog"
      aria-labelledby="blog-title"
      className="fm-container scroll-mt-24 pt-(--fm-section)"
    >
      <SectionHeader
        id="blog-title"
        title={blog.title}
        lead={blog.lead}
        aside={
          <a
            href={blog.link.href}
            className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-fm-surface ps-4 pe-3.5 text-sm font-medium shadow-fm-ring fm-focus transition-colors hover:bg-fm-fill"
          >
            {blog.link.label}
            <span className="text-fm-micro text-fm-ink-3 tabular-nums">{blog.posts.length}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-fm-ink-3 transition-[translate,color] duration-150 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
            />
          </a>
        }
      />

      <ul className="-mx-(--fm-gutter) mt-12 flex snap-x snap-mandatory scroll-px-(--fm-gutter) [scrollbar-width:none] gap-3 overflow-x-auto px-(--fm-gutter) pb-2 sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
        {posts.map((post, index) => (
          <li
            key={post.slug}
            data-es-in=""
            style={{ "--i": index % 3 } as CSSProperties}
            className="w-[82%] shrink-0 snap-start sm:w-auto"
          >
            <a href={post.href} className="group block rounded-[1.5rem] fm-focus">
              <span className="relative block aspect-video overflow-hidden rounded-[1.25rem] bg-fm-fill shadow-fm-ring">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 390px, (min-width: 640px) 50vw, 82vw"
                  className="object-cover transition-[scale] duration-700 ease-fm-snap group-hover:scale-[1.03]"
                />
              </span>
              <span className="mt-4 flex gap-3 text-fm-micro text-fm-ink-3">
                <time dateTime={post.date}>{post.dateLabel}</time>
                <span>{post.readingTime}</span>
              </span>
              <h3 className="mt-2 text-[1.125rem] leading-[1.3] font-[550] tracking-[-0.02em] text-balance decoration-fm-edge-strong underline-offset-4 group-hover:underline">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-fm-small text-pretty text-fm-ink-2">
                {post.description}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
