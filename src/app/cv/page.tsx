import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Globe, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum Vitae — Michał Zeprzałka, Digital Solutions Architect z ponad 12 latami doświadczenia.",
}

const experience = [
  {
    role: "Digital Solutions Architect",
    company: "Własna działalność",
    period: "2018 — obecnie",
    description:
      "Projektowanie i wdrażanie kompleksowych rozwiązań cyfrowych dla klientów z branży e-commerce, mediów i finansów. Tworzenie design systemów, aplikacji webowych oraz strategii transformacji cyfrowej.",
    tags: ["Next.js", "React", "TypeScript", "Design Systems", "AI Integration"],
  },
  {
    role: "Lead Frontend Developer",
    company: "Agencja Interaktywna",
    period: "2014 — 2018",
    description:
      "Kierowanie zespołem frontendowym i budowa złożonych interfejsów użytkownika. Wdrożenie procesów design-to-code oraz standardów dostępności WCAG 2.1.",
    tags: ["React", "Webpack", "SASS", "Figma", "Scrum"],
  },
  {
    role: "Web Developer & Graphic Designer",
    company: "Studio Kreatywne",
    period: "2012 — 2014",
    description:
      "Tworzenie stron internetowych i materiałów graficznych dla małych i średnich firm. Projektowanie identyfikacji wizualnych i systemów graficznych od podstaw.",
    tags: ["HTML/CSS", "JavaScript", "Adobe CC", "WordPress"],
  },
]

const skillGroups = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Design",
    items: ["Figma", "Design Systems", "UI/UX", "Typografia", "Branding"],
  },
  {
    category: "Backend & Infrastruktura",
    items: ["Node.js", "PostgreSQL", "Vercel", "Docker", "REST API"],
  },
  {
    category: "AI & Automatyzacja",
    items: ["LLM Integration", "Prompt Engineering", "n8n", "OpenAI API"],
  },
]

export default function CVPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 max-w-4xl">
      {/* Header */}
      <header className="mb-16">
        <Badge
          variant="outline"
          className="flex items-center gap-2 text-sm px-4 py-2 w-fit mb-6"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Gotowy do współpracy
        </Badge>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-2">
              Michał Zeprzałka
            </h1>
            <p className="text-xl text-muted-foreground">
              Digital Solutions Architect
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit gap-2 shrink-0">
            <a href="/cv.pdf" download>
              <Download className="w-4 h-4" />
              Pobierz PDF
            </a>
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" />
            Polska
          </span>
          <a
            href="mailto:kontakt@zeprzalka.com"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Mail className="w-4 h-4 shrink-0" />
            kontakt@zeprzalka.com
          </a>
          <a
            href="https://zeprzalka.com"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Globe className="w-4 h-4 shrink-0" />
            zeprzalka.com
          </a>
        </div>

        <Separator className="mt-10" />
      </header>

      {/* O mnie */}
      <section className="mb-14 grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground pt-1">
            O mnie
          </h2>
        </div>
        <div className="lg:col-span-9">
          <p className="text-base leading-relaxed text-muted-foreground">
            Ponad{" "}
            <span className="font-medium text-foreground">
              12 lat doświadczenia
            </span>{" "}
            w projektowaniu i wdrażaniu innowacyjnych rozwiązań webowych i
            multimedialnych. Łączę umiejętności techniczne z wrażliwością
            projektową — tworzę produkty cyfrowe, które są równie funkcjonalne
            co estetyczne. Specjalizuję się w architekturze design systemów,
            integracji AI oraz budowie skalowalnych aplikacji.
          </p>
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Doświadczenie */}
      <section className="mb-14">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 mb-10">
          <div className="lg:col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground pt-1">
              Doświadczenie
            </h2>
          </div>
        </div>

        <div className="space-y-10">
          {experience.map((job, i) => (
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
              Umiejętności
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {skillGroups.map((group) => (
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
            Edukacja
          </h2>
        </div>
        <div className="lg:col-span-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">Inżynier Informatyki</h3>
              <p className="text-sm text-muted-foreground mt-1">Politechnika</p>
            </div>
            <span className="text-sm text-muted-foreground shrink-0 tabular-nums">
              2008 — 2012
            </span>
          </div>
        </div>
      </section>

      <Separator className="mb-12" />

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg" className="w-fit">
          <Link href="/kontakt">
            Porozmawiajmy o projekcie
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-fit gap-2">
          <a href="https://zeprzalka.com" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            Portfolio online
          </a>
        </Button>
      </div>
    </div>
  )
}
