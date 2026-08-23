import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zeprzalka.com"

export const metadata: Metadata = {
  title: "O mnie",
  description:
    "Michał Zeprzałka — Digital Solutions Architect z ponad 12 latami doświadczenia. Strony internetowe, aplikacje, design, animacja i integracje AI.",
  alternates: {
    canonical: "/o-mnie",
  },
}

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
      addressLocality: "Warszawa",
      addressCountry: "PL",
    },
    sameAs: [
      "https://github.com/m-zeprzalka",
      "https://www.facebook.com/michalzeprzalka",
    ],
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "UX/UI Design",
      "Branding",
      "Animacja",
      "Integracje AI",
    ],
  },
}

const experience = [
  {
    role: "Digital Solutions Architect & Graphic Designer",
    company: "Freelance",
    period: "2011 - obecnie",
    description:
      "Ponad 30+ klientów. Głównie tworzenie stron internetowych, aplikacji, materiałów graficznych, animacji i materiałów wideo. Prowadzenie i zarządzanie Social Media, przygotwywanie kampanii reklamowych oraz doradztwo w zakresie transformacji cyfrowej.",
    tags: ["Social Media", "Marketing", "Branding", "Projektowanie UX/UI", "Tworzenie stron i aplikacji", "Grafika", "Montaż Wideo", "Animacja", "Integracje AI"],
  },
  {
    role: "Wykładowca akademicki",
    company: "Uczelnie wyższe",
    period: "2016 — 2026",
    description:
      "Prowadzenie zajęć z zakresu projektowania graficznego, tworzenia stron internetowych oraz nowoczesnych technologii. Kierownik specjalizacji Multimedia w Warszawskiej Szkole Reklamy. Wykładowca Uniwersytetu Civitas wyróżniony Nagrodą Rektora.",
    tags: ["Tworzenie stron WWW", "Projektowanie graficzne", "Figma", "Photoshop", "After Effects", "Social Media Marketing"],
  },

]

const skillGroups = [
  {
    category: "Frontend",
    items: ["HTML/CSS", "JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Design",
    items: ["Figma", "Design Systems", "UI/UX", "Typografia", "Adobe CC", "Branding"],
  },
  {
    category: "Backend & Infrastruktura",
    items: ["WordPress", "Node.js", "PostgreSQL", "Vercel", "Docker", "REST API"],
  },
  {
    category: "AI & Automatyzacja",
    items: ["LLM Integration", "Prompt Engineering", "n8n", "OpenAI API"],
  },
]

const education = [
  {
    school: "Uniwersytet Civitas",
    degree: "Studia magisterskie",
    field: "Socjologia specjalizacja Nowe media",
    period: "2014 — 2017",
  },

  {
    school: "Szkoła Główna Gospodarstwa Wiejskiego",
    degree: "Studia licencjackie",
    field: "Kierunek Socjologia i Pedagogika, specjalizacja animacja społeczna z edukacją kulturalną",
    period: "2011 — 2014",
  },
  {
    school: "Warszawska Szkoła Reklamy",
    degree: "Szkoła Policealna",
    field: "Specjalizacja Strategia reklamy & PR",
    period: "2012 — 2014",
  },
]

export default function CVPage() {
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
          Gotowy do współpracy
        </Badge>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-2">
              Michał Zeprzałka
            </h1>
            <p className="text-xl text-muted-foreground">
              Digital Solutions Architect - Designer - AI Specialist
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" />
            Polska, Warszawa
          </span>
          <a
            href="mailto:m@zeprzalka.com"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Mail className="w-4 h-4 shrink-0" />
            m@zeprzalka.com
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
            projektową — tworzę produkty cyfrowe, które są funkcjonalne
            i estetyczne. </p>
          <br></br>
          <p className="text-base leading-relaxed text-muted-foreground">
            Specjalizuję się w design systemów, stron internetowych, integracji AI oraz budowie skalowalnych aplikacji. Mam duże doświadczenie w projektowaniu graficznym, animacji i tworzeniu materiałów wideo. Przez wiele lat byłem wykładowcą <span className="font-medium text-foreground">zdobywając Nagrodę Rektora</span> za najwyższą średnią ocen w ankietach studenckich: 99,28%.
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
        <div className="lg:col-span-9 space-y-8">
          {education.map((edu, i) => (
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
