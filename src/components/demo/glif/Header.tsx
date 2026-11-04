import { Button } from "@/components/demo/forma/Button"
import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { GlyphMark } from "./GlyphMark"
import { MobileMenu } from "./MobileMenu"
import { MotionToggle } from "./MotionToggle"
import { UI } from "./ui-strings"

/** Lepki nagłówek: sygnet z imieniem, podstrony serwisu, ruch, motyw i kontakt. */
export function Header({
  person,
  nav,
  ui,
}: {
  person: DemoHomeContent["person"]
  nav: DemoHomeContent["nav"]
  ui: DemoHomeContent["ui"]
}) {
  const links = nav.filter((item) => item.key !== "contact")

  return (
    <header className="gl-header sticky top-0 z-40">
      <div className="fm-container flex h-full items-center justify-between gap-6">
        <a
          href="#start"
          className="group -ms-1 flex items-center gap-2 rounded-fm-sm px-1 py-1 text-[0.9375rem] font-medium tracking-[-0.01em] fm-focus"
        >
          <GlyphMark />
          {person.name}
        </a>
        <nav aria-label="Podstrony" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-2 text-fm-small text-fm-ink-2 fm-focus transition-colors duration-150 hover:text-fm-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <MotionToggle
            labels={{ pause: UI.pause, resume: UI.resume }}
            className="hidden sm:grid"
          />
          <ThemeSwitch label={ui.themeToggle} className="hidden sm:grid" />
          <Button asChild size="sm" className="ms-2 hidden sm:inline-flex">
            <a href="#kontakt">{nav.find((item) => item.key === "contact")?.label}</a>
          </Button>
          <MobileMenu
            nav={nav}
            email={person.email}
            labels={{
              open: ui.openMenu,
              close: ui.closeMenu,
              title: UI.menu,
              theme: ui.themeToggle,
              copied: ui.copied,
              pause: UI.pause,
              resume: UI.resume,
            }}
          />
        </div>
      </div>
    </header>
  )
}
