/**
 * Wariant strony głównej z 25 sierpnia 2026 (odrzucony) — odtworzony z tagu
 * `warianty-strony-glownej-2026-08` wyłącznie do wglądu. Kod jest zamrożony:
 * nie poprawiamy go i nie importujemy z niego niczego do serwisu.
 */
import { preload } from "react-dom"
import "./main-fourth.css"
import { cn } from "@/lib/utils"
import { display } from "./fonts"
import { Hero } from "./Hero"
import { Skills } from "./Skills"
import { Portfolio } from "./Portfolio"
import { Blog } from "./Blog"
import { Contact } from "./Contact"
import { hero } from "@/components/demo/shared/home-content"

export function Demo() {
  // Poster hero to kandydat na LCP — pobierany równolegle z HTML.
  preload(hero.video.poster, { as: "image", fetchPriority: "high" })

  return (
    <div className={cn("main-fourth", display.variable)}>
      <Hero />
      <Skills />
      <Portfolio />
      <Blog />
      <Contact />
    </div>
  )
}
