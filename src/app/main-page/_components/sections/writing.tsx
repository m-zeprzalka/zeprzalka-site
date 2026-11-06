import type { ComponentProps } from "react"
import { SECTION } from "@/app/main-page/_lib/anchors"
import { PostList } from "./post-list"
import { SectionHeading } from "./section-heading"

export function Writing({
  title,
  lead,
  ...list
}: { title: string; lead: string } & ComponentProps<typeof PostList>) {
  return (
    <section id={SECTION.blog} aria-labelledby="blog-title" className="column mt-28 md:mt-36">
      <SectionHeading id="blog-title" title={title} lead={lead} />
      <PostList {...list} />
    </section>
  )
}
