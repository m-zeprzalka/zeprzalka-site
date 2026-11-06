"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react"
import { usePeekHover } from "@/app/main-page/_components/peek/peek-context"
import { Badge } from "@/app/main-page/_components/ui/badge"
import { Button } from "@/app/main-page/_components/ui/button"
import type { Link as LinkData, Post } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"

interface Labels {
  newPost: string
  showAll: string
  showLess: string
}

/**
 * Wpisy jako indeks: rok w lewej kolumnie (raz na rok), tytuł, data. Najechanie
 * pokazuje okładkę na marginesie. „Pokaż wszystkie” odsłania resztę listy
 * w miejscu, „Wszystkie artykuły” prowadzi do bloga.
 */
export function PostList({
  posts,
  visible,
  all,
  labels,
}: {
  posts: readonly Post[]
  visible: number
  all: LinkData
  labels: Labels
}) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? posts : posts.slice(0, visible)

  return (
    <>
      <ol className="mt-8 grid">
        {shown.map((post, index) => (
          <PostRow
            key={post.slug}
            post={post}
            showYear={index === 0 || shown[index - 1]?.year !== post.year}
            newLabel={labels.newPost}
          />
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {posts.length > visible && (
          <Button
            variant="secondary"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            {expanded ? labels.showLess : labels.showAll}
            <ChevronDownIcon className={cn("transition-transform", expanded && "rotate-180")} />
          </Button>
        )}
        <Button asChild variant="ghost" className="ml-auto">
          <Link href={all.href}>
            {all.label}
            <ArrowUpRightIcon />
          </Link>
        </Button>
      </div>
    </>
  )
}

function PostRow({
  post,
  showYear,
  newLabel,
}: {
  post: Post
  showYear: boolean
  newLabel: string
}) {
  const hover = usePeekHover(`post-${post.slug}`)

  return (
    <li className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline gap-x-4 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
      <span className="text-sm text-muted-foreground tabular-nums">
        {showYear ? post.year : ""}
      </span>
      <Link
        href={post.href}
        {...hover}
        className="flex min-h-11 items-baseline justify-between gap-4 rounded-xl px-3 py-2.5 outline-none hover:bg-accent/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span className="text-pretty">
          {post.title}
          {post.isNew && (
            <Badge variant="outline" className="ml-2 -translate-y-px align-middle">
              {newLabel}
            </Badge>
          )}
        </span>
        <time dateTime={post.iso} className="shrink-0 text-sm text-muted-foreground tabular-nums">
          {post.day}
        </time>
      </Link>
    </li>
  )
}
