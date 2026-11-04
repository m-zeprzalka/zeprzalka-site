import { ArrowUp } from "lucide-react"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { SECTION } from "./ids"

const LINK =
  "inline-flex min-h-8 items-center rounded-fm-xs text-fm-ink-2 fm-focus transition-colors duration-150 hover:text-fm-ink"

/** Stopka w trzech kolumnach jak dziś — bez `<br />` (dług nr 13), z drogą na górę. */
export function Footer({ content }: { content: DemoHomeContent }) {
  const { footer, person } = content

  return (
    <footer className="border-t border-fm-edge">
      <div className="re-container grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="col-span-2 md:col-span-6">
          <a
            href={`#${SECTION.start}`}
            className="rounded-fm-xs text-lg font-medium tracking-[-0.015em] fm-focus"
          >
            {person.domain}
          </a>
          <p className="mt-3 max-w-[32ch] text-pretty text-fm-ink-2">{footer.tagline}</p>
          <p className="mt-1 max-w-[36ch] text-pretty text-fm-ink-3">{footer.description}</p>
        </div>

        <nav aria-labelledby="re-footer-nav" className="md:col-span-3">
          <h2 id="re-footer-nav" className="text-sm font-medium">
            {footer.navigationLabel}
          </h2>
          <ul className="mt-3 grid gap-1 text-[0.9375rem]">
            {content.nav.map((link) => (
              <li key={link.key}>
                <a href={link.href} className={LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 id="re-footer-social" className="text-sm font-medium">
            {footer.socialLabel}
          </h2>
          <ul aria-labelledby="re-footer-social" className="mt-3 grid gap-1 text-[0.9375rem]">
            {person.socials.map((profile) => (
              <li key={profile.label}>
                <a href={profile.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {profile.label}
                  <span className="sr-only"> ({content.ui.newTab})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-fm-edge">
        <div className="re-container flex min-h-16 items-center justify-between gap-6 pb-[env(safe-area-inset-bottom)] text-sm text-fm-ink-3">
          <p>{footer.copyright}</p>
          <a
            href={`#${SECTION.start}`}
            className="group -me-3 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 whitespace-nowrap fm-focus transition-colors hover:text-fm-ink"
          >
            Do góry
            <ArrowUp
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 ease-fm-snap group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
