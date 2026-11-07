"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react"
import { INDEX_ROW } from "@/app/main-page/_components/page/index-row"
import { usePeekHover } from "@/app/main-page/_components/peek/peek-context"
import { Button } from "@/app/main-page/_components/ui/button"
import type { Link as LinkData, Post } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"
import { NewMark } from "./new-mark"

interface Labels {
  newPost: string
  showAll: string
  showLess: string
}

/**
 * Wpisy jako indeks: rok w lewej kolumnie (raz na rok), tytuł, data. Na
 * desktopie najechanie pokazuje okładkę na marginesie; węziej najnowszy wpis
 * ma okładkę nad listą. „Pokaż wszystkie” odsłania resztę listy w miejscu,
 * „Wszystkie artykuły” prowadzi do bloga.
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
  const [latest] = posts

  return (
    <>
      {latest && (
        <Link
          href={latest.href}
          tabIndex={-1}
          aria-hidden="true"
          className="mt-8 block overflow-hidden rounded-2xl bg-muted stage:hidden"
        >
          <Image
            src={latest.cover.src}
            alt=""
            width={latest.cover.width}
            height={latest.cover.height}
            sizes="(min-width: 48rem) 40rem, 100vw"
            className="aspect-video w-full object-cover"
          />
        </Link>
      )}
      <ol className="mt-6 grid stage:mt-8">
        {shown.map((post, index) => (
          <PostRow
            key={post.slug}
            post={post}
            showYear={index === 0 || shown[index - 1]?.year !== post.year}
            newLabel={labels.newPost}
          />
        ))}
      </ol>
      <div className="mt-6 flex items-center justify-between gap-2">
        {posts.length > visible ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="-ms-2.5"
          >
            {expanded ? labels.showLess : labels.showAll}
            <ChevronDownIcon className={cn("transition-transform", expanded && "rotate-180")} />
          </Button>
        ) : (
          <span />
        )}
        <Button asChild variant="ghost" size="sm" className="-me-2.5">
          <Link href={all.href}>
            {all.label}
            <ArrowUpRightIcon />
          </Link>
        </Button>
      </div>
    </>
  )
}

export function PostRow({
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
      <article>
        <Link href={post.href} {...hover} className={INDEX_ROW}>
          <span className="text-pretty">
            {post.title}
            {post.isNew && <NewMark label={newLabel} />}
          </span>
          <time dateTime={post.iso} className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {post.day}
          </time>
        </Link>
      </article>
    </li>
  )
}
