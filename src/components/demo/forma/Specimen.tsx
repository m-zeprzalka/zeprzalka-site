import { ArrowUpRight } from "lucide-react"
import { getCommon } from "@/i18n/content/common"
import { CONTACT_EMAIL } from "@/lib/site"
import { Button } from "./Button"
import { Chip, Kbd, LiveDot } from "./Chip"
import { CopyButton } from "./CopyButton"
import { Count } from "./Count"
import { Reveal } from "./Reveal"
import { ThemeSwitch } from "./ThemeSwitch"

const COLORS = [
  "canvas",
  "surface",
  "fill",
  "fill-strong",
  "ink",
  "ink-2",
  "ink-3",
  "edge",
] as const
const RADII = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const
const RADIUS_PX = { xs: 6, sm: 8, md: 10, lg: 12, xl: 16, "2xl": 20, "3xl": 24, "4xl": 32 }
const SHADOWS = ["ring", "card", "pop", "float"] as const
const TYPE = [
  ["fm-display", "Display", "text-fm-display font-semibold"],
  ["fm-h2", "Nagłówek sekcji", "text-fm-h2 font-semibold"],
  ["fm-h3", "Nagłówek karty", "text-fm-h3 font-semibold"],
  ["fm-lead", "Lead — zdanie, które prowadzi", "text-fm-lead text-fm-ink-2"],
  ["fm-body", "Tekst podstawowy, 16/26, 60–75 znaków w wierszu.", "text-fm-body"],
  ["fm-small", "Opis, metadane, podpis", "text-fm-small text-fm-ink-2"],
  ["fm-micro", "Etykieta", "text-fm-micro font-medium text-fm-ink-3"],
] as const

/**
 * Specimen systemu „Forma” — tokeny i prymitywy na jednej stronie.
 * Źródło prawdy: `theme.css` (tokeny) i komponenty w tym katalogu.
 */
export function FormaSpecimen() {
  const common = getCommon("pl")

  return (
    <div className="fm">
      <header className="fm-container flex h-16 items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">Forma · specimen</span>
        <ThemeSwitch label={common.ui.themeToggle} />
      </header>

      <main className="fm-container space-y-24 pt-12 pb-32">
        <section className="max-w-3xl">
          <Chip>
            <LiveDot /> System piaskownicy · iteracja 3
          </Chip>
          <Reveal
            as="h1"
            className="mt-6 text-fm-display font-semibold text-balance"
            parts={[
              { text: "Miękki minimalizm," },
              { text: "precyzja co do piksela.", className: "text-fm-ink-3" },
            ]}
          />
          <p className="mt-6 max-w-xl text-fm-lead text-fm-ink-2">
            Płótno i powierzchnie, krawędź jako cień, koncentryczne promienie, pigułki dla akcji.
            Ruch krótki, sprężysty i zawsze po coś.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              Przycisk główny <ArrowUpRight />
            </Button>
            <Button size="lg" variant="secondary">
              Wtórny
            </Button>
            <Button size="lg" variant="ghost">
              Ghost
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-fm-h3 font-semibold">Kolor</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {COLORS.map((name) => (
              <li key={name} className="space-y-2">
                <div
                  className="h-20 rounded-fm-xl shadow-fm-ring"
                  style={{ background: `var(--fm-${name})` }}
                />
                <p className="font-mono text-fm-micro text-fm-ink-2">--fm-{name}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-fm-h3 font-semibold">Pismo</h2>
          <ul className="mt-6 divide-y divide-fm-edge">
            {TYPE.map(([token, sample, classes]) => (
              <li key={token} className="grid items-baseline gap-2 py-5 md:grid-cols-[10rem_1fr]">
                <span className="font-mono text-fm-micro text-fm-ink-3">{token}</span>
                <span className={classes}>{sample}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-fm-h3 font-semibold">Promienie</h2>
            <ul className="mt-6 flex flex-wrap items-end gap-4">
              {RADII.map((r) => (
                <li key={r} className="text-center">
                  <div
                    className="size-16 bg-fm-surface shadow-fm-card"
                    style={{ borderRadius: `var(--radius-fm-${r})` }}
                  />
                  <p className="mt-2 font-mono text-fm-micro text-fm-ink-3">{RADIUS_PX[r]}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-fm-h3 font-semibold">Cienie</h2>
            <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {SHADOWS.map((s) => (
                <li key={s}>
                  <div
                    className="h-20 rounded-fm-2xl bg-fm-surface"
                    style={{ boxShadow: `var(--fm-shadow-${s})` }}
                  />
                  <p className="mt-2 font-mono text-fm-micro text-fm-ink-3">{s}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-fm-h3 font-semibold">Prymitywy</h2>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <CopyButton value={CONTACT_EMAIL} label={CONTACT_EMAIL} copiedLabel="Skopiowano" />
            <Chip>Next.js</Chip>
            <Chip>
              <LiveDot /> Dostępny
            </Chip>
            <span className="inline-flex items-center gap-1 text-fm-small text-fm-ink-2">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
            <span className="text-fm-h2 font-semibold tabular-nums">
              <Count value={0.9928} format={{ style: "percent", maximumFractionDigits: 2 }} />
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}
