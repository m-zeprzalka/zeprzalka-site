import { Button } from "@/components/demo/forma/Button"
import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { SECTION } from "./ids"
import { LangSwitch } from "./LangSwitch"
import { LogoMark } from "./LogoMark"
import { MobileMenu } from "./MobileMenu"

/**
 * Nagłówek: znak, cztery podstrony (z Portfolio — dług nr 7), segment języka,
 * motyw i jedna pigułka „Kontakt”. Poniżej 1024 px zostaje znak i „Menu” —
 * zamiast trzech kwadratów obok siebie jak dziś.
 */
export function Header({ content }: { content: DemoHomeContent }) {
  const pages = content.nav.filter((link) => link.key !== "contact")
  const contact = content.nav.find((link) => link.key === "contact")

  return (
    <header className="re-header">
      <div className="re-container flex h-full items-center justify-between gap-6">
        <LogoMark domain={content.person.domain} href={`#${SECTION.start}`} />

        <div className="flex items-center gap-2">
          <nav aria-label="Nawigacja główna" className="me-3 hidden items-center lg:flex">
            {pages.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="inline-flex h-9 items-center rounded-full px-3.5 text-sm text-fm-ink-2 fm-focus transition-colors duration-150 hover:bg-fm-fill hover:text-fm-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <LangSwitch className="hidden lg:flex" />
          <ThemeSwitch label={content.ui.themeToggle} className="hidden lg:grid" />
          {contact && (
            <Button asChild size="sm" className="ms-1 hidden h-9 px-4 text-sm lg:inline-flex">
              <a href={`#${SECTION.contact}`}>{contact.label}</a>
            </Button>
          )}
          <MobileMenu
            domain={content.person.domain}
            links={content.nav.map((link) =>
              link.key === "contact" ? { ...link, href: `#${SECTION.contact}` } : link
            )}
            status={content.hero.status}
            cta={{ label: content.hero.cta, href: `#${SECTION.contact}` }}
            email={content.person.email}
            socials={content.person.socials}
            labels={{
              open: content.ui.openMenu,
              close: content.ui.closeMenu,
              theme: content.ui.themeToggle,
              copied: content.ui.copied,
            }}
          />
        </div>
      </div>
    </header>
  )
}
