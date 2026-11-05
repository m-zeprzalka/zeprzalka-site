import Link from "next/link"
import { ArrowUpRight, Check, Minus } from "lucide-react"
import { DEMOS, type DemoEntry } from "@/components/demo/registry"
import { Chip, LiveDot } from "@/components/demo/forma/Chip"
import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import { getCommon } from "@/i18n/content/common"

export const metadata = { title: "Piaskownica" }

/**
 * Spis piaskownicy jako krótka prezentacja dla właściciela: pięć koncepcji
 * z iteracji 6 (każda odpowiada na jedno zadanie z briefu), niżej propozycje
 * z iteracji 5 i koncepcje z iteracji 3 ze specimenem systemu „Forma”.
 */
export default function DemoIndexPage() {
  const proposals = DEMOS.filter((demo) => demo.iteration === 6)
  const previous = DEMOS.filter((demo) => demo.iteration === 5)
  const earlier = DEMOS.filter((demo) => demo.iteration === 3)

  return (
    <div className="fm">
      <header className="fm-container flex h-16 items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">/demo</span>
        <ThemeSwitch label={getCommon("pl").ui.themeToggle} />
      </header>

      <main className="fm-container pt-12 pb-24 md:pt-20">
        <Chip className="bg-fm-surface shadow-fm-ring">
          <LiveDot /> Iteracja 6 · 5 listopada 2026
        </Chip>
        <h1 className="mt-6 max-w-[20ch] text-fm-h2 font-semibold text-balance md:text-[3.5rem] md:leading-[1.04]">
          Pięć koncepcji strony głównej.
          <span className="text-fm-ink-3"> Najlepsze z dwóch iteracji, doprowadzone dalej.</span>
        </h1>
        <p className="mt-6 max-w-[42rem] text-fm-lead text-pretty text-fm-ink-2">
          Każda koncepcja odpowiada na jedno zadanie z Twojego briefu z 4 listopada i stoi na treści
          obecnej strony głównej. Obejrzyj je na telefonie i na komputerze, w obu motywach. Przy
          każdej sekcji wystarczy „zostaje / zmień / wyrzuć” i jedno zdanie dlaczego.
        </p>

        <ol className="mt-14 grid gap-4 md:grid-cols-2">
          {proposals.map((demo, index) => (
            <li key={demo.slug} className={index === 0 ? "md:col-span-2" : undefined}>
              <ProposalCard demo={demo} number={index + 1} wide={index === 0} />
            </li>
          ))}
        </ol>

        <EarlierList
          id="iteracja-5"
          title="Iteracja 5 — propozycje z 4 listopada"
          lead="Zostają do porównania. Na nich opierają się Twoje uwagi do iteracji 6."
          demos={previous}
        />
        <EarlierList
          id="iteracja-3"
          title="Iteracja 3 — pierwsze koncepcje i system „Forma”"
          lead="Indeks, Żywy interfejs i Talia — punkt wyjścia całej serii."
          demos={earlier}
        />

        <p className="mt-12 text-fm-small text-pretty text-fm-ink-3">
          Piaskownica nie jest indeksowana ani mierzona i nie ma jej w mapie strony. Na produkcji
          jest widoczna tylko na czas prac nad wyglądem.{" "}
          <Link href="/" className="rounded-sm text-fm-ink underline underline-offset-4 fm-focus">
            Wróć do serwisu
          </Link>
        </p>
      </main>
    </div>
  )
}

function ProposalCard({ demo, number, wide }: { demo: DemoEntry; number: number; wide: boolean }) {
  return (
    <article className="flex h-full flex-col rounded-fm-3xl bg-fm-surface p-6 shadow-fm-card md:p-8">
      <p className="flex items-center gap-3 text-fm-small text-fm-ink-3">
        <span
          aria-hidden="true"
          className="grid size-7 place-items-center rounded-full bg-fm-fill font-mono text-fm-micro text-fm-ink tabular-nums"
        >
          {number}
        </span>
        <span>
          <span className="sr-only">Propozycja {number}: </span>
          {demo.brief}
        </span>
      </p>
      <h2 className="mt-5 text-fm-h3 font-semibold">{demo.title}</h2>
      <p className="mt-2 max-w-[60ch] text-fm-small text-pretty text-fm-ink-2">{demo.summary}</p>

      {demo.pitch && (
        <dl
          className={
            wide ? "mt-6 grid gap-4 text-fm-small md:grid-cols-2" : "mt-6 grid gap-4 text-fm-small"
          }
        >
          <div>
            <dt className="sr-only">Mocne strony</dt>
            {demo.pitch.strengths.map((item) => (
              <dd key={item} className="flex gap-2.5 py-1">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fm-ink" />
                <span className="text-pretty">{item}</span>
              </dd>
            ))}
          </div>
          <div>
            <dt className="sr-only">Ryzyka</dt>
            {demo.pitch.risks.map((item) => (
              <dd key={item} className="flex gap-2.5 py-1 text-fm-ink-3">
                <Minus aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span className="text-pretty">{item}</span>
              </dd>
            ))}
          </div>
        </dl>
      )}

      <div className="mt-auto pt-8">
        <Link
          href={`/demo/${demo.slug}`}
          className="inline-flex h-11 w-fit fm-press items-center gap-2 rounded-full bg-fm-ink px-5 text-sm font-medium text-fm-inverse fm-focus transition-[background-color,scale] hover:bg-fm-ink/85"
        >
          Otwórz propozycję <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  )
}

function EarlierList({
  id,
  title,
  lead,
  demos,
}: {
  id: string
  title: string
  lead: string
  demos: readonly DemoEntry[]
}) {
  return (
    <section aria-labelledby={id} className="mt-24">
      <h2 id={id} className="text-fm-h3 font-semibold">
        {title}
      </h2>
      <p className="mt-2 max-w-[42rem] text-fm-small text-pretty text-fm-ink-2">{lead}</p>
      <ul className="mt-6 divide-y divide-fm-edge rounded-fm-3xl bg-fm-surface shadow-fm-card">
        {demos.map((demo) => (
          <li key={demo.slug}>
            <Link
              href={`/demo/${demo.slug}`}
              className="group flex items-start justify-between gap-6 rounded-fm-3xl px-6 py-5 fm-focus md:px-8"
            >
              <span>
                <span className="block font-medium">
                  {demo.title.replace("Forma · ", "")}
                  {demo.brief && <span className="font-normal text-fm-ink-3"> · {demo.brief}</span>}
                </span>
                <span className="mt-1 block max-w-[70ch] text-fm-small text-pretty text-fm-ink-2">
                  {demo.summary}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-fm-ink-3 transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fm-ink"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
