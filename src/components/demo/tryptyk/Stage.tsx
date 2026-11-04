"use client"

import type { CSSProperties, KeyboardEvent, ReactNode } from "react"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Chip } from "@/components/demo/forma/Chip"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { cn } from "../forma/cn"
import { STAGE_ID, STAGE_SIZES, workAnchor, type SectionId } from "./anchors"
import { useHasStage } from "./hooks"
import { LocalTime } from "./LocalTime"
import { Media } from "./Media"
import { point, stageKey, useStage, type Enter } from "./store"
import { Swap } from "./Swap"
import type { Competency, Post, Work } from "./types"

export interface StageProps {
  works: readonly Work[]
  posts: readonly Post[]
  competencies: readonly Competency[]
  reel: { webm: string; mp4: string; poster: string; width: number; height: number }
  portfolio: { title: string; meta: string }
  /** Główne wezwanie do działania — w stopce slajdów od kompetencji do bloga. */
  cta: string
  experience: { heading: string; entries: readonly { period: string; role: string }[] }
  person: {
    name: string
    email: string
    locality: string
    avatar: string
    socials: readonly { label: string; url: string }[]
  }
  response: { label: string; value: string }
  worksLink: { label: string; href: string }
  sectionLabel: Record<SectionId, string>
  labels: {
    stage: string
    play: string
    pause: string
    previous: string
    next: string
    copied: string
    newTab: string
  }
}

/** Pasek miniatur: najwyżej tyle kadrów naraz. */
const STRIP = 6

const TITLE = "text-[1.0625rem] leading-6 font-medium tracking-[-0.015em] text-fm-ink"

/**
 * Scena — prawe skrzydło tryptyku (od 1024 px), na wysokość ekranu jak
 * lewa szyna. Pokazuje media do tego, co jest czytane (scroll-spy) albo
 * wskazane (hover, fokus, klik): reel przy wstępie, dowody kompetencji,
 * wybraną realizację, okładkę wpisu, portret przy kontakcie. Rama stoi,
 * zmieniają się tylko warstwy (`Swap`), więc kolumna tekstu nigdy się nie
 * przelewa. Realizacje mają strzałki (‹ › i ← →) i pasek sąsiednich kadrów.
 */
export function Stage(props: StageProps) {
  const { works, posts, competencies, sectionLabel, labels } = props
  const hasStage = useHasStage()
  const key = useStage(stageKey)
  const enter = useStage((s) => s.enter)
  const work = useStage((s) => s.work)
  const current = works.find((item) => item.slug === work) ?? works[0]

  function pick(slug: string, how: Enter = "fade") {
    point("realizacje", { work: slug, enter: how })
  }

  function step(delta: 1 | -1) {
    if (!current) return
    const next = works[(works.indexOf(current) + delta + works.length) % works.length]
    if (next) pick(next.slug, delta > 0 ? "next" : "prev")
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!key.startsWith("work:")) return
    if (event.key === "ArrowRight") step(1)
    else if (event.key === "ArrowLeft") step(-1)
    else return
    event.preventDefault()
  }

  function render(id: string): ReactNode {
    const [kind, slug = ""] = id.split(":")
    const active = hasStage && id === key
    if (kind === "work") {
      const item = works.find((entry) => entry.slug === slug) ?? works[0]
      return item ? (
        <WorkSlide work={item} active={active} props={props} onStep={step} onPick={pick} />
      ) : null
    }
    if (kind === "post") {
      const post = posts.find((entry) => entry.slug === slug) ?? posts[0]
      return post ? <PostSlide post={post} label={sectionLabel.blog} cta={props.cta} /> : null
    }
    if (kind === "skill") {
      const index = Math.max(
        0,
        competencies.findIndex((entry) => entry.id === slug)
      )
      const skill = competencies[index]
      return skill ? (
        <SkillSlide
          skill={skill}
          position={`${index + 1} / ${competencies.length}`}
          works={works}
          label={sectionLabel.kompetencje}
          cta={props.cta}
        />
      ) : null
    }
    if (kind === "kontakt") return <ContactSlide props={props} />
    return <ReelSlide props={props} active={active} onPick={pick} />
  }

  return (
    <aside
      id={STAGE_ID}
      aria-label={labels.stage}
      onKeyDown={onKeyDown}
      className="tk-stage sticky hidden self-start lg:col-start-2 lg:row-start-1 lg:block xl:col-start-3"
    >
      <div className="tk-stage__card relative rounded-fm-3xl bg-fm-surface shadow-fm-card">
        <div className="@container absolute inset-2">
          <Swap id={key} enter={enter} render={render} />
        </div>
      </div>
    </aside>
  )
}

