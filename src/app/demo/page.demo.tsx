import Link from "next/link"
import { ArrowUpRight, Check, Minus } from "lucide-react"
import { DEMOS, type DemoEntry } from "@/components/demo/registry"
import { Chip, LiveDot } from "@/components/demo/forma/Chip"
import { cn } from "@/components/demo/forma/cn"
import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import { getCommon } from "@/i18n/content/common"

export const metadata = { title: "Piaskownica" }

const CONCEPTS = ["zywy-interfejs", "indeks", "talia"]
/** Co każda koncepcja pokazuje jako pierwsze. */
const VOICE: Record<string, string> = {
  "zywy-interfejs": "Mówi kompetencjami",
  indeks: "Mówi rzemiosłem",
  talia: "Mówi pracą",
}

/**
 * Spis piaskownicy jako krótka prezentacja dla właściciela: trzy koncepcje
 * strony głównej w systemie „Forma” (z rekomendacją, mocnymi stronami
 * i ryzykami), specimen systemu i archiwum odrzuconych kierunków.
 */
export default function DemoIndexPage() {
  const concepts = CONCEPTS.flatMap((slug) => DEMOS.filter((demo) => demo.slug === slug))
  const system = DEMOS.find((demo) => demo.slug === "forma")
  const archive = DEMOS.filter((demo) => demo.status === "odrzucony")

  return (
    <div className="fm">
      <header className="fm-container flex h-16 items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">/demo</span>
        <ThemeSwitch label={getCommon("pl").ui.themeToggle} />
      </header>

      <main className="fm-container pt-12 pb-24 md:pt-20">
        <Chip className="bg-fm-surface shadow-fm-ring">
          <LiveDot /> Iteracja 3 · 3 listopada 2026
        </Chip>
        <h1 className="mt-6 max-w-[18ch] text-fm-h2 font-semibold text-balance md:text-[3.5rem] md:leading-[1.04]">
          Trzy koncepcje strony głównej.
          <span className="text-fm-ink-3"> Jeden system, trzy charaktery.</span>
        </h1>
        <p className="mt-6 max-w-[42rem] text-fm-lead text-pretty text-fm-ink-2">
          Miękki minimalizm w duchu Vercel i shadcn, z mikrointerakcjami tam, gdzie coś znaczą.
          Wszystkie trzy stoją na tych samych tokenach i prymitywach („Forma”) i na treściach, które
          serwis już ma. Różnią się tym, co mówią pierwsze: kompetencje, rzemiosło albo praca.
          Obejrzyj każdą na telefonie i na komputerze, w obu motywach.
        </p>

        <ol className="mt-14 grid gap-4 lg:grid-cols-3">
          {concepts.map((demo) => (
            <li key={demo.slug}>
              <ConceptCard demo={demo} voice={VOICE[demo.slug] ?? ""} />
            </li>
          ))}
        </ol>

        {system && (
          <Link
            href={`/demo/${system.slug}`}
            className="group mt-4 flex fm-press-soft flex-col gap-2 rounded-fm-3xl bg-fm-surface p-6 shadow-fm-card fm-focus transition-shadow hover:shadow-fm-pop md:flex-row md:items-center md:justify-between md:p-8"
          >
            <span>
              <span className="block text-fm-h3 font-semibold">{system.title}</span>
              <span className="mt-1 block max-w-[60ch] text-fm-small text-fm-ink-2">
                {system.summary}
              </span>
            </span>
            <ArrowUpRight className="size-5 shrink-0 text-fm-ink-3 transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fm-ink" />
          </Link>
        )}

        <section aria-labelledby="archiwum" className="mt-20">
          <h2 id="archiwum" className="text-fm-h3 font-semibold">
            Archiwum
            <span className="text-fm-ink-3"> — kierunki odrzucone, do porównania</span>
          </h2>
          <ul className="mt-6 overflow-hidden rounded-fm-3xl bg-fm-surface p-1.5 shadow-fm-card">
            {archive.map((demo) => (
              <li key={demo.slug}>
                <Link
                  href={`/demo/${demo.slug}`}
                  className="group grid gap-1 rounded-[18px] px-4 py-4 fm-focus transition-colors hover:bg-fm-fill md:grid-cols-[7rem_1fr] md:px-5"
                >
                  <time dateTime={demo.date} className="text-fm-micro text-fm-ink-3 tabular-nums">
                    {demo.date}
                  </time>
                  <span>
                    <span className="block text-[0.9375rem] font-medium">{demo.title}</span>
                    <span className="mt-0.5 block text-fm-small text-fm-ink-2">{demo.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-12 text-fm-small text-fm-ink-3">
          Piaskownica istnieje tylko w <code className="font-mono">pnpm dev</code> i na podglądach
          Vercela — na produkcji ten adres zwraca 404.{" "}
          <Link href="/" className="rounded-sm text-fm-ink underline underline-offset-4 fm-focus">
            Wróć do serwisu
          </Link>
        </p>
      </main>
    </div>
  )
}

function ConceptCard({ demo, voice }: { demo: DemoEntry; voice: string }) {
  const recommended = demo.status === "rekomendacja"

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-fm-3xl bg-fm-surface p-6 shadow-fm-card md:p-7",
        recommended && "shadow-fm-pop ring-1 ring-fm-ink"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-fm-micro font-medium text-fm-ink-3">{voice}</span>
        {recommended && <Chip className="bg-fm-ink text-fm-inverse">Rekomendacja</Chip>}
      </div>
      <h2 className="mt-5 text-fm-h3 font-semibold">{demo.title.replace("Forma · ", "")}</h2>
      <p className="mt-2 text-fm-small text-pretty text-fm-ink-2">{demo.summary}</p>

      {demo.pitch && (
        <dl className="mt-6 grid gap-4 text-fm-small">
          <div>
            <dt className="sr-only">Mocne strony</dt>
            {demo.pitch.strengths.map((item) => (
              <dd key={item} className="flex gap-2.5 py-1">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-fm-ink" />
                <span className="text-pretty">{item}</span>
              </dd>
            ))}
          </div>
          <div>
            <dt className="sr-only">Ryzyka</dt>
            {demo.pitch.risks.map((item) => (
              <dd key={item} className="flex gap-2.5 py-1 text-fm-ink-3">
                <Minus aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span className="text-pretty">{item}</span>
              </dd>
            ))}
          </div>
        </dl>
      )}

      <div className="mt-auto pt-8">
        <Link
          href={`/demo/${demo.slug}`}
          className={cn(
            "inline-flex h-11 w-fit fm-press items-center gap-2 self-start rounded-full px-5 text-sm font-medium fm-focus transition-[background-color,scale]",
            recommended
              ? "bg-fm-ink text-fm-inverse hover:bg-fm-ink/85"
              : "bg-fm-fill text-fm-ink hover:bg-fm-fill-strong"
          )}
        >
          Otwórz koncepcję <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  )
}
