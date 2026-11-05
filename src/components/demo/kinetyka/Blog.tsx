import { ArrowUpRight } from "lucide-react"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { RollText } from "./RollText"
import { SplitChars } from "./split"

type Blog = DemoHomeContent["blog"]

/** Ile wpisów pokazuje strona główna (jak obecna). */
const SHOWN = 6

/**
 * Blog: spokojny spis — data, tytuł, okładka. Jedyny ruch to wejście
 * nagłówka i delikatne przybliżenie okładki pod kursorem; po plakatowych
 * scenach powyżej to oddech przed kontaktem.
 */
export function Blog({ blog }: { blog: Blog }) {
  const posts = blog.posts.slice(0, SHOWN)

  return (
    <section id="blog" aria-labelledby="kn-blog-title" className="kn-wrap pt-(--kn-section)">
      <div className="grid gap-6 xl:grid-cols-12 xl:items-end">
        <h2 id="kn-blog-title" data-kn-in="chars" className="kn-title xl:col-span-7">
          <SplitChars text={blog.title} spread={240} />
        </h2>
        <div
          data-kn-in=""
          className="grid gap-4 xl:col-span-5 xl:justify-items-end xl:pb-3 xl:text-end"
        >
          <p className="kn-lead max-w-[32ch] text-pretty text-fm-ink-2">{blog.lead}</p>
          <a
            href={blog.link.href}
            className="kn-roll-host inline-flex h-11 w-fit items-center gap-1.5 rounded-full text-fm-small font-medium fm-focus"
          >
            <RollText text={blog.link.label} />
            <span className="text-fm-ink-3 tabular-nums">({blog.count})</span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>

      <ol className="mt-12 sm:mt-16">
        {posts.map((post) => (
          <li key={post.slug} className="border-t border-fm-edge last:border-b">
            <a
              href={post.href}
              className="group grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-x-5 gap-y-2 rounded-fm-sm py-5 fm-focus sm:grid-cols-[8rem_minmax(0,1fr)_10rem] sm:gap-x-8 sm:py-6"
            >
              <time
                dateTime={post.date}
                className="text-fm-small text-fm-ink-3 tabular-nums max-sm:col-span-2 max-sm:row-start-1"
              >
                {post.dateLabel}
              </time>
              <span className="text-[clamp(1.25rem,1rem+1.2vw,2rem)] leading-[1.15] font-medium tracking-[-0.03em] text-balance">
                {typo(post.title)}
                <span className="mt-1.5 block text-fm-small font-normal tracking-normal text-fm-ink-3">
                  {post.readingTime}
                </span>
              </span>
              <span className="relative aspect-video overflow-hidden rounded-fm-md bg-fm-fill shadow-fm-ring">
                {/* eslint-disable-next-line @next/next/no-img-element -- okładki 16:9 z public/blog */}
                <img
                  src={post.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-700 ease-fm-snap group-hover:scale-[1.05]"
                />
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