/* ——— Szkielet slajdu: pasek, lightbox, podpis (góra) i stopka (dół) ——— */

function Slide({
  label,
  meta,
  media,
  children,
  footer,
}: {
  label: string
  meta?: ReactNode
  media: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 shrink-0 items-center justify-between gap-3 px-3 text-[0.8125rem]">
        <span className="font-medium text-fm-ink-2">{label}</span>
        {meta && <span className="text-fm-ink-3 tabular-nums">{meta}</span>}
      </div>
      <div className="tk-lightbox relative grid w-full place-items-center overflow-hidden rounded-fm-2xl bg-fm-fill">
        {media}
      </div>
      <div className="tk-caption relative flex flex-col px-3 pt-4 pb-1">
        {children}
        {footer && <div className="mt-auto pt-4">{footer}</div>}
      </div>
    </div>
  )
}

/**
 * Wezwanie do działania w stopce slajdu — od drugiej sekcji scena kończy się
 * akcją (przy wstępie przycisk stoi w treści, przy kontakcie jest formularz).
 * Identyczne na kolejnych slajdach, więc przy przenikaniu nie widać zmiany.
 */
function Cta({ label }: { label: string }) {
  return (
    <a
      href="#kontakt"
      className="group mt-4 flex h-11 fm-press items-center justify-center gap-2 rounded-full bg-fm-ink px-5 text-[0.875rem] font-medium whitespace-nowrap text-fm-inverse fm-focus transition-[background-color,scale] duration-150 hover:bg-fm-ink/85 @max-[20rem]:px-4 @max-[20rem]:text-[0.8125rem]"
    >
      {label}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5 @max-[20rem]:hidden"
      />
    </a>
  )
}

/** Pasek miniatur — kadry obok bieżącego; klik przełącza scenę. */
function Strip({
  items,
  current,
  onPick,
  wide = false,
  className,
}: {
  items: readonly Work[]
  current?: string
  onPick: (slug: string, how: Enter) => void
  /** Większe kadry w czterech kolumnach (scena przy wstępie). */
  wide?: boolean
  className?: string
}) {
  const at = items.findIndex((item) => item.slug === current)
  return (
    <ul className={cn("grid gap-1.5", wide ? "grid-cols-4" : "grid-cols-6", className)}>
      {items.map((item, index) => (
        <li key={item.slug} className="min-w-0">
          <button
            type="button"
            aria-label={item.title}
            aria-current={item.slug === current || undefined}
            onClick={() => onPick(item.slug, at < 0 ? "fade" : index > at ? "next" : "prev")}
            className="tk-strip relative block aspect-[4/3] w-full overflow-hidden rounded-fm-sm bg-fm-fill fm-focus"
          >
            <Image src={item.poster} alt="" fill sizes="64px" className="object-cover" />
          </button>
        </li>
      ))}
    </ul>
  )
}

/** Okno kadrów z grupy wokół bieżącego (najwyżej `STRIP`). */
function siblings(works: readonly Work[], work: Work): Work[] {
  const group = works.filter((item) => item.group === work.group)
  const at = group.indexOf(work)
  const start = Math.max(0, Math.min(at - Math.floor(STRIP / 2), group.length - STRIP))
  return group.slice(start, start + STRIP)
}

