import { SectionNav } from "@/app/main-page/_components/layout/section-nav"
import { PeekProvider } from "@/app/main-page/_components/peek/peek-context"
import { PeekStage } from "@/app/main-page/_components/peek/peek-stage"
import { About } from "@/app/main-page/_components/sections/about"
import { Contact } from "@/app/main-page/_components/sections/contact"
import { Hero } from "@/app/main-page/_components/sections/hero"
import { Skills } from "@/app/main-page/_components/sections/skills"
import { Work } from "@/app/main-page/_components/sections/work"
import { Writing } from "@/app/main-page/_components/sections/writing"
import { JsonLd } from "@/app/main-page/_components/seo/json-ld"
import { getHomeContent } from "@/app/main-page/_lib/content"
import type { Locale } from "@/i18n/config"
import { graph, personSchema, websiteSchema } from "@/lib/schema"

/**
 * Wariant 1 — kanon „Indeksu”: jedna wąska kolumna, spis sekcji i karta
 * podglądu pojawiają się na marginesach dopiero wtedy, gdy są potrzebne.
 * Sama kompozycja — sekcje i system są wspólne dla wszystkich wariantów.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const content = getHomeContent(locale)
  const { ui, person } = content

  return (
    <PeekProvider peeks={content.peeks}>
      <JsonLd data={graph(websiteSchema(locale), personSchema(locale))} />
      <SectionNav label={ui.onPage} sections={content.sections} />

      <Hero
        {...content.hero}
        email={person.email}
        labels={{
          copyEmail: ui.copyEmail,
          copied: ui.copied,
          playVideo: ui.playVideo,
          pauseVideo: ui.pauseVideo,
        }}
      />
      <About {...content.about} />
      <Skills {...content.skills} />
      <Work
        title={content.work.title}
        lead={content.work.lead}
        groups={content.work.groups}
        all={content.work.all}
        labels={{
          visitSite: ui.visitSite,
          inPortfolio: ui.inPortfolio,
          newTab: ui.newTab,
          portfolioHref: content.work.all.href,
        }}
      />
      <Writing
        title={content.blog.title}
        lead={content.blog.lead}
        posts={content.blog.posts}
        visible={content.blog.visible}
        all={content.blog.all}
        labels={{ newPost: ui.newPost, showAll: ui.showAll, showLess: ui.showLess }}
      />
      <Contact
        title={content.contact.title}
        lead={content.contact.lead}
        email={person.email}
        labels={{
          copyEmail: ui.copyEmail,
          copied: ui.copied,
          responseTimeLabel: ui.responseTimeLabel,
          responseTime: ui.responseTime,
        }}
        form={{
          locale,
          copy: content.contact.form,
          projectTypes: content.contact.projectTypes,
          privacyHref: content.contact.privacyHref,
        }}
      />

      <PeekStage />
    </PeekProvider>
  )
}
