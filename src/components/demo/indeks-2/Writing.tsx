"use client"

import { useRef, useState } from "react"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { SECTION } from "./anchors"
import { cardHandlers, useCardActive } from "./card-store"
import { COL } from "./grid"
import { SectionHead } from "./SectionHead"
import type { Indeks2Content } from "./content"
import type { PostRow } from "./types"

/** Tyle wpisów widać od razu; reszta za „Pokaż wszystkie”. */
const VISIBLE = 6

/**
 * Wpisy jako indeks: rok w lewym pasie przy pierwszym wpisie roku, dzień
 * i miesiąc z prawej. Myszą okładka wychodzi na margines. „Pokaż wszystkie”
 * rozwija resztę w miejscu; „Zwiń” wraca do przycisku, jeśli uciekł z kadru.
 */
export function Writing({
  blog,
  labels,
}: {
  blog: Indeks2Content["blog"]
  labels: { newPost: string; more: string; less: string }
}) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const rows = open ? blog.posts : blog.posts.slice(0, VISIBLE)

  function toggle() {
    const next = !open
    setOpen(next)
    if (!next)
      requestAnimationFrame(() => {
        const button = toggleRef.current
        if (button && button.getBoundingClientRect().top < 0)
          button.scrollIntoView({ block: "center" })
      })
  }

  return (
    <section
      id={SECTION.blog}
      aria-labelledby={`${SECTION.blog}-title`}
      className="pt-(--i2-section)"
    >
      <div className="i2-grid">
        <div className={COL.text}>
          <SectionHead id={`${SECTION.blog}-title`} title={blog.title} lead={blog.lead} />
          <ol className="-mx-(--i2-bleed) mt-8 sm:mt-10">
            {rows.map((post, index) => (
              <Row
                key={post.slug}
                post={post}
                showYear={index === 0 || rows[index - 1]?.year !== post.year}
                newLabel={labels.newPost}
              />
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              onClick={toggle}
              className="inline-flex h-11 fm-press items-center gap-2 rounded-full bg-fm-fill ps-4 pe-3.5 text-fm-small font-medium text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 hover:bg-fm-fill-strong hover:text-fm-ink"
            >
              {open ? labels.less : labels.more}
              <ChevronDown
                aria-hidden="true"
                className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
              />
            </button>
            <a
              href={blog.link.href}
              className="group inline-flex h-11 items-center gap-2 rounded-full text-fm-small font-medium text-fm-ink fm-focus"
            >
              {blog.link.label}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-fm-ink-3 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ post, showYear, newLabel }: { post: PostRow; showYear: boolean; newLabel: string }) {
  const active = useCardActive(`post:${post.slug}`)
  return (
    <li>
      <a
        href={post.href}
        data-active={active || undefined}
        {...cardHandlers(`post:${post.slug}`, { tap: false })}
        className="group grid min-h-12 grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-4 rounded-[1.375rem] px-(--i2-bleed) py-3 fm-focus transition-colors duration-150 hover:bg-fm-fill data-active:bg-fm-fill sm:grid-cols-[5rem_1fr_auto]"
      >
        <span className="text-fm-small text-fm-ink-3 tabular-nums">
          {showYear ? post.year : ""}
        </span>
        <span className="min-w-0 text-fm-body leading-snug tracking-[-0.01em] text-pretty text-fm-ink">
          {post.title}
          {post.isNew && (
            <span className="ms-2 inline-flex h-5 -translate-y-px items-center rounded-full bg-fm-ink px-2 align-middle text-[0.6875rem] font-medium text-fm-inverse">
              {newLabel}
            </span>
          )}
        </span>
        <time dateTime={post.iso} className="text-fm-small text-fm-ink-3 tabular-nums">
          {post.day}
        </time>
      </a>
    </li>
  )
}
