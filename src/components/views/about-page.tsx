import Link from "next/link"
import { DownloadIcon } from "lucide-react"
import { LinkArrow } from "@/components/page/link-arrow"
import { LabelRow } from "@/components/page/label-row"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { JsonLd } from "@/components/seo/json-ld"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PAGE_SECTION } from "@/lib/anchors"
import { breadcrumb } from "@/lib/content/pages"
import { lecturesOf } from "@/lib/content/peeks"
import { getSource } from "@/lib/content/source"
import { pageHref } from "@/lib/routes"
import { noOrphans } from "@/lib/text"
import type { Locale } from "@/i18n/config"
import { profilePageSchema } from "@/lib/page-schema"
import { CONTACT_EMAIL, CV_PDF, SITE_HOST, absoluteUrl } from "@/lib/site"

/** Kotwice sekcji „O mnie” (`lib/anchors.ts`). */
const ID = PAGE_SECTION

/**
 * O mnie — biogram i CV na jednej stronie: doświadczenie, umiejętności
 * i edukacja w rytmie kolumny etykiet (okres, kategoria), na końcu dwa działania:
 * rozmowa i PDF z CV. Wykłady trwają: okres „2016–obecnie” i opis bez nazw
 * uczelni — tak samo jak na starcie (`lecturesOf`).
 */
export function AboutPage({ locale }: { locale: Locale }) {
  const source = getSource(locale)
  const { common, about } = source
  const lectures = lecturesOf(source)
  const experience = about.experience.map((job) =>
    job === source.teaching
      ? { ...job, period: lectures.period, description: lectures.summary }
      : job
  )

  return (
    <>
      <JsonLd data={profilePageSchema(locale)} />
      <PageHeader
        breadcrumb={breadcrumb(locale, common.nav.about)}
        title={about.name}
        lead={about.role}
      >
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-2 rounded-full bg-success" />
            {about.status}
          </li>
          <li>{about.location}</li>
          <li>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-foreground">
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>
            {/* Adres bezwzględny — ta strona drukuje się do CV w PDF; start w języku strony. */}
            <a href={absoluteUrl(pageHref("home", locale))} className="hover:text-foreground">
              {SITE_HOST}
            </a>
          </li>
        </ul>
      </PageHeader>

      <Section id={ID.bio} title={about.aboutHeading}>
        <div className="mt-6 grid gap-5 text-lg text-pretty text-muted-foreground">
          <p>
            {about.bioLeadPrefix}
            <strong className="font-medium text-foreground">{about.bioLeadStrong}</strong>
            {noOrphans(about.bioLeadSuffix)}
          </p>
          <p>
            {noOrphans(about.bioSecondPrefix)}
            <strong className="font-medium text-foreground">{about.bioSecondStrong}</strong>
            {noOrphans(about.bioSecondSuffix)}
          </p>
        </div>
      </Section>

      <Section id={ID.experience} title={about.experienceHeading}>
        <ol className="mt-8 grid gap-10">
          {experience.map((job) => (
            <li key={job.role}>
              <LabelRow
                label={
                  <>
                    <span className="block">{job.period}</span>
                    <span className="block text-foreground">{job.company}</span>
                  </>
                }
                labelAs="div"
                labelAfter
              >
                <h3 className="font-medium">{job.role}</h3>
                <p className="mt-1 text-pretty text-muted-foreground">
                  {noOrphans(job.description)}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <li key={tag}>
                      <Badge variant="secondary" size="md">
                        {tag}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </LabelRow>
            </li>
          ))}
        </ol>
      </Section>

      <Section id={ID.skills} title={about.skillsHeading}>
        <div className="mt-8 grid gap-6">
          {about.skillGroups.map((group) => (
            <LabelRow
              key={group.category}
              label={group.category}
              labelAs="h3"
              labelClassName="md:pt-1"
            >
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Badge variant="outline" size="md">
                      {item}
                    </Badge>
                  </li>
                ))}
              </ul>
            </LabelRow>
          ))}
        </div>
      </Section>

      <Section id={ID.education} title={about.educationHeading}>
        <ol className="mt-8 grid gap-8">
          {about.education.map((entry) => (
            <li key={entry.school}>
              <LabelRow label={entry.period} labelAfter>
                <h3 className="font-medium">{entry.school}</h3>
                {entry.degree && <p className="mt-1">{entry.degree}</p>}
                {entry.field && (
                  <p className="mt-0.5 text-pretty text-muted-foreground">
                    {noOrphans(entry.field)}
                  </p>
                )}
              </LabelRow>
            </li>
          ))}
        </ol>
      </Section>

      {/* Działania nie trafiają na wydruk — z tej strony powstaje CV w PDF (`pnpm cv`). */}
      <div className="column mt-20 flex flex-wrap gap-3 print:hidden">
        <Button asChild size="lg" className="group/link">
          <Link href={pageHref("contact", locale)}>
            {about.ctaContact}
            <LinkArrow />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={CV_PDF[locale]} download>
            <DownloadIcon />
            {about.ctaCv}
          </a>
        </Button>
      </div>
    </>
  )
}
