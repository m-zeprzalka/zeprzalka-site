import type { CSSProperties } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { buttonVariants } from "../../forma/Button"
import { cn } from "../../forma/cn"
import { typo } from "../../forma/typo"
import type { DemoHomeContent, DemoPost } from "../../shared/content"
import { MediaTwin } from "../ascii/MediaTwin"
import { Listing } from "../code/Listing"
import { quote } from "../code/highlight"
import { Code, Face, Inspect, Outline, Twin } from "../code/Twin"

const vars = (values: Record<string, string | number>) => values as CSSProperties

/** Frontmatter wpisu — dokładnie to, co leży na górze pliku MDX w `content/`. */
function frontmatter(post: DemoPost, full: boolean) {
  const lines = [
    "---",
    `title: ${quote(post.title)}`,
    `date: ${post.date}`,
    `categories: [${post.categories.map((item) => quote(item)).join(", ")}]`,
  ]
  if (full) {
    lines.push(`description: ${quote(post.description)}`)
    lines.push(`image: ${quote(post.image)}`)
  }
  lines.push("---")
  return lines.join("\n")
}

/**
 * Blog: najnowszy wpis z okładką i cztery kolejne jako lista. Pod soczewką
 * wpis to jego plik — frontmatter MDX z `content/blog/<slug>.mdx`.
 */
export function Blog({ blog }: { blog: DemoHomeContent["blog"] }) {
  const [lead, ...rest] = blog.posts
  const list = rest.slice(0, 4)
  if (!lead) return null

  return (
    <section
      id="blog"
      data-rg-host="blog"
      data-rg-section="blog"
      data-rg-name="section#blog"
      aria-labelledby="rg-blog-title"
      className="relative border-t border-fm-edge py-(--fm-section)"
    >
      <div className="fm-container">
        <div className="grid gap-x-6 gap-y-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2
              id="rg-blog-title"
              data-rg-key="blog-title"
              data-rg-name="h2.rg-h2"
              data-rg-in=""
              className="rg-h2"
            >
              {blog.title}
            </h2>
            <p
              data-rg-key="blog-lead"
              data-rg-in=""
              style={vars({ "--i": 1 })}
              className="mt-4 max-w-[30rem] text-fm-lead text-pretty text-fm-ink-2"
            >
              {typo(blog.lead)}
            </p>
          </div>
          <div className="flex items-center gap-4 lg:col-span-5 lg:justify-end">
            <span className="text-fm-small text-fm-ink-3 tabular-nums">{blog.count}</span>
            <a
              href={blog.link.href}
              data-rg-key="blog-link"
              data-rg-name="Button"
              data-rg-magnet=""
              className={cn(buttonVariants({ variant: "secondary" }), "max-sm:h-11")}
            >
              {blog.link.label}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-10 sm:mt-14 lg:grid-cols-12">
          <article
            data-rg-key={`post-${lead.slug}`}
            data-rg-name="article"
            data-rg-in=""
            className="group relative lg:col-span-7"
          >
            <div
              data-rg-key="post-cover"
              className="relative aspect-video overflow-hidden rounded-fm-3xl bg-fm-fill shadow-fm-ring"
            >
              <Image
                src={lead.image}
                width={1280}
                height={720}
                alt=""
                sizes="(min-width: 1024px) 44rem, 92vw"
                className="h-full w-full object-cover transition-[scale] duration-700 ease-fm-snap pointer-fine:group-hover:scale-[1.02]"
              />
            </div>
            <p className="mt-5 flex gap-3 text-fm-small text-fm-ink-3">
              <time dateTime={lead.date}>{lead.dateLabel}</time>
              <span aria-hidden="true">/</span>
              <span>{lead.readingTime}</span>
            </p>
            <h3 className="mt-2 text-[1.5rem] leading-[1.15] font-[560] tracking-[-0.03em] text-balance sm:text-[1.75rem]">
              <a href={lead.href} className="rounded-sm fm-focus after:absolute after:inset-0">
                {typo(lead.title)}
              </a>
            </h3>
            <p className="mt-3 max-w-[38rem] text-fm-body text-pretty text-fm-ink-2">
              {typo(lead.description)}
            </p>
          </article>

          <ol className="lg:col-span-5">
            {list.map((post, index) => (
              <li
                key={post.slug}
                data-rg-key={`post-${post.slug}`}
                data-rg-name="li.post"
                data-rg-in=""
                style={vars({ "--i": index + 1 })}
                className="group relative border-b border-fm-edge first:border-t lg:first:border-t-0"
              >
                <a href={post.href} className="flex min-h-11 gap-4 rounded-fm-lg py-5 fm-focus">
                  <span className="min-w-0 flex-1">
                    <span className="block text-fm-small text-fm-ink-3">
                      <time dateTime={post.date}>{post.dateLabel}</time>
                    </span>
                    <span className="mt-1.5 block text-[1.0625rem] leading-snug font-[560] tracking-[-0.02em] text-pretty text-fm-ink transition-colors pointer-fine:group-hover:text-fm-ink-2">
                      {typo(post.title)}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-fm-ink-3 transition-[translate,color] duration-150 pointer-fine:group-hover:translate-x-px pointer-fine:group-hover:-translate-y-px pointer-fine:group-hover:text-fm-ink"
                  />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Face>
        <Listing file="Blog.tsx" />
        <Outline for="blog-title" tag="h2" classes="rg-h2" text={blog.title} />
        <Twin for="blog-lead" kind="text">
          <Code className="rg-code--lead" src={`<p className="text-fm-lead">${blog.lead}</p>`} />
        </Twin>
        <Inspect
          for="blog-link"
          name="a.Button"
          className="rounded-full"
          src={`href="${blog.link.href}"`}
        />
        <Twin for="post-cover" kind="media" className="rounded-fm-3xl">
          <MediaTwin source="post-cover" cell={5} tone={0.08} />
          <Code className="rg-media-caption" src={`content/blog/${lead.slug}.mdx`} />
        </Twin>
        <Twin for={`post-${lead.slug}`} kind="block" className="rg-twin--post">
          <Code className="rg-code--frontmatter" src={frontmatter(lead, true)} />
        </Twin>
        {list.map((post) => (
          <Twin key={post.slug} for={`post-${post.slug}`} kind="text" className="rg-twin--row">
            <Code className="rg-code--frontmatter" src={frontmatter(post, false)} />
          </Twin>
        ))}
      </Face>
    </section>
  )
}
