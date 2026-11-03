import Link from "next/link"
import { ArrowUp } from "lucide-react"
import { LiveDot } from "../forma/Chip"
import { LocalTime } from "./LocalTime"

/** Stopka: znak i zdanie o pracy, nawigacja, profile, czas w Warszawie i status. */
export function Footer({
  brand,
  tagline,
  description,
  nav,
  social,
  city,
  status,
  copyright,
  labels,
}: {
  brand: string
  tagline: string
  description: string
  nav: { href: string; label: string }[]
  social: readonly { label: string; url: string }[]
  city: string
  status: string
  copyright: string
  labels: { navigation: string; social: string; top: string }
}) {
  return (
    <footer className="fm-container pt-[calc(var(--fm-section)/2)] pb-8">
      <div className="grid gap-10 rounded-fm-3xl bg-fm-surface p-6 shadow-fm-card md:grid-cols-[1.4fr_1fr_1fr] md:p-10">
        <div>
          <p className="text-lg font-semibold tracking-tight">{brand}</p>
          <p className="mt-3 max-w-[30ch] text-fm-small text-pretty text-fm-ink-2">
            {tagline} {description}
          </p>
          <p className="mt-6 flex items-center gap-2 text-fm-micro font-medium text-fm-ink-2">
            <LiveDot /> {status}
          </p>
        </div>
        <nav aria-labelledby="zi-footer-nav">
          <h2 id="zi-footer-nav" className="text-fm-micro font-medium text-fm-ink-3">
            {labels.navigation}
          </h2>
          <ul className="mt-4 grid gap-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-sm text-fm-small text-fm-ink-2 fm-focus transition-colors hover:text-fm-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 id="zi-footer-social" className="text-fm-micro font-medium text-fm-ink-3">
            {labels.social}
          </h2>
          <ul aria-labelledby="zi-footer-social" className="mt-4 grid gap-2.5">
            {social.map((profile) => (
              <li key={profile.url}>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm text-fm-small text-fm-ink-2 fm-focus transition-colors hover:text-fm-ink"
                >
                  {profile.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 px-2 text-fm-micro text-fm-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{copyright}</span>
        <span className="flex items-center gap-4">
          <LocalTime city={city} />
          <a
            href="#zi-top"
            className="inline-flex items-center gap-1 rounded-sm fm-focus transition-colors hover:text-fm-ink"
          >
            {labels.top} <ArrowUp className="size-3.5" />
          </a>
        </span>
      </div>
    </footer>
  )
}
