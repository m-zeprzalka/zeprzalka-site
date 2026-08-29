import type { Metadata } from "next"
import { preload } from "react-dom"
import "./main-secondary.css"
import { cn } from "@/lib/utils"
import { accent, display } from "@/components/main-secondary/fonts"
import { Hero } from "@/components/main-secondary/Hero"
import { Skills } from "@/components/main-secondary/Skills"
import { Portfolio } from "@/components/main-secondary/Portfolio"
import { Blog } from "@/components/main-secondary/Blog"
import { Contact } from "@/components/main-secondary/Contact"
import { SectionNav } from "@/components/main-secondary/SectionNav"
import { hero, jsonLd, sections } from "@/lib/home-content"

export const metadata: Metadata = {
  title: { absolute: "Michał Zeprzałka - Digital Solutions Architect" },
  description:
    "Strony internetowe, aplikacje webowe, design i integracje AI. Ponad 12 lat doświadczenia w tworzeniu rozwiązań webowych i multimedialnych dla biznesu.",
  // Wariant strony głównej o identycznej treści — kanoniczny adres to "/",
  // żeby Google konsolidował sygnały zamiast widzieć duplikat.
  alternates: { canonical: "/" },
}

const navItems = [
  sections.skills,
  sections.portfolio,
  sections.blog,
  sections.contact,
]

export default function MainSecondaryPage() {
  // Poster hero jest elementem LCP — preload z wysokim priorytetem (React 19).
  preload(hero.video.poster, { as: "image", fetchPriority: "high" })

  return (
    <div className={cn("main-secondary", display.variable, accent.variable)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Skills />
      <Portfolio />
      <Blog />
      <Contact />
      <SectionNav items={navItems} />
    </div>
  )
}
