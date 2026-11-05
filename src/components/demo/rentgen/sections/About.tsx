import type { CSSProperties } from "react"
import Image from "next/image"
import { Count } from "../../forma/Count"
import { typo } from "../../forma/typo"
import portrait from "../../shared/portrait/portrait-luma.webp"
import type { DemoHomeContent } from "../../shared/content"
import { Listing } from "../code/Listing"
import { quote } from "../code/highlight"
import { Code, Face, Tag, Twin } from "../code/Twin"
import { UI } from "../ui"
import { Scan } from "./Scan"

type About = DemoHomeContent["about"]

const vars = (values: Record<string, string | number>) => values as CSSProperties

/** Liczby „dojeżdżają” (Number Flow); zakres lat zostaje tekstem. */
function FactValue({ value, suffix }: { value: number | string; suffix?: string }) {
  if (typeof value === "number") return <Count value={value} suffix={suffix} />
  const decimal = value.match(/^(\d+),(\d+)%$/)
  if (decimal) {
    return (
      <Count
        value={Number(`${decimal[1]}.${decimal[2]}`)}
        format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        suffix="%"
      />
    )
  }
  return <>{value}</>
}

/**
 * O mnie — sekcja ze SKANEM. Linia skanera stoi na 62% wysokości ekranu:
 * nad nią strona jest gotowa (tekst wyostrza się z rozmycia tuż nad linią),
 * pod nią leży jej kod — biogram jako dane, portret złożony z liter biogramu,
 * liczby jako tablica. Przewijanie „kompiluje” sekcję linia po linii.
 * Całość to dwie przeciwne transformacje na osi widoku (kompozytor, bez JS);
 * bez wsparcia albo przy „ogranicz ruch” sekcja jest po prostu gotowa.
 */
export function About({ about, name }: { about: About; name: string }) {
  const [lead, second] = about.bio
  if (!lead || !second) return null
  const manifest = `${lead.prefix}${lead.strong} ${lead.suffix}`
  const [first, ...restSentences] = manifest.split(/(?<=\.)\s+/)
  const rest = restSentences.join(" ")

  const factsCode = `const facts = [\n${about.facts
    .map(
      (fact) =>
        `  { value: ${typeof fact.value === "number" ? fact.value : quote(fact.value)}, ${
          "suffix" in fact && fact.suffix ? `suffix: ${quote(fact.suffix)}, ` : ""
        }label: ${quote(fact.label)} },`
    )
    .join("\n")}\n]`

  // Te same bliźniaki w dwóch kliszach: skanu (CSS) i soczewki (gdy skan się skończył).
  const twins = (
    <>
      <Listing file="About.tsx" />
      <Twin for="portrait" kind="media" className="rg-twin--portrait rounded-fm-3xl">
        {/*
         * Portret z liter biogramu: wydruk policzony raz z tego samego zdjęcia (podniesione
         * cienie, krawędzie rysów, słaby ton pod literami) — widoczny od pierwszego malowania,
         * bez pustej plamy. Po kliszy przesuwa się powoli światło (maska z tego samego obrazu).
         */}
        <span aria-hidden="true" className="rg-portrait-photo" />
        <span aria-hidden="true" className="rg-portrait-veil" />
        <span aria-hidden="true" className="rg-portrait-code" />
        <span aria-hidden="true" className="rg-portrait-glint" />
        <Tag name="img.portrait" />
      </Twin>
      <Twin for="about-title" kind="text">
        <Code src={`<h2>${about.heading}</h2>`} />
      </Twin>
      <Twin for="manifest" kind="text">
        <Code className="rg-code--manifest" src={`const bio = {\n  lead: ${quote(manifest)},\n}`} />
      </Twin>
      <Twin for="bio-second" kind="text">
        <Code
          className="rg-code--lead"
          src={`<p className="text-fm-lead">\n  ${second.prefix}<strong>${second.strong}</strong>${second.suffix}\n</p>`}
        />
      </Twin>
      <Twin for="facts" kind="text">
        <Code className="rg-code--facts" src={factsCode} />
      </Twin>
    </>
  )

  return (
    <section
      id="o-mnie"
      data-rg-host="about"
      data-rg-section="o-mnie"
      data-rg-name="section#o-mnie"
      aria-labelledby="rg-about-title"
      className="rg-about relative py-(--fm-section)"
    >
      <div className="fm-container grid gap-x-6 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-4 lg:pt-2">
          <div
            data-rg-key="portrait"
            data-rg-name="img.portrait"
            className="relative aspect-[4/5] w-[min(19rem,72%)] overflow-hidden rounded-fm-3xl bg-fm-fill shadow-fm-ring lg:w-full lg:max-w-[20rem]"
          >
            <Image
              src={portrait}
              alt={name}
              sizes="(min-width: 1024px) 20rem, 72vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          <h2
            id="rg-about-title"
            data-rg-key="about-title"
            data-rg-name="h2"
            className="text-fm-small font-medium text-fm-ink-3"
          >
            {about.heading}
          </h2>
          <p
            data-rg-key="manifest"
            data-rg-name="p.rg-manifest"
            className="rg-manifest mt-5 max-w-[22em] text-pretty"
          >
            {typo(first ?? "")} <span className="text-fm-ink-3">{typo(rest)}</span>
          </p>
          <p
            data-rg-key="bio-second"
            data-rg-name="p.text-fm-lead"
            className="mt-8 max-w-[40rem] text-fm-lead text-pretty text-fm-ink-2"
          >
            {typo(second.prefix)}
            <strong className="font-medium text-fm-ink">{second.strong}</strong>
            {typo(second.suffix)}
          </p>
        </div>

        <dl
          data-rg-key="facts"
          data-rg-name="dl.facts"
          className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-fm-edge pt-10 lg:col-span-12 lg:grid-cols-4 lg:gap-x-0"
        >
          {about.facts.map((fact, index) => (
            <div
              key={fact.label}
              data-rg-in=""
              style={vars({ "--i": index })}
              className="row-span-2 grid grid-rows-subgrid content-start gap-y-3 lg:border-l lg:border-fm-edge lg:px-6 lg:first:border-0 lg:first:ps-0"
            >
              <dt className="row-start-2 max-w-[14rem] text-fm-small text-pretty text-fm-ink-3">
                {fact.label}
              </dt>
              <dd className="row-start-1 self-start text-[clamp(1.75rem,0.6rem+2.7vw,3rem)] leading-none font-[560] tracking-[-0.045em] whitespace-nowrap tabular-nums [&_number-flow-react]:-my-[0.25em]">
                <FactValue value={fact.value} suffix={"suffix" in fact ? fact.suffix : undefined} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <Face>{twins}</Face>

      {/* Skan: okno kliszy jedzie w dół z linią, jego zawartość — w górę (stoi w miejscu). */}
      <Scan>
        <div className="rg-scan__move">
          <div className="rg-scan__window">
            <div className="rg-scan__inner">
              <Face variant="scan">{twins}</Face>
            </div>
          </div>
          <div className="rg-scan__beam">
            <span className="rg-scan__label">{UI.scan}</span>
          </div>
        </div>
      </Scan>
    </section>
  )
}
