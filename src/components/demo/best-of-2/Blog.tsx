import type { CSSProperties } from "react"
import Image from "next/image"
import { cn } from "../forma/cn"
import type { DemoHomeContent } from "../shared/content"
import { AllLink } from "./AllLink"
import { SECTIONS } from "./ids"
import { SectionHeader } from "./SectionHeader"

/**
 * Blog: sześć najnowszych wpisów z okładkami. Desktop — siatka 3 × 2 kart;
 * telefon — pierwszy wpis jako duża karta, reszta jako lista z miniaturami
 * (tytuły czyta się jednym ruchem kciuka, bez karuzeli). Okładki mają kolor —
 * obok realizacji jedyne kolorowe obrazy strony.
 */
export function Blog({ blog }: { blog: DemoHomeContent["blog"] }) {
  const posts = blog.posts.slice(0, 6)

  return (
    <section
      id={SECTIONS.blog}
      data-b2-section={SECTIONS.blog}
      aria-labelledby="b2-blog-title"
      className="fm-container scroll-mt-24 pt-(--fm-section)"
    >
      <SectionHeader
        id="b2-blog-title"
        title={blog.title}
        lead={blog.lead}
        aside={<AllLink href={blog.link.href} label={blog.link.label} />}
      />

      <ul className="mt-12 grid gap-x-4 gap-y-6 sm:mt-16 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-5">
        {posts.map((post, index) => {
          const compact = index > 0
          return (
            <li
              key={post.slug}
              data-b2-in=""
              style={{ "--i": index % 3 } as CSSProperties}
              className={cn(compact && "max-sm:border-t max-sm:border-fm-edge max-sm:pt-6")}
            >
              <a
                href={post.href}
                className={cn(
                  "group grid gap-4 rounded-(--b2-r-card) fm-focus",
                  compact && "max-sm:grid-cols-[7.5rem_minmax(0,1fr)] max-sm:items-start"
                )}
              >
                <span
                  className={cn(
                    "relative block aspect-video overflow-hidden rounded-(--b2-r-card) bg-fm-fill shadow-fm-ring",
                    compact && "max-sm:rounded-fm-lg"
                  )}
                >
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes={
                      compact
                        ? "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 120px"
                        : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    }
                    className="object-cover transition-[scale] duration-700 ease-fm-snap group-hover:scale-[1.03]"
                  />
                </span>
                <span className="block min-w-0">
                  <span className="flex gap-3 text-fm-micro text-fm-ink-3">
                    <time dateTime={post.date}>{post.dateLabel}</time>
                    <span>{post.readingTime}</span>
                  </span>
                  <span
                    className={cn(
                      "mt-2 block text-[1.125rem] leading-[1.3] font-[550] tracking-[-0.02em] text-balance decoration-fm-edge-strong underline-offset-4 group-hover:underline",
                      compact && "max-sm:mt-1.5 max-sm:text-[1rem]"
                    )}
                  >
                    {post.title}
                  </span>
                  <span
                    className={cn(
                      "mt-2 line-clamp-2 text-fm-small text-pretty text-fm-ink-2",
                      compact && "max-sm:hidden"
                    )}
                  >
                    {post.description}
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
