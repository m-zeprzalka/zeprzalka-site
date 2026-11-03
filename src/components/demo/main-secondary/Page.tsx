/**
 * Wariant strony głównej z 25 sierpnia 2026 (odrzucony) — odtworzony z tagu
 * `warianty-strony-glownej-2026-08` wyłącznie do wglądu. Kod jest zamrożony:
 * nie poprawiamy go i nie importujemy z niego niczego do serwisu.
 */
import { preload } from "react-dom"
import "./main-secondary.css"
import { cn } from "@/lib/utils"
import { accent, display } from "./fonts"
import { Hero } from "./Hero"
import { Skills } from "./Skills"
import { Portfolio } from "./Portfolio"
import { Blog } from "./Blog"
import { Contact } from "./Contact"
import { SectionNav } from "./SectionNav"
import { hero, sections } from "@/components/demo/shared/home-content"

const navItems = [
  sections.skills,
  sections.portfolio,
  sections.blog,
  sections.contact,
]

export function Demo() {
  // Poster hero jest elementem LCP — preload z wysokim priorytetem (React 19).
  preload(hero.video.poster, { as: "image", fetchPriority: "high" })

  return (
    <div className={cn("main-secondary", display.variable, accent.variable)}>
      <Hero />
      <Skills />
      <Portfolio />
      <Blog />
      <Contact />
      <SectionNav items={navItems} />
    </div>
  )
}
