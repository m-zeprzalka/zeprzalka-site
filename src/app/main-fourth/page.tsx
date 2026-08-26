import type { Metadata } from "next"
import { preload } from "react-dom"
import "./main-fourth.css"
import { cn } from "@/lib/utils"
import { display } from "@/components/main-fourth/fonts"
import { Hero } from "@/components/main-fourth/Hero"
import { Skills } from "@/components/main-fourth/Skills"
import { Portfolio } from "@/components/main-fourth/Portfolio"
import { Blog } from "@/components/main-fourth/Blog"
import { Contact } from "@/components/main-fourth/Contact"
import { hero, jsonLd } from "@/lib/home-content"

export const metadata: Metadata = {
  title: { absolute: "Michał Zeprzałka - Digital Solutions Architect" },
  description:
    "Strony internetowe, aplikacje webowe, design i integracje AI. Ponad 12 lat doświadczenia w tworzeniu rozwiązań webowych i multimedialnych dla biznesu.",
  // Wariant strony głównej o identycznej treści — kanoniczny adres to "/",
  // żeby Google konsolidował sygnały zamiast widzieć duplikat.
  alternates: { canonical: "/" },
}

export default function MainFourthPage() {
  // Poster hero to kandydat na LCP — pobierany równolegle z HTML.
  preload(hero.video.poster, { as: "image", fetchPriority: "high" })

  return (
    <div className={cn("main-fourth", display.variable)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Skills />
      <Portfolio />
      <Blog />
      <Contact />
    </div>
  )
}