function WorkSlide({
  work,
  active,
  props,
  onStep,
  onPick,
}: {
  work: Work
  active: boolean
  props: StageProps
  onStep: (delta: 1 | -1) => void
  onPick: (slug: string, how: Enter) => void
}) {
  const { works, labels, sectionLabel, worksLink } = props
  const external = work.url ? new URL(work.url).hostname.replace(/^www\./, "") : null

  return (
    <Slide
      label={sectionLabel.realizacje}
      meta={`${work.index} / ${works.length}`}
      media={
        <Media
          title={work.title}
          poster={work.poster}
          video={work.video}
          ratio={work.width / work.height}
          active={active}
          sizes={STAGE_SIZES}
          labels={labels}
          className="tk-fit rounded-fm-lg shadow-fm-card"
          data-stage-media={`work:${work.slug}`}
        />
      }
      footer={
        <>
          <Strip items={siblings(works, work)} current={work.slug} onPick={onPick} />
          <div className="mt-3 flex items-center justify-between gap-2">
            <a
              href={work.url ?? worksLink.href}
              {...(work.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="-ms-2 inline-flex h-9 items-center gap-1 rounded-full px-2 text-fm-small font-medium text-fm-ink fm-focus transition-colors duration-150 hover:bg-fm-fill"
            >
              {external ?? worksLink.label}
              <ArrowUpRight aria-hidden="true" className="size-3.5 text-fm-ink-3" />
              {external && <span className="sr-only"> ({labels.newTab})</span>}
            </a>
            <div className="-me-1 flex items-center gap-1">
              <PagerButton label={labels.previous} onClick={() => onStep(-1)}>
                <ChevronLeft aria-hidden="true" className="size-4" />
              </PagerButton>
              <PagerButton label={labels.next} onClick={() => onStep(1)}>
                <ChevronRight aria-hidden="true" className="size-4" />
              </PagerButton>
            </div>
          </div>
          <Cta label={props.cta} />
        </>
      }
    >
      <p className={cn(TITLE, "truncate")}>{work.title}</p>
      <p className="truncate text-fm-small text-fm-ink-3">
        {work.category}
        <span aria-hidden="true" className="text-fm-edge-strong">
          {" / "}
        </span>
        <span className="sr-only">, </span>
        {work.groupLabel}
      </p>
      <p className="mt-2 line-clamp-3 text-fm-small text-pretty text-fm-ink-2">{work.caption}</p>
    </Slide>
  )
}

function PagerButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-9 fm-press place-items-center rounded-full bg-fm-fill text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 hover:bg-fm-fill-strong hover:text-fm-ink"
    >
      {children}
    </button>
  )
}

function PostSlide({ post, label, cta }: { post: Post; label: string; cta: string }) {
  return (
    <Slide
      label={label}
      meta={<time dateTime={post.date}>{post.dateLabel}</time>}
      media={
        <div
          style={{ "--r": 16 / 9 } as CSSProperties}
          className="tk-fit tk-ring tk-skeleton relative overflow-hidden rounded-fm-lg shadow-fm-card"
        >
          <Image src={post.image} alt="" fill sizes={STAGE_SIZES} className="object-cover" />
        </div>
      }
      footer={
        <>
          <p className="flex items-center justify-between text-fm-small text-fm-ink-3">
            {post.readingTime}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </p>
          <Cta label={cta} />
        </>
      }
    >
      <a
        href={post.href}
        className={cn(
          TITLE,
          "line-clamp-2 rounded-fm-xs fm-focus after:absolute after:inset-0 after:content-['']"
        )}
      >
        {post.title}
      </a>
      <p className="mt-2 line-clamp-4 text-fm-small text-pretty text-fm-ink-2">
        {post.description}
      </p>
    </Slide>
  )
}

function SkillSlide({
  skill,
  position,
  works,
  label,
  cta,
}: {
  skill: Competency
  position: string
  works: readonly Work[]
  label: string
  cta: string
}) {
  const proofs = skill.proofs.slugs
    .map((slug) => works.find((work) => work.slug === slug))
    .filter((work): work is Work => !!work)
  // Kadry poziome (zrzuty serwisów) w dwóch wierszach, pionowe (wideo) w siatce 2 × 2.
  const wide = proofs.reduce((sum, work) => sum + work.width / work.height, 0) / proofs.length > 1.3
  const tiles = proofs.slice(0, wide ? 2 : 4)

  return (
    <Slide
      label={label}
      meta={position}
      media={
        <ul
          className={cn(
            "grid size-full gap-2 p-2",
            wide ? "grid-rows-2" : "grid-cols-2 grid-rows-2"
          )}
        >
          {tiles.map((work) => (
            <li key={work.slug} className="min-h-0">
              <a
                href={`#${workAnchor(work.slug)}`}
                aria-label={work.title}
                className="tk-ring tk-skeleton group relative block size-full overflow-hidden rounded-fm-lg fm-focus"
              >
                <Image
                  src={work.poster}
                  alt=""
                  fill
                  sizes="13rem"
                  className="object-cover transition-transform duration-500 ease-fm-snap group-hover:scale-[1.03]"
                />
              </a>
            </li>
          ))}
        </ul>
      }
      footer={
        <>
          <a
            href={`#${workAnchor(proofs[0]?.slug ?? "")}`}
            className="group -mx-2 flex h-9 items-center justify-between gap-3 rounded-full px-2 text-fm-small fm-focus transition-colors duration-150 hover:bg-fm-fill"
          >
            <span className="text-fm-ink">{skill.proofs.label}</span>
            <span className="flex items-center gap-1.5 text-fm-ink-3 tabular-nums">
              {skill.proofs.meta}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </span>
          </a>
          <Cta label={cta} />
        </>
      }
    >
      <p className={cn(TITLE, "truncate")}>{skill.title}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {skill.tools.map((tool) => (
          <li key={tool}>
            <Chip className="h-6 px-2.5 text-[0.8125rem]">{tool}</Chip>
          </li>
        ))}
      </ul>
    </Slide>
  )
}

