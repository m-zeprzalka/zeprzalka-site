import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllPosts, slugify, type Post } from "@/lib/posts"
import { Reveal } from "@/components/main-fourth/Reveal"
import { Section, SectionHead } from "@/components/main-fourth/Section"
import { pl } from "@/components/main-fourth/typography"
import { blog, sections } from "@/lib/home-content"

const dateFormat = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const pad = (value: number) => String(value + 1).padStart(2, "0")

function Row({ post, index }: { post: Post; index: number }) {
  return (
    <Reveal as="li" i={index} className="m4-entry">
      <article>
        <span className="m4-numeral m4-entry-index">{pad(index)}</span>

        <div className="m4-entry-body">
          <h3 className="m4-entry-title">
            <Link href={`/blog/${post.slug}`} className="m4-entry-link">
              {pl(post.frontmatter.title)}
            </Link>
          </h3>
          <p className="m4-entry-desc">{pl(post.frontmatter.description)}</p>
          <p className="m4-meta">
            <time dateTime={post.frontmatter.date}>
              {dateFormat.format(new Date(post.frontmatter.date))}
            </time>
            <span aria-hidden="true"> · </span>
            {post.readingTime.replace("min read", "min czytania")}
          </p>
          <ul className="m4-entry-tags" aria-label="Kategorie">
            {(post.frontmatter.categories || []).slice(0, 2).map((category) => (
              <li key={category}>
                <Link href={`/blog/kategoria/${slugify(category)}`}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Miniatura dla wąskich ekranów; na szerokich pokazuje ją panel obok. */}
        {post.frontmatter.image && (
          <span className="m4-entry-thumb">
            <Image
              src={post.frontmatter.image}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          </span>
        )}
      </article>
    </Reveal>
  )
}

export function Blog() {
  const posts = getAllPosts().slice(0, blog.postsLimit)

  return (
    <Section meta={sections.blog}>
      <SectionHead
        meta={sections.blog}
        action={
          <Button asChild variant="outline" className="m4-ghost">
            <Link href={blog.cta.href}>
              {blog.cta.label}
              <ArrowUpRight data-icon="inline-end" className="m4-cta-icon" />
            </Link>
          </Button>
        }
      />

      <div className="m4-journal">
        <ol className="m4-entries">
          {posts.map((post, index) => (
            <Row key={post.slug} post={post} index={index} />
          ))}
        </ol>

        {/* Panel podglądu: reaguje na wskazany wiersz czystym CSS (`:has`).
            Dekoracja — treść wiersza jest kompletna bez niego. */}
        <div className="m4-preview-panel" aria-hidden="true">
          {posts.map((post) => (
            <span key={post.slug} className="m4-preview">
              {post.frontmatter.image && (
                <Image
                  src={post.frontmatter.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 34vw, 0px"
                  className="object-cover"
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </Section>
  )
}
