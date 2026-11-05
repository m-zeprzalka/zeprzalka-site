import type { CSSProperties } from "react"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import type { DemoHomeContent } from "../shared/content"
import { GlyphMark, GlyphWordmark } from "../shared/glyph"
import { Layers, type Layer } from "./Layers"
import { LocalTime } from "./LocalTime"
import { ThemeButton } from "./ThemeButton"
import { UI } from "./ui-strings"

/**
 * Nagłówek: logo (sygnet serwisu — glif co sekundę — i domena), przycisk „Warstwy” z bieżącą
 * warstwą (⌘K) i motyw. Krawędzie treści = krawędzie treści kart (ta sama rama i wcięcie).
 * Pierwszy w harmonijce wejścia.
 */
export function Header({
  domain,
  email,
  layers,
  themeLabel,
  copiedLabel,
}: {
  domain: string
  email: string
  layers: readonly Layer[]
  themeLabel: string
  copiedLabel: string
}) {
  return (
    <header
      className="au-fade fixed inset-x-0 top-0 z-50 h-(--au-head) bg-(--au-desk)"
      style={{ "--d": "0ms" } as CSSProperties}
    >
      <div className="au-frame flex h-full items-center justify-between gap-4 px-(--au-p)">
        <a
          href="#start"
          className="-ms-1 flex items-center gap-2 rounded-full px-1 text-[0.9375rem] font-medium tracking-[-0.01em] fm-focus"
        >
          <GlyphMark />
          {domain}
        </a>
        <div className="flex items-center gap-1.5">
          <Layers layers={layers} email={email} themeLabel={themeLabel} copiedLabel={copiedLabel} />
          <ThemeButton label={themeLabel} />
        </div>
      </div>
    </header>
  )
}

/**
 * Stopka-kurtyna: leży pod stosem i odsłania się, gdy ostatnia karta odjedzie (od tabletu).
 * Profile jako obłe chipy klikalne w całości, X pierwszy; na dole „Zeprzałka” ze znaków —
 * składa się z rozmycia przy wejściu, mysz i palec rozsypują znaki.
 */
export function Footer({
  footer,
  person,
  nav,
}: {
  footer: DemoHomeContent["footer"]
  person: DemoHomeContent["person"]
  nav: DemoHomeContent["nav"]
}) {
  return (
    <footer className="au-curtain flex flex-col pt-16 pb-(--au-m) sm:pt-20 md:min-h-[calc(100svh-var(--au-head))]">
      <div className="au-frame grid gap-x-(--au-gap) gap-y-10 px-(--au-p) lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-fm-lead font-medium tracking-[-0.012em] text-balance">
            {footer.tagline}
          </p>
          <p className="mt-2 max-w-[38ch] text-fm-body text-pretty text-fm-ink-2">
            {footer.description}
          </p>
        </div>
        <nav aria-label={footer.navigationLabel} className="lg:col-span-3 lg:col-start-7">
          <p className="text-fm-micro font-medium text-fm-ink-3">{footer.navigationLabel}</p>
          <ul className="mt-3 grid gap-0.5">
            {nav.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="-ms-3 inline-flex h-10 items-center rounded-full px-3 text-fm-body text-fm-ink-2 fm-focus transition-colors hover:bg-fm-fill hover:text-fm-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="lg:col-span-3">
          <p className="text-fm-micro font-medium text-fm-ink-3">{footer.socialLabel}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {person.socials.map((profile) => (
              <li key={profile.url}>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-11 fm-press items-center gap-1.5 rounded-full bg-fm-fill ps-4 pe-3.5 text-fm-small font-medium text-fm-ink fm-focus transition-[background-color,scale] hover:bg-fm-fill-strong"
                >
                  {profile.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 text-fm-ink-3 transition-[color,translate] duration-200 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="au-frame mt-12 mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-(--au-p) text-fm-small text-fm-ink-3 sm:mb-8">
        <p>{footer.copyright}</p>
        <div className="flex items-center gap-4">
          <LocalTime locality={person.locality} />
          <a
            href="#start"
            className="-me-3 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-fm-ink-2 fm-focus transition-colors hover:bg-fm-fill hover:text-fm-ink"
          >
            <ArrowUp aria-hidden="true" className="size-3.5" />
            {UI.toTop}
          </a>
        </div>
      </div>

      <GlyphWordmark
        text="Zeprzałka"
        className="au-frame mt-6 font-semibold tracking-[-0.06em] sm:mt-8 md:mt-auto"
      />
    </footer>
  )
}
