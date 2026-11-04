"use client"

import { useState } from "react"
import type { DemoHomeContent } from "@/components/demo/shared/content"

type Skill = DemoHomeContent["skills"]["items"][number]

/**
 * Akordeon kompetencji: jedna otwarta naraz, pierwsza otwarta na starcie —
 * jak dziś. Treść zwiniętych pozycji jest w HTML (dawny akordeon Radiksa jej
 * nie renderował — dług nr 6), a panel otwiera się przez siatkę 0fr → 1fr,
 * więc wysokość animuje się w każdej przeglądarce. Wzorzec WAI: h3 > button.
 */
export function SkillsAccordion({ items }: { items: readonly Skill[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null)

  return (
    <ul className="re-acc border-b border-fm-edge">
      {items.map((item) => {
        const isOpen = open === item.id
        const trigger = `${item.id}-trigger`
        const panel = `${item.id}-panel`
        return (
          <li key={item.id} className="border-t border-fm-edge">
            <h3>
              <button
                id={trigger}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="group re-acc__row w-full rounded-fm-lg py-6 text-left fm-focus md:py-8 lg:py-10"
              >
                <span className="re-skill-title text-fm-ink-3 tabular-nums transition-colors duration-200 group-aria-expanded:text-fm-ink-2">
                  {item.number}
                </span>
                <span className="re-skill-title text-balance">{item.title}</span>
                {/* Oba stany to ten sam obrys 28 px — zmienia się tylko znak (plus → minus, 200 ms). */}
                <span className="grid size-7 place-items-center rounded-full text-fm-ink-2 shadow-fm-ring transition-[color,box-shadow] duration-150 group-hover:text-fm-ink group-hover:shadow-[0_0_0_1px_var(--fm-edge-strong)] group-aria-expanded:text-fm-ink group-aria-expanded:shadow-[0_0_0_1px_var(--fm-edge-strong)]">
                  <span className="re-plus" />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={trigger}
              data-open={isOpen || undefined}
              inert={!isOpen}
              className="re-panel"
            >
              <div>
                <div className="re-panel__inner re-acc__body pb-8 md:pb-10 lg:pb-12">
                  <p className="re-lead max-w-[56ch] text-fm-ink-2">{item.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {item.tools.map((tool) => (
                      <li
                        key={tool}
                        className="inline-flex h-8 items-center rounded-full bg-fm-fill px-3.5 text-[0.8125rem] font-medium text-fm-ink-2"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
