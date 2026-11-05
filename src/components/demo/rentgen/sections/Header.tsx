import { buttonVariants } from "../../forma/Button"
import { cn } from "../../forma/cn"
import { ThemeSwitch } from "../../forma/ThemeSwitch"
import type { DemoHomeContent } from "../../shared/content"
import { Face, Inspect } from "../code/Twin"
import { quote } from "../code/highlight"
import { ModeSwitch } from "../lens/ModeSwitch"
import { UI } from "../ui"
import { Logo } from "./Logo"
import { MobileMenu } from "./MobileMenu"

const CTA = buttonVariants({ size: "sm" })

/**
 * Nagłówek: przezroczysty na górze, po zjechaniu tło płótna z rozmyciem i linią
 * (oś czasu przewijania, CSS). Sygnet, nawigacja, przełącznik „Projekt / Kod”
 * (rdzeń koncepcji — widoczny zawsze, także na telefonie), motyw, kontakt.
 * Ma własną kliszę: soczewka nad nawigacją pokazuje linki jako `<Link>`.
 */
export function Header({ content }: { content: DemoHomeContent }) {
  const { person, ui } = content
  const nav = content.nav.filter((item) => item.key !== "contact")
  const contact = content.nav.find((item) => item.key === "contact")

  return (
    <header data-rg-host="header" data-rg-name="header" className="rg-header">
      <div className="fm-container flex h-full items-center justify-between gap-3">
        <Logo name={person.name} />

        <nav aria-label="Nawigacja główna" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  data-rg-key={`nav-${item.key}`}
                  data-rg-magnet=""
                  data-rg-name="Link"
                  className="inline-flex h-9 items-center rounded-full px-3.5 text-[0.875rem] font-medium text-fm-ink-2 fm-focus transition-colors duration-150 hover:bg-fm-fill hover:text-fm-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ModeSwitch labels={UI.mode} />
          <ThemeSwitch label={ui.themeToggle} className="hidden sm:grid" />
          {contact && (
            <a
              href="#kontakt"
              data-rg-key="header-cta"
              data-rg-magnet=""
              data-rg-name="Button"
              className={cn(CTA, "hidden md:inline-flex")}
            >
              {contact.label}
            </a>
          )}
          <MobileMenu
            nav={nav}
            cta={{ label: contact?.label ?? "", href: "#kontakt" }}
            ctaClass={buttonVariants({ size: "lg" })}
            email={person.email}
            labels={{
              open: ui.openMenu,
              close: ui.closeMenu,
              menu: UI.menu,
              theme: ui.themeToggle,
              copied: ui.copied,
            }}
          />
        </div>
      </div>

      <Face guides={false} variant="live" lensOnly>
        <Inspect for="logo" name="Logo" src={`<Logo name=${quote(person.name)} />`} />
        {nav.map((item) => (
          <Inspect
            key={item.key}
            for={`nav-${item.key}`}
            name="Link"
            className="rounded-full"
            src={item.href}
          />
        ))}

        <Inspect
          for="header-cta"
          name="a.Button"
          className="rounded-full"
          src={`<Button size="sm">`}
        />
      </Face>
    </header>
  )
}