function ReelSlide({
  props,
  active,
  onPick,
}: {
  props: StageProps
  active: boolean
  onPick: (slug: string, how: Enter) => void
}) {
  const { reel, person, labels, sectionLabel, portfolio, works } = props
  const featured = works.filter((work) => work.featured).slice(0, 8)

  return (
    <Slide
      label={sectionLabel.start}
      media={
        <Media
          title={person.name}
          poster={reel.poster}
          video={{ webm: reel.webm, mp4: reel.mp4 }}
          ratio={reel.width / reel.height}
          active={active}
          sizes={STAGE_SIZES}
          eager
          labels={labels}
          className="absolute inset-0"
        />
      }
      footer={
        <a
          href="#realizacje"
          className="group -mx-2 flex h-9 items-center justify-between gap-3 rounded-full px-2 text-fm-small fm-focus transition-colors duration-150 hover:bg-fm-fill"
        >
          <span className="font-medium text-fm-ink">{portfolio.title}</span>
          <span className="flex items-center gap-1.5 text-fm-ink-3 tabular-nums">
            {portfolio.meta}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </span>
        </a>
      }
    >
      {/* Treść slajdu idzie od góry jednym blokiem (doświadczenie, wyróżnione kadry
          w dwóch rzędach), a link do portfolio stoi w stopce — luz zostaje nad stopką. */}
      <p className="text-fm-small text-fm-ink-3">{props.experience.heading}</p>
      <ol className="mt-2 grid gap-1.5 text-fm-small">
        {props.experience.entries.map((entry) => (
          <li
            key={entry.role}
            className="grid grid-cols-[6.5rem_1fr] gap-3 @max-[20rem]:grid-cols-1 @max-[20rem]:gap-0"
          >
            <span className="text-fm-ink-3 tabular-nums">{entry.period}</span>
            <span className="text-fm-ink">{entry.role}</span>
          </li>
        ))}
      </ol>
      <Strip items={featured} onPick={onPick} wide className="mt-5" />
    </Slide>
  )
}

function ContactSlide({ props }: { props: StageProps }) {
  const { person, response, labels, sectionLabel } = props

  return (
    <Slide
      label={sectionLabel.kontakt}
      meta={<LocalTime locality={person.locality} />}
      media={
        // eslint-disable-next-line @next/next/no-img-element -- mały PNG z grafiką ASCII, bez wariantów
        <img src={person.avatar} alt="" width={300} height={300} className="tk-portrait w-[92%]" />
      }
      footer={
        <ul className="-ms-2 flex items-center gap-1 pb-1 text-fm-small">
          {person.socials.map((profile) => (
            <li key={profile.url}>
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-9 items-center gap-0.5 rounded-full px-2 text-fm-ink-2 fm-focus transition-colors duration-150 hover:bg-fm-fill hover:text-fm-ink"
              >
                {profile.label}
                <ArrowUpRight aria-hidden="true" className="tk-arrow size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      }
    >
      <CopyButton
        value={person.email}
        label={person.email}
        copiedLabel={labels.copied}
        className="h-11 w-full justify-between bg-fm-fill ps-4 pe-4 shadow-none hover:bg-fm-fill-strong"
      />
      <p className="mt-3 flex items-baseline justify-between gap-3 text-fm-small">
        <span className="text-fm-ink-3">{response.label}</span>
        <span className="text-right text-fm-ink-2">{response.value}</span>
      </p>
    </Slide>
  )
}
