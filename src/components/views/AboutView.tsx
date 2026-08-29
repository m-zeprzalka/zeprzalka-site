import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Globe, ExternalLink, Download } from "lucide-react"
import Link from "next/link"
import { SAME_AS, SITE_URL } from "@/lib/site"
import { ROUTES, type Locale } from "@/i18n/config"
import { getPages } from "@/i18n/content/pages"

/**
 * Strona „o mnie" pełni też funkcję CV — z niej generowany jest plik PDF
 * (arkusz druku w globals.css chowa elementy z `data-print-hide`).
 */
export function AboutView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).about

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Michał Zeprzałka",
      jobTitle: "Digital Solutions Architect",
      url: SITE_URL,
      image: `${SITE_URL}/avatar.png`,
      email: "mailto:m@zeprzalka.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: copy.addressLocality,
        addressCountry: "PL",
      },
      sameAs: SAME_AS,
      knowsAbout: copy.knowsAbout,
    },
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {/* Header */}
      <header className="mb-16">
        <Badge
          variant="outline"
          className="flex items-center gap-2 text-sm px-4 py-2 w-fit mb-6"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {copy.status}
        </Badge>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-2">
              {copy.name}
            </h1>
            <p className="text-xl text-muted-foreground">
              {copy.role}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" />
            {copy.location}
          </span>
          <a
            href="mailto:m@zeprzalka.com"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Mail className="w-4 h-4 shrink-0" />
            m@zeprzalka.com
          </a>
          <a
            href={SITE_URL}
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Globe className="w-4 h-4 shrink-0" />
            www.zeprzalka.com
          </a>
        </div>

        <Separator className="mt-10" />
      </header>

      {/* O mnie */}
      <section className="mb-14 grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground pt-1">
            {copy.aboutHeading}
          </h2>
        </div>
        <div className="lg:col-span-9">
          <p className="text-base leading-relaxed text-muted-foreground">
            {copy.bioLeadPrefix}
            <span className="font-medium text-foreground">
              {copy.bioLeadStrong}
            </span>
            {copy.bioLeadSuffix}</p>
          <br></br>
          <p className="text-base leading-relaxed text-muted-foreground">
            {copy.bioSecondPrefix}<span className="font-medium text-foreground">{copy.bioSecondStrong}</span>{copy.bioSecondSuffix}
          </p>
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Doświadczenie */}
      <section className="mb-14">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 mb-10">
          <div className="lg:col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground pt-1">
              {copy.experienceHeading}
            </h2>
          </div>
        </div>

        <div className="space-y-10">
          {copy.experience.map((job, i) => (
            <div key={i} className="grid lg:grid-cols-12 gap-4 lg:gap-8">
              <div className="lg:col-span-3">
                <p className="text-sm text-muted-foreground tabular-nums">
                  {job.period}
                </p>
                <p className="text-sm font-medium mt-1">{job.company}</p>
              </div>
              <div className="lg:col-span-9">
                <h3 className="text-base font-semibold mb-2">{job.role}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
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
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 mb-10">
          <div className="lg:col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground pt-1">
              {copy.skillsHeading}
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {copy.skillGroups.map((group) => (
            <div key={group.category}>
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-xs font-normal"
                  >
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
      <section className="mb-14 grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground pt-1">
            {copy.educationHeading}
          </h2>
        </div>
        <div className="lg:col-span-9 space-y-8">
          {copy.education.map((edu, i) => (
            <div key={i} className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold">{edu.school}</h3>
                {edu.degree && (
                  <p className="text-sm text-foreground mt-1">{edu.degree}</p>
                )}
                {edu.field && (
                  <p className="text-sm text-muted-foreground mt-1">{edu.field}</p>
                )}
              </div>
              <span className="text-sm text-muted-foreground shrink-0 tabular-nums">
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-12" />

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3" data-print-hide>
        <Button asChild size="lg" className="w-fit">
          <Link href={ROUTES.contact[locale]}>
            {copy.ctaContact}
          </Link>
        </Button>
        {/* PDF jest generowany z tej strony — jedna treść, dwa formaty. */}
        <Button asChild variant="outline" size="lg" className="w-fit gap-2">
          <a href="/cv-michal-zeprzalka.pdf" download>
            <Download className="w-4 h-4" />
            {copy.ctaCv}
          </a>
        </Button>
        <Button asChild variant="ghost" size="lg" className="w-fit gap-2">
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            {copy.ctaPortfolio}
          </a>
        </Button>
      </div>
    </div>
  )
}
