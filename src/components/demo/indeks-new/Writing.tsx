import { ArrowUpRight } from "lucide-react"
import { Expander } from "./Expander"
import { GlyphMedia } from "./GlyphMedia"
import { NewMark } from "./NewMark"
import { PostLink } from "./PostLink"
import type { PostRow } from "./types"

/** Tyle wpisów widać od razu; reszta za „Pokaż wszystkie”. */
const VISIBLE = 7

/**
 * Wpisy pogrupowane latami (rok w lewym pasie tylko przy pierwszym wpisie
 * roku — ta sama siatka co grupy realizacji). Myszą okładka wpisu odkodowuje
 * się na marginesie; na telefonie najnowszy wpis ma okładkę w kolumnie
 * (odkodowaną, gdy wejdzie w kadr) — media w treści tam, gdzie nie ma marginesu.
 */
export function Writing({
  posts,
  link,
  labels,
}: {
  posts: readonly PostRow[]
  link: { label: string; href: string }
  labels: { newPost: string; more: string; less: string; play: string; pause: string }
}) {
  const [latest] = posts
  const rows = posts.map((post, index) => (
    <Row
      key={post.slug}
      post={post}
      showYear={index === 0 || posts[index - 1]?.year !== post.year}
      newLabel={labels.newPost}
    />
  ))

  return (
    <>
      {latest && (
        <a
          href={latest.href}
          tabIndex={-1}
          aria-hidden="true"
          className="ixn-latest mb-4 block fm-press-soft xl:hidden"
        >
          <GlyphMedia
            frame={{ src: latest.image, width: 16, height: 9 }}
            decode="view"
            wave="panel"
            origin="top"
            title={latest.title}
            labels={labels}
            className="rounded-fm-xl"
          />
        </a>
      )}
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
              className="ixn-arrow size-3.5 max-md:hidden md:-me-[1.125rem]"
            />
          </a>
        }
      />
    </>
  )
}

function Row({ post, showYear, newLabel }: { post: PostRow; showYear: boolean; newLabel: string }) {
  return (
    <li className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[var(--ixn-lane)_1fr]">
      <span className="pt-[0.8125rem] text-fm-small text-fm-ink-3 tabular-nums">
        {showYear ? post.year : ""}
      </span>
      <PostLink slug={post.slug} href={post.href}>
        <span className="min-w-0 flex-1 text-pretty">
          <span className="tracking-[-0.01em]">{post.title}</span>
          {post.isNew && <NewMark label={newLabel} />}
          <ArrowUpRight
            aria-hidden="true"
            className="ixn-arrow ms-1 inline size-3.5 -translate-y-px align-middle text-fm-ink-3"
          />
        </span>
        <time
          dateTime={post.iso}
          className="ixn-row__meta shrink-0 text-fm-small text-fm-ink-3 tabular-nums transition-colors duration-150"
        >
          {post.day}
        </time>
      </PostLink>
    </li>
  )
}
