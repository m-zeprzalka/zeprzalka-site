import type { ReactNode } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import type { TransformacjaContent } from "./content"
import { Stat } from "./Stat"
import { StageStill } from "./Stills"

/**
 * Sekcje „gotowego produktu” po scenie — spokojne, w jednym kontenerze
 * i jednym rytmie. Odwaga jest w scenie; tutaj porządek, typografia
 * i prawdziwa treść. Promienie i odstępy czytają tokeny `--tf-r` / `--tf-d`,
 * które odwiedzający może zmienić w panelu „Tokeny”.
 */

export function SectionHead({
  id,
  title,
  lead,
  meta,
  action,
}: {
  id: string
  title: string
  lead: string
  meta?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-[40rem]">
        <h2
          id={id}
          className="flex items-baseline gap-3 text-fm-h2 font-semibold text-balance text-fm-ink"
        >
          {title}
          {meta && (
            <span className="text-fm-small font-medium tracking-normal text-fm-ink-3 tabular-nums">
              {meta}
            </span>
          )}
        </h2>
        <p className="mt-3 text-fm-lead text-pretty text-fm-ink-2">{lead}</p>
      </div>
      {action}
    </div>
  )
}

/** Cztery liczby z „O mnie” — tuż pod hero, jak specyfikacja produktu. */
export function Facts({ facts }: { facts: TransformacjaContent["about"]["facts"] }) {
  return (
    <section id="tf-after" aria-label="Liczby" className="tf-container tf-pad-top scroll-mt-20">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 lg:grid-cols-4 lg:pt-10">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-3">
            <dt className="max-w-[14rem] text-fm-small text-pretty text-fm-ink-3">{fact.label}</dt>
            <dd className="-order-1 text-[1.875rem] leading-none font-medium tracking-[-0.045em] whitespace-nowrap text-fm-ink tabular-nums sm:text-[2.5rem] lg:text-[3.25rem]">
              {typeof fact.value === "number" ? (
                <Stat value={fact.value} suffix={fact.suffix} />
              ) : (
                fact.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/**
 * Kompetencje jako stała sekcja: trzy karty z kadrami etapów, które scena
 * właśnie pokazała (szkic → projekt, kod, produkt) — pełne opisy i narzędzia.
 */
export function Competencies({
  skills,
  competencies,
  stages,
  code,
  poster,
}: {
  skills: TransformacjaContent["skills"]
  competencies: TransformacjaContent["competencies"]
  stages: TransformacjaContent["stages"]
  code: TransformacjaContent["code"]["lines"]
  poster: string
}) {
  const labels = stages.map((stage) => stage.label)
  return (
    <section id="kompetencje" aria-labelledby="tf-skills" className="tf-container tf-pad">
      <SectionHead id="tf-skills" title={skills.title} lead={skills.lead} />
      <div className="tf-skills mt-10 lg:mt-14">
        {competencies.map((competency, index) => (
          <article key={competency.id}>
            <StageStill index={index} stages={labels} code={code} poster={poster} />
            <h3 className="text-[1.25rem] leading-[1.2] font-semibold tracking-[-0.02em] text-balance text-fm-ink lg:text-[1.5rem] lg:tracking-[-0.025em]">
              {competency.title}
            </h3>
            <p className="mt-3 text-fm-body text-pretty text-fm-ink-2 lg:text-[1.0625rem] lg:leading-[1.6]">
              {competency.description}
            </p>
            <ul className="tf-tools mt-4 lg:mt-5">
              {competency.tools.map((tool) => (
                <li
                  key={tool}
                  className="inline-flex h-7 items-center rounded-full bg-fm-surface px-3 text-[0.75rem] font-medium whitespace-nowrap text-fm-ink-2 shadow-fm-ring"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Writing({ blog }: { blog: TransformacjaContent["blog"] }) {
  const [featured, rest] = [blog.posts.slice(0, 3), blog.posts.slice(3, 6)]

  return (
    <section aria-labelledby="tf-blog" className="tf-container tf-pad">
      <SectionHead
        id="tf-blog"
        title={blog.title}
        lead={blog.lead}
        meta={blog.count}
        action={<TextLink href={blog.link.href}>{blog.link.label}</TextLink>}
      />
      <ul className="tf-gap mt-10 grid sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        {featured.map((post, index) => (
          <li key={post.slug} className={cn(index === 2 && "sm:hidden lg:block")}>
            <a href={post.href} className="group block rounded-fm-2xl fm-focus">
              <span className="tf-r-2xl relative block aspect-video overflow-hidden bg-fm-fill shadow-fm-ring">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-fm-snap group-hover:scale-[1.03]"
                />
              </span>
              <span className="mt-4 flex items-center gap-2 text-fm-micro text-fm-ink-3">
                <span className="rounded-full bg-fm-fill px-2 py-0.5 font-medium text-fm-ink-2">
                  {post.categories[0]}
                </span>
                <time dateTime={post.date}>{post.dateLabel}</time>
              </span>
              <span className="mt-2 block text-[1.0625rem] leading-snug font-medium tracking-[-0.015em] text-balance text-fm-ink decoration-fm-edge-strong underline-offset-4 group-hover:underline">
                {post.title}
              </span>
              <span className="mt-1.5 block text-fm-small text-fm-ink-3">{post.readingTime}</span>
            </a>
          </li>
        ))}
      </ul>
      <ul className="mt-10 border-t lg:mt-12">
        {rest.map((post) => (
          <li key={post.slug} className="border-b">
            <a
              href={post.href}
              className="group grid min-h-16 grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-4 fm-focus sm:grid-cols-[9rem_1fr_auto]"
            >
              <time
                dateTime={post.date}
                className="col-span-2 text-fm-small text-fm-ink-3 tabular-nums sm:col-span-1"
              >
                {post.dateLabel}
              </time>
              <span className="text-[1rem] leading-snug font-medium tracking-[-0.01em] text-pretty text-fm-ink">
                {post.title}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-fm-ink-3 transition-[translate,color] duration-200 ease-fm-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fm-ink"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex h-11 w-fit shrink-0 items-center gap-1.5 rounded-full bg-fm-surface ps-5 pe-4 text-sm font-medium text-fm-ink shadow-fm-ring fm-focus transition-[background-color,scale] duration-150 ease-fm-snap select-none hover:bg-fm-fill active:scale-[0.97]"
    >
      {children}
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  )
}
