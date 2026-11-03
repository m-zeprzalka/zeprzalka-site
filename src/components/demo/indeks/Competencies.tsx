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
                <Accordion.Trigger className="ix-row ix-bleed fm-focus text-fm-ink group rounded-fm-2xl relative flex min-h-14 items-center gap-4 text-left data-[state=open]:bg-transparent">
                  <span className="bg-fm-surface shadow-fm-ring rounded-fm-sm grid size-8 shrink-0 place-items-center">
                    <Icon aria-hidden="true" className="text-fm-ink-2 size-4" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 font-medium tracking-[-0.01em]">{item.title}</span>
                  <span aria-hidden="true" className="ix-plus text-fm-ink-3" />
                </Accordion.Trigger>
              </h3>
            </Accordion.Header>
            <Accordion.Content className="ix-acc relative">
              <div className="ps-12 pb-6">
                <p className="text-fm-ink-2 text-pretty">{item.description}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <li key={tag}>
                      <Chip>{tag}</Chip>
                    </li>
                  ))}
                </ul>
                {item.proofs.items.length > 0 && (
                  <div className="mt-6">
                    <p className="text-fm-micro text-fm-ink-3 font-medium">{item.proofs.heading}</p>
                    <ul className="-mx-2 mt-1.5">
                      {item.proofs.items.map((proof) => (
                        <li key={proof.href}>
                          <a
                            href={proof.href}
                            className="group fm-focus hover:bg-fm-fill text-fm-small rounded-fm-md flex min-h-11 items-center gap-3 px-2 transition-colors duration-150 sm:min-h-10"
                          >
                            <span className="text-fm-ink min-w-0 truncate">{proof.label}</span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="ix-arrow text-fm-ink-3 -ms-1.5 size-3.5 shrink-0"
                            />
                            <span className="text-fm-ink-3 ms-auto shrink-0 tabular-nums">
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
