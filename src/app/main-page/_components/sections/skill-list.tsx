"use client"

import Link from "next/link"
import { useState } from "react"
import {
  BrainCircuitIcon,
  CodeXmlIcon,
  GraduationCapIcon,
  PenToolIcon,
  ArrowRightIcon,
} from "lucide-react"
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

const itemId = (id: Skill["id"]) => `kompetencja-${id}`

/**
 * Kompetencje jako akordeon shadcn. Wiersz reaguje na najechanie tłem karty,
 * a otwarty staje się kartą — te same wcięcia w obu stanach, więc ikona
 * i tytuł nie skaczą; treść biegnie od ikony do „−”. Pozostałe wiersze
 * przygasają. Na najechaniu karta na marginesie pokazuje dowody.
 */
export function SkillList({ items }: { items: readonly Skill[] }) {
  const [open, setOpen] = useState("")

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(next) => {
        const item = next && document.getElementById(itemId(next as Skill["id"]))
        if (item) keepInView(item)
        setOpen(next)
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
      className="group/skill -mx-3 rounded-2xl border border-transparent px-3 transition-[background-color,border-color,opacity] duration-300 last:border-b-transparent hover:bg-accent/50 group-has-data-[state=open]/skills:data-[state=closed]:opacity-60 group-has-data-[state=open]/skills:data-[state=closed]:hover:opacity-100 data-[state=open]:border-border data-[state=open]:bg-card"
    >
      <AccordionTrigger {...hover} className="items-center py-3 text-base">
        <span className="flex items-center gap-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl border bg-background transition-colors group-hover/skill:border-foreground/20">
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
              <Badge variant="secondary" size="md">
                {tag}
              </Badge>
            </li>
          ))}
        </ul>
        {skill.proofs.items.length > 0 && (
          <div className="grid gap-1">
            <p className="text-xs text-muted-foreground">{skill.proofs.heading}</p>
            <ul>
              {skill.proofs.items.map((proof) => {
                // Kotwice realizacji obsługuje lista portfolio (zwykły link); wpisy — next/link.
                const ProofLink = proof.href.startsWith("#") ? "a" : Link
                return (
                  <li key={proof.href}>
                    <ProofLink
                      href={proof.href}
                      className="-mx-2 flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 text-sm outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
                    >
                      <span className="line-clamp-2">{proof.label}</span>
                      <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground" />
                    </ProofLink>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
