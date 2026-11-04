import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import type { TransformacjaContent } from "./content"
import { Logo } from "./Logo"
import { MobileMenu } from "./MobileMenu"

/**
 * Nagłówek strony — prawdziwy od pierwszej klatki (nawigacja musi działać
 * w każdym etapie). Tło pojawia się dopiero nad gotowym produktem; w scenie
 * pod nagłówkiem jest blat narzędzia.
 */
export function Header({ content }: { content: TransformacjaContent }) {
  const links = content.nav.filter((item) => item.key !== "contact")

  return (
    <header className="tf-header">
      <div aria-hidden="true" className="tf-header__bg tf-anim" />
      <div className="relative mx-auto flex h-full w-[min(100%-2*var(--fm-gutter),var(--tf-max))] items-center justify-between gap-4">
        <Logo href="#tf-scene" name={content.person.name} />

        <nav aria-label="Nawigacja główna" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium text-fm-ink-2 fm-focus transition-colors duration-150 hover:bg-fm-fill hover:text-fm-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeSwitch label={content.ui.themeToggle} />
          <a
            href="#kontakt"
            className="hidden h-9 fm-press items-center rounded-full bg-fm-ink px-4 text-sm font-medium text-fm-inverse fm-focus transition-[background-color,scale] duration-150 ease-fm-snap select-none hover:bg-fm-ink/85 md:inline-flex"
          >
            {content.contact.title}
          </a>
          <MobileMenu
            links={content.nav}
            email={content.person.email}
            cta={{ label: content.hero.cta, href: "#kontakt" }}
            labels={{
              open: content.ui.openMenu,
              close: content.ui.closeMenu,
              title: "Menu",
              copied: content.ui.copied,
            }}
          />
        </div>
      </div>
    </header>
  )
}
