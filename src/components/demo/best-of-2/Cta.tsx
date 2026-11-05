import { ArrowRight } from "lucide-react"
import { buttonVariants } from "../forma/Button"
import { cn } from "../forma/cn"
import { CopyButton } from "../forma/CopyButton"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { CodeLens } from "./CodeLens"
import { SECTIONS } from "./ids"

/**
 * Zaproszenie na konsultację (wzór: CTA z „Glif · laboratorium” — „dokładnie
 * o to mi chodziło”). Panel na siatce 12 kolumn: po lewej wezwanie z hero,
 * czas odpowiedzi, przejście do formularza i e-mail do skopiowania; po prawej
 * pole kodu z nieregularną, morfującą soczewką (w środku czerń i jasne znaki —
 * uwaga do Rentgenu), która idzie za kursorem albo palcem, a bez interakcji
 * sama dryfuje. Tekst nigdy nie leży na kodzie.
 */
export function Cta({
  hero,
  contact,
  contactLabel,
  email,
  copied,
  labels,
}: {
  hero: DemoHomeContent["hero"]
  contact: DemoHomeContent["contact"]
  contactLabel: string
  email: string
  copied: string
  labels: { lens: string }
}) {
  return (
    <section aria-labelledby="b2-cta-title" className="fm-container pt-(--fm-section)">
      <div
        data-b2-in=""
        className="relative isolate grid overflow-hidden rounded-(--b2-r-panel) bg-fm-surface shadow-fm-card lg:min-h-[34rem] lg:grid-cols-12"
      >
        <div className="relative z-[1] flex flex-col justify-between gap-10 p-(--b2-inset) lg:col-span-6 lg:py-12">
          <h2
            id="b2-cta-title"
            className="max-w-[13ch] text-[clamp(2.25rem,1.4rem+3.6vw,4.25rem)] leading-[1.02] font-[550] tracking-[-0.045em] text-balance"
          >
            {typo(hero.cta)}
          </h2>
          <div className="grid gap-6">
            <p className="text-fm-small text-fm-ink-3">
              {contact.response.label}:{" "}
              <span className="font-medium text-fm-ink">{contact.response.value}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`#${SECTIONS.contact}`}
                className={cn(buttonVariants({ size: "lg" }), "group w-full min-[440px]:w-auto")}
              >
                {contactLabel}
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5"
                />
              </a>
              <CopyButton
                value={email}
                label={email}
                copiedLabel={copied}
                className="h-12 w-full justify-between ps-5 pe-4 min-[440px]:w-auto"
              />
            </div>
          </div>
        </div>
        <CodeLens label={labels.lens} className="relative min-h-[22rem] lg:col-span-6 lg:min-h-0" />
      </div>
    </section>
  )
}
