import Link from "next/link"
import { Odometer } from "./Odometer"
import { Selection } from "./Selection"
import { Spotlight } from "./Spotlight"
import { Columns } from "./Columns"
import { typo } from "./typo"

export interface HeroStat {
  value: string
  label: string
}

/**
 * Hero: nagłówek pokazany jako zaznaczony obiekt w edytorze — ramka, uchwyty
 * i prawdziwe wymiary mierzone na żywo. Pod nim jedno zdanie o roli i liczby
 * z życiorysu. Tło to siatka konstrukcyjna, widoczna tylko w świetle kursora.
 */
export function Hero({
  status,
  title,
  role,
  highlight,
  rest,
  cta,
  secondary,
  stats,
}: {
  status: string
  title: string
  role: string
  highlight: string
  rest: string
  cta: { href: string; label: string }
  secondary: { href: string; label: string }
  stats: readonly HeroStat[]
}) {
  const words = typo(title).split(" ")

  return (
    <section className="pz-hero" aria-labelledby="pz-hero-title">
      <Spotlight />
      <div className="pz-container relative">
        <Columns />
        <div className="pz-hero__title">
          <Selection tag="h1">
            <h1 id="pz-hero-title" className="pz-display pz-words">
              {words.map((word, i) => (
                <span key={i}>
                  <span className="pz-w">
                    <span style={{ "--i": i } as React.CSSProperties}>{word}</span>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </span>
              ))}
            </h1>
          </Selection>
        </div>

        <div
          className="pz-grid pz-hero__body pz-intro"
          style={{ "--delay": "750ms" } as React.CSSProperties}
        >
          <div className="col-span-4 md:col-span-6 lg:col-span-5">
            <p className="pz-status">
              <span className="pz-status__dot" aria-hidden="true" />
              {status}
            </p>
            <p className="pz-hero__lead">
              <span className="text-[var(--pz-fg)]">{role}</span>
              {typo(highlight + rest)}
            </p>
          </div>
          <div className="col-span-4 flex flex-wrap items-end gap-3 md:col-span-6 md:justify-end lg:col-span-5 lg:col-start-8">
            <Link href={cta.href} className="pz-btn pz-btn--solid">
              {cta.label}
            </Link>
            <a href={secondary.href} className="pz-btn pz-btn--line">
              {secondary.label}
            </a>
          </div>
        </div>

        <dl className="pz-stats">
          {stats.map((stat, i) => (
            <div key={stat.label} className="pz-stat">
              <dt className="pz-stat__label">{stat.label}</dt>
              <dd className="pz-stat__value">
                <Odometer value={stat.value} index={i * 3} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
