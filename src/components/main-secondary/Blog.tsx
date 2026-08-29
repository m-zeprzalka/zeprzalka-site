import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllPosts, slugify, type Post } from "@/lib/posts"
import { Reveal } from "@/components/main-secondary/Reveal"
import { Section, SectionHeader } from "@/components/main-secondary/Section"
import { blog, sections } from "@/lib/home-content"

const dateFormat = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
      <ul className="contents" aria-label="Kategorie">
        {(post.frontmatter.categories || []).slice(0, 2).map((category) => (
          <li key={category} className="relative z-10">
            <Badge asChild variant="outline">
              <Link href={`/blog/kategoria/${slugify(category)}`}>
                {category}
              </Link>
            </Badge>
          </li>
        ))}
      </ul>
      <time dateTime={post.frontmatter.date} className="ms-meta">
        {dateFormat.format(new Date(post.frontmatter.date))}
      </time>
      <span className="ms-meta">
        {post.readingTime.replace("min read", "min czytania")}
      </span>
    </div>
  )
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <Reveal
      as="article"
      className="group relative grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted lg:col-span-7">
        {post.frontmatter.image && (
          <Image
            src={post.frontmatter.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        )}
      </div>
      <div className="flex flex-col gap-4 lg:col-span-5">
        <PostMeta post={post} />
        <h3 className="ms-h3 text-balance">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:rounded-xl"
          >
            {post.frontmatter.title}
          </Link>
        </h3>
        <p className="text-lg text-pretty text-muted-foreground">
          {post.frontmatter.description}
        </p>
      </div>
    </Reveal>
  )
}

function PostRow({ post }: { post: Post }) {
  return (
    <article className="group relative grid grid-cols-[1fr_auto] items-center gap-4 py-6 md:grid-cols-[8rem_1fr_auto] md:gap-8">
      <div className="relative hidden aspect-video overflow-hidden rounded-md bg-muted md:block">
        {post.frontmatter.image && (
          <Image
            src={post.frontmatter.image}
            alt=""
            fill
            sizes="128px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <PostMeta post={post} />
        <h3 className="text-lg font-medium leading-snug tracking-tight md:text-xl">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0"
          >
            {post.frontmatter.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground md:line-clamp-1">
          {post.frontmatter.description}
        </p>
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className="size-5 text-muted-foreground transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground motion-reduce:transition-none"
      />
    </article>
  )
}

export function Blog() {
  const [featured, ...rest] = getAllPosts("pl").slice(0, blog.postsLimit)

  return (
    <Section meta={sections.blog}>
      <SectionHeader
        meta={sections.blog}
        action={
          <Button asChild variant="outline" className="group w-fit rounded-full">
            <Link href={blog.cta.href}>
              {blog.cta.label}
              <ArrowUpRight
                data-icon="inline-end"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Button>
        }
      />

      {featured && (
        <div className="flex flex-col gap-10 md:gap-14">
          <FeaturedPost post={featured} />
          <ul className="divide-y border-t">
            {rest.map((post, i) => (
              <Reveal as="li" key={post.slug} delay={i * 60}>
                <PostRow post={post} />
              </Reveal>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
