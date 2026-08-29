import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllPosts, slugify, type Post } from "@/lib/posts"
import { Frame } from "@/components/main-third/Frame"
import { Rise } from "@/components/main-third/Rise"
import { blog, sections } from "@/lib/home-content"

const dateFormat = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

function Row({ post, index }: { post: Post; index: number }) {
  return (
    <Rise as="li" i={index} className="group relative border-t border-border/60">
      <article className="flex items-start gap-4 py-5 sm:gap-6 lg:items-center lg:gap-8 lg:py-6">
        <div className="relative aspect-[16/10] w-20 shrink-0 overflow-hidden bg-muted sm:w-28 lg:w-36">
          {post.frontmatter.image && (
            <Image
              src={post.frontmatter.image}
              alt=""
              fill
              sizes="144px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="m3-label m3-num flex items-center gap-2">
            <time dateTime={post.frontmatter.date}>
              {dateFormat.format(new Date(post.frontmatter.date))}
            </time>
            <span aria-hidden="true" className="text-muted-foreground/40">
              /
            </span>
            <span>{post.readingTime.replace("min read", "min")}</span>
          </p>

          <h3 className="m3-row-title">
            <Link
              href={`/blog/${post.slug}`}
              className="after:absolute after:inset-0"
            >
              {post.frontmatter.title}
            </Link>
          </h3>

          <p className="line-clamp-2 text-sm text-muted-foreground lg:line-clamp-1">
            {post.frontmatter.description}
          </p>

          <ul className="mt-1 flex flex-wrap gap-2" aria-label="Kategorie">
            {(post.frontmatter.categories || []).slice(0, 2).map((category) => (
              <li key={category} className="relative z-10">
                <Badge asChild variant="outline" className="rounded-none">
                  <Link href={`/blog/kategoria/${slugify(category)}`}>
                    {category}
                  </Link>
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        <ArrowRight
          aria-hidden="true"
          className="hidden size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none lg:block"
        />
      </article>
    </Rise>
  )
}

export function Blog() {
  const posts = getAllPosts("pl").slice(0, blog.postsLimit)

  return (
    <Frame
      meta={sections.blog}
      aside={
        <Button
          asChild
          variant="outline"
          className="group w-fit rounded-none"
        >
          <Link href={blog.cta.href}>
            {blog.cta.label}
            <ArrowRight
              data-icon="inline-end"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Button>
      }
    >
      <ol className="border-b border-border/60">
        {posts.map((post, index) => (
          <Row key={post.slug} post={post} index={index} />
        ))}
      </ol>
    </Frame>
  )
}
