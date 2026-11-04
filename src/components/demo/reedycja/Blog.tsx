import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { SECTION } from "./ids"
import { PostCard } from "./PostCard"
import { Section } from "./Section"

/** Blog: sześć najnowszych wpisów w dwóch kolumnach — jak dziś. */
export function Blog({ blog }: { blog: DemoHomeContent["blog"] }) {
  return (
    <Section
      id={SECTION.blog}
      title={blog.title}
      lead={blog.lead}
      actions={
        <Button asChild variant="secondary" className="group">
          <a href={blog.link.href}>
            {blog.link.label}
            <ArrowUpRight
              aria-hidden="true"
              className="text-fm-ink-3 transition-[translate,color] duration-200 ease-fm-snap group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
            />
          </a>
        </Button>
      }
    >
      <ul className="grid gap-x-6 gap-y-6 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-8 lg:gap-y-14">
        {blog.posts.slice(0, 6).map((post, index) => (
          <li key={post.slug} className={index === 0 ? "max-sm:mb-4" : undefined}>
            <PostCard post={post} compact={index > 0} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
