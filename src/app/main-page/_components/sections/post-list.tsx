"use client"

import { useState } from "react"
import { flushSync } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react"
import { INDEX_ROW } from "@/app/main-page/_components/page/index-row"
import { usePeekHover } from "@/app/main-page/_components/peek/peek-context"
import { Button } from "@/app/main-page/_components/ui/button"
import { noOrphans } from "@/app/main-page/_lib/text"
import type { LinkData, Post } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"
import { NewMark } from "./new-mark"
import { COLUMN_SIZES } from "@/app/main-page/_lib/media"

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
            sizes={COLUMN_SIZES}
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
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        {posts.length > visible ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={(event) => {
              // Zwinięcie skraca listę o kilkanaście wierszy — przycisk zostaje tam, gdzie
              // był pod palcem, zamiast strona odjeżdżała do formularza.
              const button = event.currentTarget
              const before = button.getBoundingClientRect().top
              flushSync(() => setExpanded((value) => !value))
              const drift = button.getBoundingClientRect().top - before
              if (drift) window.scrollBy({ top: drift, behavior: "instant" })
            }}
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
            <ArrowRightIcon />
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
    // Ta sama kolumna etykiet co grupy portfolio (9,5 rem od 768 px); węziej rok stoi
    // nad pierwszym wpisem roku, a tytuły mają całą szerokość.
    <li className="grid items-baseline md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-x-6">
      <span
        className={cn(
          "text-sm text-muted-foreground tabular-nums max-md:pt-3",
          !showYear && "max-md:hidden"
        )}
      >
        {showYear ? post.year : ""}
      </span>
      <article>
        <Link href={post.href} {...hover} className={INDEX_ROW}>
          <span className="text-pretty">
            {noOrphans(post.title)}
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
