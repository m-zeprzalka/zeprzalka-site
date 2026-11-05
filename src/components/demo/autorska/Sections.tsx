import { ArrowUpRight } from "lucide-react"
import type { DemoHomeContent } from "../shared/content"
import { GlyphLens, GlyphMedia } from "../shared/glyph"
import { ContactForm } from "./ContactForm"
import { CopyEmail } from "./CopyEmail"
import { SectionHead, Sheet } from "./Sheet"
import { UI } from "./ui-strings"
import { WorksRail } from "./WorksRail"

/** Minimalny link „wszystkie …” obok nagłówka sekcji (bez liczników). */
function AllLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group -me-4 inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-fm-small font-medium text-fm-ink fm-focus transition-colors hover:bg-fm-fill"
    >
      {label}
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  )
}

/** Warstwa — portfolio: osiem realizacji z obecnej strony głównej w karuzeli. */
export function Portfolio({
  portfolio,
  index,
}: {
  portfolio: DemoHomeContent["portfolio"]
  index: number
}) {
  const featured = portfolio.works.filter((work) => work.featured)
  return (
    <Sheet index={index} anchor="portfolio" labelledBy="portfolio-title">
      <SectionHead
        id="portfolio-title"
        title={portfolio.title}
        lead={portfolio.lead}
        aside={<AllLink href={portfolio.link.href} label={UI.allWorks} />}
      />
      <div className="my-auto pt-10 lg:pt-14">
        <WorksRail works={featured} allHref={portfolio.link.href} />
      </div>
    </Sheet>
  )
}

/** Warstwa — blog: najnowszy wpis z okładką ze znaków i pięć kolejnych w liście. */
export function Writing({ blog, index }: { blog: DemoHomeContent["blog"]; index: number }) {
  const [latest, ...rest] = blog.posts
  if (!latest) return null
  return (
    <Sheet index={index} anchor="blog" labelledBy="blog-title">
      <SectionHead
        id="blog-title"
        title={blog.title}
        lead={blog.lead}
        aside={<AllLink href={blog.link.href} label={blog.link.label} />}
      />
      <div className="my-auto grid gap-x-(--au-gap) gap-y-10 pt-10 lg:grid-cols-12 lg:pt-14">
        <a
          href={latest.href}
          data-gx-host=""
          className="group block rounded-(--au-r-card) fm-focus lg:col-span-5"
        >
          {latest.image && (
            <GlyphMedia
              poster={latest.image}
              width={16}
              height={9}
              alt=""
              trigger="view"
              sizes="(min-width: 64rem) 36vw, 100vw"
              className="rounded-(--au-r-media)"
            />
          )}
          <span className="mt-5 block text-fm-small text-fm-ink-3">
            {latest.dateLabel}
            {UI.readingSeparator}
            {latest.readingTime}
          </span>
          <span className="mt-2 block text-[1.5rem] leading-[1.15] font-semibold tracking-[-0.025em] text-balance">
            {latest.title}
          </span>
          <span className="mt-3 line-clamp-3 block text-fm-body text-pretty text-fm-ink-2">
            {latest.description}
          </span>
        </a>
        <ul className="grid content-start gap-1 lg:col-span-6 lg:col-start-7">
          {rest.slice(0, 5).map((post) => (
            <li key={post.slug}>
              <a
                href={post.href}
                className="group -mx-3 flex items-baseline gap-4 rounded-[0.875rem] px-3 py-3.5 fm-focus transition-colors hover:bg-fm-fill sm:gap-6"
              >
                <span className="w-[5.5rem] shrink-0 text-fm-small text-fm-ink-3 tabular-nums">
                  {post.dateLabel}
                </span>
                <span className="flex-1 font-medium text-pretty">{post.title}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 shrink-0 translate-y-0.5 text-fm-ink-3 transition-[color,translate] duration-200 group-hover:text-fm-ink"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Sheet>
  )
}

/**
 * Ostatnia warstwa — kontakt: pole kodu (organiczna plama binarnego „deszczu” idzie za
 * kursorem i palcem, wnętrze w 100% czarne) z zaproszeniem na konsultację i formularz.
 */
export function Contact({
  contact,
  cta,
  email,
  copiedLabel,
  index,
}: {
  contact: DemoHomeContent["contact"]
  cta: string
  email: string
  copiedLabel: string
  index: number
}) {
  return (
    <Sheet index={index} last anchor="kontakt" labelledBy="kontakt-title">
      <SectionHead id="kontakt-title" title={contact.title} lead={contact.lead} />
      <div className="mt-10 grid gap-x-(--au-gap) gap-y-12 lg:mt-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <GlyphLens className="flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-(--au-r-card) bg-fm-fill/60 p-6 sm:min-h-[24rem] sm:p-8 lg:min-h-[30rem]">
            <p
              aria-label={UI.lens}
              className="max-w-[12ch] text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-white mix-blend-difference"
            >
              {cta}
            </p>
            <div className="flex flex-col items-start gap-4">
              <p className="inline-flex min-h-9 items-center rounded-full bg-(--au-sheet) px-4 text-fm-small text-fm-ink-2">
                {contact.response.label}&nbsp;
                <span className="font-medium text-fm-ink">{contact.response.value}</span>
              </p>
              <CopyEmail
                email={email}
                label={UI.copyEmail}
                copiedLabel={copiedLabel}
                className="bg-fm-ink text-fm-inverse hover:bg-fm-ink/85"
              />
            </div>
          </GlyphLens>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <h3 className="text-[1.5rem] leading-tight font-semibold tracking-[-0.025em]">
            {contact.cardTitle}
          </h3>
          <p className="mt-2 mb-8 max-w-[44ch] text-fm-body text-pretty text-fm-ink-2">
            {contact.cardDescription}
          </p>
          <ContactForm
            copy={contact.form}
            errors={contact.errors}
            privacyHref={contact.privacyHref}
          />
        </div>
      </div>
    </Sheet>
  )
}
