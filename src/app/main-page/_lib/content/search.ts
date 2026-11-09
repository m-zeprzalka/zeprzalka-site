/**
 * Wyszukiwarka ⌘K: najpierw menu główne (podstrony), potem realizacje, wpisy i akcje.
 * Bez sekcji stron — nawigacja serwisu to podstrony (decyzja właściciela 9.11).
 */
import "server-only"
import { ROUTES } from "@/i18n/config"
import { getMeta } from "@/i18n/content/meta"
import { CONTACT_EMAIL } from "@/lib/site"
import type { SearchGroup } from "../types"
import { workAnchor } from "../anchors"
import { PAGE_KEYS, homeAnchor, pageHref } from "../routes"
import type { Source } from "./source"

export function buildSearch(source: Source): SearchGroup[] {
  const { locale, common, copy, groups } = source
  // Opis podstrony w podglądzie okna — ten sam co w metadanych strony (bez nowych tekstów).
  const meta = getMeta(locale)
  return [
    {
      id: "pages",
      heading: copy.ui.searchGroups.pages,
      items: [
        {
          id: "page-home",
          label: common.nav.home,
          icon: "page" as const,
          hint: ROUTES.home[locale],
          detail: meta.root.description,
          href: pageHref("home", locale),
        },
        ...PAGE_KEYS.map((key) => ({
          id: `page-${key}`,
          label: common.nav[key],
          icon: "page" as const,
          hint: ROUTES[key][locale],
          detail: meta[key].description,
          href: pageHref(key, locale),
        })),
        {
          id: "page-privacy",
          label: common.form.privacyLink,
          icon: "page" as const,
          hint: ROUTES.privacy[locale],
          detail: meta.privacy.description,
          href: pageHref("privacy", locale),
        },
      ],
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
