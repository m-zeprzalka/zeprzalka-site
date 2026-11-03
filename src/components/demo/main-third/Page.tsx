/**
 * Wariant strony głównej z 25 sierpnia 2026 (odrzucony) — odtworzony z tagu
 * `warianty-strony-glownej-2026-08` wyłącznie do wglądu. Kod jest zamrożony:
 * nie poprawiamy go i nie importujemy z niego niczego do serwisu.
 */
import { preload } from "react-dom"
import "./main-third.css"
import { cn } from "@/lib/utils"
import { display } from "./fonts"
import { Hero } from "./Hero"
import { Skills } from "./Skills"
import { Portfolio } from "./Portfolio"
import { Blog } from "./Blog"
import { Contact } from "./Contact"
import { hero } from "@/components/demo/shared/home-content"

export function Demo() {
  // Poster hero jest kandydatem na LCP — pobierany równolegle z HTML.
  preload(hero.video.poster, { as: "image", fetchPriority: "high" })

  return (
    <div className={cn("main-third", display.variable)}>

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
