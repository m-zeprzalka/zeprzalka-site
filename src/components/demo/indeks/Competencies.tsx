"use client"

import { Accordion } from "radix-ui"
import { ArrowUpRight } from "lucide-react"
import { Chip } from "@/components/demo/forma/Chip"
import { ICONS } from "./icons"
import type { Competency } from "./types"

/**
 * Cztery kompetencje jako wiersze-akordeony. Otwarty wiersz staje się kartą
 * (tło wyrasta pod nim), wysokość jedzie na krzywej snap, treść wyostrza się
 * z opóźnieniem 60 ms. Każda kompetencja kończy się dowodem: realizacjami
 * albo wpisami, które ją pokazują — linki prowadzą dalej po tej samej stronie.
 */
export function Competencies({ items }: { items: readonly Competency[] }) {
  return (
    <Accordion.Root type="single" collapsible className="ix-dim flex flex-col gap-1">
      {items.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <Accordion.Item key={item.id} value={item.id} className="ix-skill relative">
            <Accordion.Header asChild>
              <h3>
                <Accordion.Trigger className="ix-row ix-bleed group relative flex min-h-14 items-center gap-4 rounded-fm-2xl text-left text-fm-ink fm-focus data-[state=open]:bg-transparent">
                  <span className="grid size-8 shrink-0 place-items-center rounded-fm-sm bg-fm-surface shadow-fm-ring">
                    <Icon aria-hidden="true" className="size-4 text-fm-ink-2" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 font-medium tracking-[-0.01em]">{item.title}</span>
                  <span aria-hidden="true" className="ix-plus text-fm-ink-3" />
                </Accordion.Trigger>
              </h3>
            </Accordion.Header>
            <Accordion.Content className="ix-acc relative">
              <div className="ps-12 pb-6">
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
                    <ul className="-mx-2 mt-1.5">
                      {item.proofs.items.map((proof) => (
                        <li key={proof.href}>
                          <a
                            href={proof.href}
                            className="group flex min-h-11 items-center gap-3 rounded-fm-md px-2 text-fm-small fm-focus transition-colors duration-150 hover:bg-fm-fill sm:min-h-10"
                          >
                            <span className="min-w-0 truncate text-fm-ink">{proof.label}</span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="ix-arrow -ms-1.5 size-3.5 shrink-0 text-fm-ink-3"
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
