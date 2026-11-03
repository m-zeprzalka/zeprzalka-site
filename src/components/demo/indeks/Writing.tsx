import { ArrowUpRight } from "lucide-react"
import { Expander } from "./Expander"
import { NewMark } from "./NewMark"
import type { PostRow } from "./types"

/** Tyle wpisów widać od razu; reszta za „Pokaż wszystkie”. */
const VISIBLE = 7

/**
 * Wpisy pogrupowane latami (rok w lewej kolumnie tylko przy pierwszym wpisie
 * danego roku — ta sama siatka co grupy realizacji). Najnowszy wpis dostaje
 * odręczną elipsę „Nowy”, rysowaną, gdy wiersz wejdzie w kadr (CSS view timeline).
 */
export function Writing({
  posts,
  link,
  labels,
}: {
  posts: readonly PostRow[]
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
          {/* Strzałka wystaje poza kolumnę — tekst kończy się na tej samej linii co daty. */}
          <ArrowUpRight
            aria-hidden="true"
            className="ix-arrow size-3.5 max-md:hidden md:-me-[1.125rem]"
          />
        </a>
      }
    />
  )
}

function Row({ post, showYear, newLabel }: { post: PostRow; showYear: boolean; newLabel: string }) {
  return (
    <li className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[var(--ix-lane)_1fr]">
      <span className="pt-[0.8125rem] text-fm-small text-fm-ink-3 tabular-nums">
        {showYear ? post.year : ""}
      </span>
      <a
        href={post.href}
        className="ix-row ix-bleed group flex min-h-12 items-baseline gap-4 rounded-fm-lg py-3 text-fm-ink fm-focus"
      >
        <span className="min-w-0 flex-1 text-pretty">
          <span className="tracking-[-0.01em]">{post.title}</span>
          {post.isNew && <NewMark label={newLabel} />}
          <ArrowUpRight
            aria-hidden="true"
            className="ix-arrow ms-1 inline size-3.5 -translate-y-px align-middle text-fm-ink-3"
          />
        </span>
        <time
          dateTime={post.iso}
          className="ix-row__meta shrink-0 text-fm-small text-fm-ink-3 tabular-nums transition-colors duration-150"
        >
          {post.day}
        </time>
      </a>
    </li>
  )
}
