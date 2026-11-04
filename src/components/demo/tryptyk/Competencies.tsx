"use client"

import { Accordion } from "radix-ui"
import { ArrowUpRight } from "lucide-react"
import { Chip } from "@/components/demo/forma/Chip"
import { workAnchor } from "./anchors"
import { ICONS } from "./icons"
import { point } from "./store"
import type { Competency } from "./types"

/**
 * Trzy kompetencje z obecnej strony jako wiersze-akordeony. Otwarty wiersz
 * staje się kartą (tło wyrasta pod nim), a scena pokazuje dowody tej
 * kompetencji — realizacje z portfolio. W karcie te same dowody jako lista;
 * link prowadzi do wiersza realizacji (scena albo rozwinięcie).
 */
export function Competencies({
  items,
  works,
}: {
  items: readonly Competency[]
  works: Readonly<Record<string, { title: string; category: string }>>
}) {
  const first = items[0]?.id

  return (
    <Accordion.Root
      type="single"
      collapsible
      defaultValue={first}
      onValueChange={(value) => value && point("kompetencje", { skill: value })}
      className="tk-dim flex flex-col gap-1"
    >
      {items.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <Accordion.Item key={item.id} value={item.id} className="tk-skill relative">
            <Accordion.Header asChild>
              <h3>
                <Accordion.Trigger
                  onFocus={() => point("kompetencje", { skill: item.id })}
                  className="tk-row tk-bleed group relative flex min-h-14 items-center gap-4 rounded-fm-2xl text-left text-fm-ink fm-focus data-[state=open]:bg-transparent"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-fm-sm bg-fm-surface shadow-fm-ring">
                    <Icon aria-hidden="true" className="size-4 text-fm-ink-2" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 font-medium tracking-[-0.01em] xl:text-[1.0625rem]">
                    {item.title}
                  </span>
                  <span aria-hidden="true" className="tk-plus text-fm-ink-3" />
                </Accordion.Trigger>
              </h3>
            </Accordion.Header>
            <Accordion.Content className="tk-acc relative">
              <div className="ps-12 pb-6">
                <p className="max-w-[36rem] text-pretty text-fm-ink-2">{item.description}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {item.tools.map((tool) => (
                    <li key={tool}>
                      <Chip className="text-[0.8125rem]">{tool}</Chip>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <p className="flex items-baseline gap-2 text-[0.8125rem] font-medium text-fm-ink-3">
                    {item.proofs.label}
                    <span className="font-normal tabular-nums">{item.proofs.meta}</span>
                  </p>
                  <ul className="-mx-2 mt-1.5">
                    {item.proofs.slugs.slice(0, 3).map((slug) => {
                      const work = works[slug]
                      if (!work) return null
                      return (
                        <li key={slug}>
                          <a
                            href={`#${workAnchor(slug)}`}
                            className="group flex min-h-11 items-center gap-3 rounded-fm-md px-2 text-fm-small fm-focus transition-colors duration-150 hover:bg-fm-fill sm:min-h-10"
                          >
                            <span className="min-w-0 truncate text-fm-ink">{work.title}</span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="tk-arrow -ms-1.5 size-3.5 shrink-0 text-fm-ink-3"
                            />
                            <span className="ms-auto shrink-0 text-fm-ink-2">{work.category}</span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}
