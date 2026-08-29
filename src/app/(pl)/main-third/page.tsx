import type { Metadata } from "next"
import { preload } from "react-dom"
import "./main-third.css"
import { cn } from "@/lib/utils"
import { display } from "@/components/main-third/fonts"
import { Hero } from "@/components/main-third/Hero"
import { Skills } from "@/components/main-third/Skills"
import { Portfolio } from "@/components/main-third/Portfolio"
import { Blog } from "@/components/main-third/Blog"
import { Contact } from "@/components/main-third/Contact"
import { hero, jsonLd } from "@/lib/home-content"

export const metadata: Metadata = {
  title: { absolute: "Michał Zeprzałka - Digital Solutions Architect" },
  description:
    "Strony internetowe, aplikacje webowe, design i integracje AI. Ponad 12 lat doświadczenia w tworzeniu rozwiązań webowych i multimedialnych dla biznesu.",
  // Wariant strony głównej o identycznej treści — kanoniczny adres to "/",
  // żeby Google konsolidował sygnały zamiast widzieć duplikat.
  alternates: { canonical: "/" },
}

export default function MainThirdPage() {
  // Poster hero jest kandydatem na LCP — pobierany równolegle z HTML.
  preload(hero.video.poster, { as: "image", fetchPriority: "high" })

  return (
    <div className={cn("main-third", display.variable)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Siatka odniesienia — 12 kolumn systemu, na których zbudowana jest
          strona. Czysta dekoracja: element stały, poza drzewem dostępności. */}
      <div className="m3-rules" aria-hidden="true">
        <div className="container mx-auto grid h-full grid-cols-12 px-4 md:px-6">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="border-l border-border/40 last:border-r" />
          ))}
        </div>
      </div>

      <Hero />
      <Skills />
      <Portfolio />
      <Blog />
      <Contact />
    </div>
  )
}
