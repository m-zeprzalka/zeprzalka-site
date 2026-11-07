/** Wyszukiwarka ⌘K: sekcje strony, realizacje, wpisy, podstrony i akcje. */
import "server-only"
import { ROUTES } from "@/i18n/config"
import { CONTACT_EMAIL } from "@/lib/site"
import type { SearchGroup, SectionLink } from "../types"
import { SECTION, workAnchor } from "../anchors"
import { PAGE_KEYS, homeAnchor, pageHref } from "../routes"
import type { Source } from "./source"

/** Spis sekcji strony — wspólny dla wyszukiwarki i spisu w lewym torze. */
export function buildSections({ copy, about, home }: Source): SectionLink[] {
  return [
    { id: SECTION.start, label: copy.ui.start },
    { id: SECTION.about, label: about.aboutHeading },
    { id: SECTION.skills, label: home.skills.title },
    { id: SECTION.work, label: home.portfolio.title },
    { id: SECTION.blog, label: home.blog.title },
    { id: SECTION.contact, label: home.contact.title },
  ]
}

export function buildSearch(source: Source): SearchGroup[] {
  const { locale, common, home, about, copy, groups } = source
  const detail: Record<string, string> = {
    [SECTION.start]: home.hero.title,
    [SECTION.about]: `${about.bioLeadPrefix}${about.bioLeadStrong}`,
    [SECTION.skills]: home.skills.lead,
    [SECTION.work]: home.portfolio.lead,
    [SECTION.blog]: home.blog.lead,
    [SECTION.contact]: home.contact.lead,
  }

  return [
    {
      id: "sections",
      heading: copy.ui.searchGroups.sections,
      items: buildSections(source).map((section) => ({
        id: `section-${section.id}`,
        label: section.label,
        icon: "section",
        detail: detail[section.id],
        href: homeAnchor(locale, section.id),
      })),
    },
    {
      id: "works",
      heading: copy.ui.searchGroups.works,
      items: groups.flatMap((group) =>
        group.works.map((work) => ({
          id: `work-${work.slug}`,
          label: work.title,
          icon: "work" as const,
          hint: work.category,
          thumb: work.media.src,
          detail: work.description ?? group.label,
          href: homeAnchor(locale, workAnchor(work.slug)),
        }))
      ),
    },
    {
      id: "posts",
      heading: copy.ui.searchGroups.posts,
      items: source.posts.map(({ card, description }) => ({
        id: `post-${card.slug}`,
        label: card.title,
        icon: "post" as const,
        hint: card.day,
        thumb: card.cover.src,
        detail: description,
        href: card.href,
      })),
    },
    {
      id: "pages",
      heading: copy.ui.searchGroups.pages,
      items: PAGE_KEYS.map((key) => ({
        id: `page-${key}`,
        label: common.nav[key],
        icon: "page" as const,
        hint: ROUTES[key][locale],
        href: pageHref(key, locale),
      })),
    },
    {
      id: "actions",
      heading: copy.ui.searchGroups.actions,
      items: [
        {
          id: "action-email",
          label: copy.ui.copyEmail,
          icon: "email",
          hint: CONTACT_EMAIL,
          action: "copy-email",
        },
        { id: "action-theme", label: common.ui.themeToggle, icon: "theme", action: "toggle-theme" },
      ],
    },
  ]
}
