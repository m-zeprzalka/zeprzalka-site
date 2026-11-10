import { PeekProvider } from "@/components/peek/peek-context"
import { PeekStage } from "@/components/peek/peek-stage"
import { About } from "@/components/sections/about"
import { Contact } from "@/components/sections/contact"
import { Hero } from "@/components/sections/hero"
import { Skills } from "@/components/sections/skills"
import { Work } from "@/components/sections/work"
import { Writing } from "@/components/sections/writing"
import { JsonLd } from "@/components/seo/json-ld"
import { getHomeContent } from "@/lib/content/home"
import type { Locale } from "@/i18n/config"
import { graph, personSchema, websiteSchema } from "@/lib/schema"

/**
 * Strona główna — kanon „Indeksu”: jedna wąska kolumna, menu główne w lewym torze
 * (powłoka) i karta podglądu w prawym — pojawia się dopiero wtedy, gdy jest potrzebna.
 * Sama kompozycja — sekcje są w `components/sections`.
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
