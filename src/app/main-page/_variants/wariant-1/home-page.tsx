import { PeekProvider } from "@/app/main-page/_components/peek/peek-context"
import { PeekStage } from "@/app/main-page/_components/peek/peek-stage"
import { About } from "@/app/main-page/_components/sections/about"
import { Contact } from "@/app/main-page/_components/sections/contact"
import { Hero } from "@/app/main-page/_components/sections/hero"
import { Skills } from "@/app/main-page/_components/sections/skills"
import { Work } from "@/app/main-page/_components/sections/work"
import { Writing } from "@/app/main-page/_components/sections/writing"
import { JsonLd } from "@/app/main-page/_components/seo/json-ld"
import { getHomeContent } from "@/app/main-page/_lib/content/home"
import type { Locale } from "@/i18n/config"
import { graph, personSchema, websiteSchema } from "@/lib/schema"

/**
 * Wariant 1 — kanon „Indeksu”: jedna wąska kolumna, menu główne w lewym torze
 * (powłoka) i karta podglądu w prawym — pojawia się dopiero wtedy, gdy jest potrzebna.
 * Sama kompozycja — sekcje i system są wspólne dla wszystkich wariantów.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const { email, ui, peeks, hero, about, skills, work, blog, contact } = getHomeContent(locale)

  return (
    <PeekProvider peeks={peeks} closeLabel={ui.closeCard}>
      <JsonLd data={graph(websiteSchema(locale), personSchema(locale))} />
      <Hero
        {...hero}
        email={email}
        labels={{
          copyEmail: ui.copyEmail,
          copied: ui.copied,
          playVideo: ui.playVideo,
          pauseVideo: ui.pauseVideo,
        }}
      />
      <About {...about} />
      <Skills {...skills} />
      <Work {...work} />
      <Writing {...blog} />
      <Contact {...contact} email={email} />
      <PeekStage />
    </PeekProvider>
  )
}
