"use client"

import { useRef } from "react"
import { Accordion } from "radix-ui"
import { ArrowUpRight } from "lucide-react"
import { Chip } from "@/components/demo/forma/Chip"
import { holdInPlace } from "./hold"
import { ICONS } from "./icons"
import { peekHandlers } from "./peek-trigger"
import type { Competency } from "./types"

/** Tyle trwa zwinięcie poprzedniej i rozwinięcie nowej karty (`animate-accordion-*`). */
const EXPAND_MS = 320

/**
 * Cztery kompetencje jako wiersze-akordeony. Myszą wiersz pokazuje w prawym
 * torze dowody (realizacje albo okładki wpisów); kliknięcie rozwija opis,
 * narzędzia i linki do tych samych dowodów. Otwarty wiersz staje się kartą,
 * a reszta cofa się do szarości — jak rozwinięta realizacja w portfolio.
 * Kliknięty wiersz zostaje tam, gdzie był (zwijająca się karta nad nim nie
 * wyciąga go spod palca), a potem strona dosuwa całą kartę do kadru.
 */
export function Competencies({ items }: { items: readonly Competency[] }) {
  const rootRef = useRef<HTMLDivElement>(null)

  function onToggle(id: string) {
    const trigger = rootRef.current?.querySelector<HTMLElement>(`[data-skill="${id}"]`)
    if (!trigger) return
    const top = trigger.getBoundingClientRect().top
    const content = () =>
      trigger.closest("[data-skill-item]")?.querySelector<HTMLElement>("[data-skill-content]")
    holdInPlace(trigger, content, top, EXPAND_MS)
  }

  return (
    <Accordion.Root
      ref={rootRef}
      type="single"
      collapsible
      onValueChange={(value) => value && onToggle(value)}
      className="i1-skills flex flex-col gap-1"
    >
      {items.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <Accordion.Item
            key={item.id}
            value={item.id}
            data-skill-item=""
            className="i1-skill relative scroll-mt-(--i1-header)"
          >
            <Accordion.Header asChild>
              <h3>
                <Accordion.Trigger
                  data-skill={item.id}
                  {...peekHandlers(`peek:${item.peek}`)}
                  className="i1-row i1-pad group relative flex min-h-16 w-full items-center gap-4 rounded-fm-2xl text-left text-fm-ink fm-focus"
                >
                  <span className="i1-icon grid size-8 shrink-0 place-items-center rounded-fm-sm bg-fm-surface shadow-fm-ring">
                    <Icon aria-hidden="true" className="size-4 text-fm-ink-2" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 font-medium tracking-[-0.01em]">{item.title}</span>
                  <span aria-hidden="true" className="i1-plus text-fm-ink-3" />
                </Accordion.Trigger>
              </h3>
            </Accordion.Header>
            <Accordion.Content
              data-skill-content=""
              className="group/acc i1-pad relative overflow-hidden duration-[280ms] ease-fm-snap data-[state=closed]:animate-accordion-up data-[state=closed]:duration-200 data-[state=open]:animate-accordion-down"
            >
              <div className="ps-12 pb-6 duration-[360ms] ease-fm-snap fill-mode-both motion-safe:group-data-[state=open]/acc:animate-in motion-safe:group-data-[state=open]/acc:delay-[60ms] motion-safe:group-data-[state=open]/acc:fade-in-0 motion-safe:group-data-[state=open]/acc:blur-in-[4px] motion-safe:group-data-[state=open]/acc:slide-in-from-bottom-2">
                <p className="text-pretty text-fm-ink-2">{item.description}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <li key={tag}>
                      <Chip>{tag}</Chip>
                    </li>
                  ))}
                </ul>
                {item.proofs.items.length > 0 && (
                  <div className="mt-6">
                    <p className="text-fm-micro font-medium text-fm-ink-3">{item.proofs.heading}</p>
                    <ul className="-mx-3 mt-1.5">
                      {item.proofs.items.map((proof) => (
                        <li key={proof.href}>
                          <a
                            href={proof.href}
                            className="group flex min-h-11 items-center gap-3 rounded-full px-3 text-fm-small fm-focus transition-colors duration-150 hover:bg-fm-fill sm:min-h-10"
                          >
                            <span className="line-clamp-2 min-w-0 py-2 text-pretty text-fm-ink">
                              {proof.label}
                            </span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="i1-arrow -ms-1.5 size-3.5 shrink-0 text-fm-ink-3"
                            />
                            <span className="ms-auto shrink-0 text-fm-ink-3 tabular-nums">
                              {proof.meta}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}
