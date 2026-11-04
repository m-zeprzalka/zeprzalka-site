import type { CSSProperties } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { typo } from "@/components/demo/forma/typo"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { SECTION } from "./ids"

/**
 * Most między hero a kompetencjami — dziś na stronie głównej nie ma
 * człowieka. Portret ASCII i rola w szynie, a pierwszy akapit biogramu
 * z „O mnie” nabiera atramentu słowo po słowie, gdy przewija się przez
 * ekran (CSS `view-timeline`, bez JS). Bez wsparcia albo przy „ogranicz
 * ruch” tekst po prostu stoi w pełnym kolorze.
 */
export function Statement({
  about,
  person,
  aboutLink,
}: {
  about: DemoHomeContent["about"]
  person: DemoHomeContent["person"]
  aboutLink: { label: string; href: string }
}) {
  const [lead] = about.bio
  if (!lead) return null
  const words = typo(`${lead.prefix}${lead.strong} ${lead.suffix}`).split(" ")

  return (
    <section id={SECTION.about} aria-labelledby={`${SECTION.about}-title`} className="re-section">
      <h2 id={`${SECTION.about}-title`} tabIndex={-1} className="sr-only">
        {about.heading}
      </h2>
      <div className="re-container grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="flex items-center gap-4 lg:col-span-4 lg:items-start lg:pt-2 xl:col-span-3">
          {/* Portret ASCII na białym tle; w ciemnym motywie odwrócony w skali szarości — biały glif na czerni. */}
          <span className="size-14 shrink-0 overflow-hidden rounded-full shadow-fm-ring">
            <Image
              src={person.avatar}
              alt=""
              width={300}
              height={300}
              sizes="56px"
              className="size-full bg-white dark:[filter:grayscale(1)_invert(1)]"
            />
          </span>
          <p className="text-sm leading-snug">
            <span className="block font-medium">{person.name}</span>
            <span className="mt-0.5 block max-w-[14rem] text-pretty text-fm-ink-3">
              {person.role}
            </span>
          </p>
        </div>

        <div className="re-ink-scope lg:col-span-8 xl:col-span-9">
          <p className="re-statement max-w-[34ch]">
            <span className="sr-only">{words.join(" ")}</span>
            <span aria-hidden="true">
              {words.map((word, index) => (
                <span key={index}>
                  <span
                    className="re-ink"
                    style={{ "--k": index / Math.max(words.length - 1, 1) } as CSSProperties}
                  >
                    {word}
                  </span>
                  {index < words.length - 1 && " "}
                </span>
              ))}
            </span>
          </p>
          <Button asChild variant="secondary" className="group mt-8 lg:mt-10">
            <a href={aboutLink.href}>
              {aboutLink.label}
              <ArrowUpRight
                aria-hidden="true"
                className="text-fm-ink-3 transition-[translate,color] duration-200 ease-fm-snap group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
              />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
