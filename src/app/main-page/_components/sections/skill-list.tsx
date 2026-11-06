"use client"

import { useState } from "react"
import { BrainCircuitIcon, CodeXmlIcon, GraduationCapIcon, PenToolIcon } from "lucide-react"
import { usePeekHover } from "@/app/main-page/_components/peek/peek-context"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/main-page/_components/ui/accordion"
import { Badge } from "@/app/main-page/_components/ui/badge"
import { keepInView } from "@/app/main-page/_lib/keep-in-view"
import type { Skill } from "@/app/main-page/_lib/types"

const ICONS = {
  design: PenToolIcon,
  development: CodeXmlIcon,
  ai: BrainCircuitIcon,
  teaching: GraduationCapIcon,
} satisfies Record<Skill["id"], unknown>

const itemId = (id: string) => `kompetencja-${id}`

/**
 * Kompetencje jako akordeon shadcn. Otwarty element staje się kartą (te same
 * wcięcia co wiersz, treść od ikony do „+”), pozostałe przygasają. Na
 * najechaniu wiersza karta podglądu pokazuje dowody z portfolio albo bloga.
 */
export function SkillList({ items }: { items: readonly Skill[] }) {
  const [open, setOpen] = useState("")

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(next) => {
        setOpen(next)
        const item = next && document.getElementById(itemId(next))
        if (item) keepInView(item)
      }}
      className="group/skills mt-8 grid gap-1"
    >
      {items.map((skill) => (
        <SkillItem key={skill.id} skill={skill} />
      ))}
    </Accordion>
  )
}

function SkillItem({ skill }: { skill: Skill }) {
  const hover = usePeekHover(skill.peek)
  const Icon = ICONS[skill.id]

  return (
    <AccordionItem
      value={skill.id}
      id={itemId(skill.id)}
      className="rounded-2xl border border-transparent px-4 transition-[background-color,border-color,opacity] duration-300 last:border-b-transparent group-has-data-[state=open]/skills:data-[state=closed]:opacity-55 group-has-data-[state=open]/skills:data-[state=closed]:hover:opacity-100 data-[state=open]:border-border data-[state=open]:bg-card sm:px-5"
    >
      <AccordionTrigger {...hover} className="items-center py-3 text-base">
        <span className="flex items-center gap-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl border bg-background">
            <Icon className="size-4" />
          </span>
          {skill.title}
        </span>
      </AccordionTrigger>
      <AccordionContent forceMount className="grid gap-5 pt-1 pb-5">
        <p className="text-base text-pretty text-muted-foreground">{skill.description}</p>
        <ul className="flex flex-wrap gap-2">
          {skill.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="secondary" className="px-2.5 py-1">
                {tag}
              </Badge>
            </li>
          ))}
        </ul>
        {skill.proofs.items.length > 0 && (
          <div className="grid gap-1">
            <p className="text-xs text-muted-foreground">{skill.proofs.heading}</p>
            <ul>
              {skill.proofs.items.map((proof) => (
                <li key={proof.href}>
                  <a
                    href={proof.href}
                    className="-mx-2 flex min-h-11 items-center rounded-lg px-2 text-sm outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <span className="line-clamp-2">{proof.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
