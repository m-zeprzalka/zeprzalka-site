"use client"

import { ArrowUpRight } from "lucide-react"
import { Expander } from "./Expander"
import { NewBadge } from "./NewBadge"
import { point } from "./store"
import type { Post } from "./types"

/** Tyle wpisów widać od razu; reszta za „Pokaż wszystkie”. */
const VISIBLE = 7

/**
 * Wpisy pogrupowane latami (rok w lewym pasie tylko przy pierwszym wpisie
 * danego roku — ta sama siatka co grupy realizacji). Wskazanie albo fokus
 * wiersza pokazuje w scenie okładkę i opis wpisu; sam spis zostaje tekstem.
 */
export function Writing({
  posts,
  link,
  labels,
}: {
  posts: readonly Post[]
  link: { label: string; href: string }
  labels: { newPost: string; more: string; less: string }
}) {
  const rows = posts.map((post, index) => (
    <Row
      key={post.slug}
      post={post}
      showYear={index === 0 || posts[index - 1]?.year !== post.year}
      newLabel={labels.newPost}
    />
  ))

  return (
    <Expander
      head={<ol>{rows.slice(0, VISIBLE)}</ol>}
      rest={<ol>{rows.slice(VISIBLE)}</ol>}
      count={posts.length}
      labels={labels}
      aside={
        <a
          href={link.href}
          className="group inline-flex h-11 items-center gap-1 rounded-full text-fm-small font-medium text-fm-ink-2 fm-focus transition-colors duration-150 hover:text-fm-ink sm:h-10"
        >
          {link.label}
          {/* Strzałka wystaje poza kolumnę — tekst kończy się na linii dat. */}
          <ArrowUpRight
            aria-hidden="true"
            className="tk-arrow size-3.5 max-md:hidden md:-me-[1.125rem]"
          />
        </a>
      }
    />
  )
}

function Row({ post, showYear, newLabel }: { post: Post; showYear: boolean; newLabel: string }) {
  const show = () => point("blog", { post: post.slug })

  return (
    <li className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[var(--tk-lane)_1fr]">
      <span className="pt-[0.8125rem] text-fm-small text-fm-ink-3 tabular-nums">
        {showYear ? post.year : ""}
      </span>
      <a
        href={post.href}
        onPointerEnter={(event) => event.pointerType === "mouse" && show()}
        onFocus={show}
        className="tk-row tk-bleed group flex min-h-12 items-baseline gap-4 rounded-fm-lg py-3 text-fm-ink fm-focus"
      >
        <span className="min-w-0 flex-1 text-pretty">
          <span className="tracking-[-0.01em] xl:text-[1.0625rem]">{post.title}</span>
          {post.isNew && <NewBadge label={newLabel} />}
        </span>
        <time
          dateTime={post.date}
          className="tk-row__meta shrink-0 text-fm-small text-fm-ink-3 tabular-nums transition-colors duration-150"
        >
          {post.day}
        </time>
      </a>
    </li>
  )
}
