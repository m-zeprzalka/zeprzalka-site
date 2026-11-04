import { Button } from "@/components/demo/forma/Button"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { CodedMedia } from "./CodedMedia"
import { SectionHead } from "./SectionHead"

const LATEST = 4

/**
 * Blog jako spis czterech najnowszych wpisów: data, tytuł z leadem, okładka
 * zakodowana w glifach, odkodowana przy pierwszym spojrzeniu; dalej — archiwum.
 */
export function Writing({ blog }: { blog: DemoHomeContent["blog"] }) {
  const posts = blog.posts.slice(0, LATEST)

  return (
    <section id="blog" aria-labelledby="blog-title" className="gl-section">
      <div className="fm-container">
        <SectionHead id="blog" title={blog.title} lead={blog.lead} />
        <ol className="mt-14 sm:mt-20">
          {posts.map((post) => (
            <li key={post.slug} className="group/row border-t border-fm-edge-strong">
              <a
                href={post.href}
                data-gl-host=""
                className="group grid grid-cols-[minmax(0,1fr)_6.5rem] gap-x-4 gap-y-5 rounded-fm-sm py-7 fm-focus group-last/row:pb-0 sm:grid-cols-12 sm:gap-x-8 sm:py-9 sm:group-last/row:pb-0"
              >
                {/* Telefon: okładka jako miniatura obok tytułu — lista jest o połowę krótsza. */}
                <div className="order-2 pt-1 sm:col-span-5 sm:pt-0 lg:col-span-4 lg:col-start-9">
                  <CodedMedia
                    src={post.image}
                    width={1280}
                    height={720}
                    sizes="(min-width: 1280px) 384px, (min-width: 640px) 40vw, 104px"
                    rounded="rounded-fm-xl"
                  />
                </div>
                <div className="order-1 flex flex-col gap-2.5 sm:col-span-7 sm:gap-3 lg:col-span-8 lg:grid lg:grid-cols-8 lg:gap-8">
                  <p className="text-fm-small text-fm-ink-3 tabular-nums lg:col-span-2 lg:pt-1">
                    <time dateTime={post.date}>{post.dateLabel}</time>
                  </p>
                  <div className="lg:col-span-6">
                    <h3 className="text-[1.25rem] leading-[1.3] font-medium tracking-[-0.02em] text-balance text-fm-ink sm:text-[1.375rem]">
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-fm-snap group-hover:bg-[length:100%_1px]">
                        {post.title}
                      </span>
                    </h3>
                    <p className="mt-2.5 line-clamp-2 text-fm-small text-pretty text-fm-ink-2 sm:line-clamp-3">
                      {post.description}
                    </p>
                    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-fm-micro text-fm-ink-3">
                      <span>{post.categories.join(", ")}</span>
                      <span>{post.readingTime}</span>
                    </p>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-14 sm:mt-16">
          <Button asChild variant="secondary" size="lg">
            <a href={blog.link.href}>
              {blog.link.label}
              <span className="text-fm-ink-3 tabular-nums">{blog.count}</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
