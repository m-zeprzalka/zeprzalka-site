import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Globe, ArrowRight, Download } from "lucide-react"
import Link from "next/link"
import { JsonLd } from "@/components/JsonLd"
import { StatusBadge } from "@/components/StatusBadge"
import { CONTACT_EMAIL, CV_PDF, SITE_HOST, SITE_URL } from "@/lib/site"
import { profilePageSchema } from "@/lib/page-schema"
import { ROUTES, type Locale } from "@/i18n/config"
import { getPages } from "@/i18n/content/pages"

/**
 * Strona „o mnie" pełni też funkcję CV — z niej generowany jest plik PDF
 * (arkusz druku w globals.css chowa elementy z `data-print-hide`).
 */
export function AboutView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).about

  return (
    <div className="page-shell max-w-4xl">
      <JsonLd data={profilePageSchema(locale)} />
      {/* Header */}
      <header className="mb-16">
        <StatusBadge label={copy.status} className="mb-6 w-fit" />

        <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
              {copy.name}
            </h1>
            <p className="text-xl text-muted-foreground">{copy.role}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            {copy.location}
          </span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {CONTACT_EMAIL}
          </a>
          <a
            href={SITE_URL}
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Globe className="h-4 w-4 shrink-0" />
            {SITE_HOST}
          </a>
        </div>

        <Separator className="mt-10" />
      </header>

      {/* O mnie */}
      <section className="mb-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <h2 className="pt-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {copy.aboutHeading}
          </h2>
        </div>
        <div className="lg:col-span-9">
          <p className="text-base leading-relaxed text-muted-foreground">
            {copy.bioLeadPrefix}
            <span className="font-medium text-foreground">{copy.bioLeadStrong}</span>
            {copy.bioLeadSuffix}
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {copy.bioSecondPrefix}
            <span className="font-medium text-foreground">{copy.bioSecondStrong}</span>
            {copy.bioSecondSuffix}
          </p>
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Doświadczenie */}
      <section className="mb-14">
        <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <h2 className="pt-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {copy.experienceHeading}
            </h2>
          </div>
        </div>

        <div className="space-y-10">
          {copy.experience.map((job) => (
            <div
              key={`${job.company}-${job.period}`}
              className="grid gap-4 lg:grid-cols-12 lg:gap-8"
            >
              <div className="lg:col-span-3">
                <p className="text-sm text-muted-foreground tabular-nums">{job.period}</p>
                <p className="mt-1 text-sm font-medium">{job.company}</p>
              </div>
              <div className="lg:col-span-9">
                <h3 className="mb-2 text-base font-semibold">{job.role}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Umiejętności */}
      <section className="mb-14">
        <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <h2 className="pt-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {copy.skillsHeading}
            </h2>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {copy.skillGroups.map((group) => (
            <div key={group.category}>
              <h3 className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs font-normal">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Edukacja */}
      <section className="mb-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <h2 className="pt-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {copy.educationHeading}
          </h2>
        </div>
        <div className="space-y-8 lg:col-span-9">
          {copy.education.map((edu) => (
            <div
              key={`${edu.school}-${edu.period}`}
              className="flex items-start justify-between gap-4"
            >
              <div>
                <h3 className="text-base font-semibold">{edu.school}</h3>
                {edu.degree && <p className="mt-1 text-sm text-foreground">{edu.degree}</p>}
                {edu.field && <p className="mt-1 text-sm text-muted-foreground">{edu.field}</p>}
              </div>
              <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-12" />

      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row" data-print-hide>
        <Button asChild size="lg" className="w-fit">
          <Link href={ROUTES.contact[locale]}>{copy.ctaContact}</Link>
        </Button>
        {/* PDF jest generowany z tej strony (`pnpm cv`) — jedna treść, dwa formaty. */}
        <Button asChild variant="outline" size="lg" className="w-fit gap-2">
          <a href={CV_PDF[locale]} download>
            <Download className="h-4 w-4" />
            {copy.ctaCv}
          </a>
        </Button>
        {/* Link wewnętrzny — strzałka zamiast ikony „nowa karta”. */}
        <Button asChild variant="ghost" size="lg" className="w-fit gap-2">
          <Link href={ROUTES.portfolio[locale]}>
            <ArrowRight className="h-4 w-4" />
            {copy.ctaPortfolio}
          </Link>
        </Button>
      </div>
    </div>
  )
}
