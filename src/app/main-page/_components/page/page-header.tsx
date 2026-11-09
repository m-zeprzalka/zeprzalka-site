import { Fragment, type ReactNode } from "react"
import Link from "next/link"
import { Segments } from "@/app/main-page/_components/peek/segments"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/main-page/_components/ui/breadcrumb"
import { SECTION } from "@/app/main-page/_lib/anchors"
import { noOrphans } from "@/app/main-page/_lib/text"
import type { LinkData } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"

/**
 * Nagłówek podstrony — ten sam stopień i ta sama „harmonijka” co start:
 * okruszki, potem słowa tytułu i rozwinięcia wjeżdżają z rozmycia jedno po
 * drugim, na końcu dodatki (`children`: dane wpisu, działania) — pory `--enter-*`.
 * Tytuł i rozwinięcie są osobnymi elementami (`h1` + `p`), a razem czytają się
 * jak dwutonowe zdanie startu. `#start` — początek strony (cel „wróć na górę”).
 */
export function PageHeader({
  breadcrumb,
  title,
  lead,
  compactLead = false,
  children,
}: {
  breadcrumb: { label: string; trail: readonly LinkData[]; current: string }
  title: string
  lead?: string
  /** Wpis: rozwinięcie stopień niżej — długi opis nie spycha okładki o kilkanaście wierszy. */
  compactLead?: boolean
  children?: ReactNode
}) {
  return (
    <header id={SECTION.start} className="column pt-14 md:pt-24">
      <Breadcrumb
        aria-label={breadcrumb.label}
        className="motion-safe:animate-enter motion-safe:[animation-delay:var(--enter-status)]"
      >
        <BreadcrumbList>
          {breadcrumb.trail.map((crumb) => (
            <Fragment key={crumb.href}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          ))}
          <BreadcrumbItem>
            {/* Długi tytuł wpisu stoi tuż niżej w całości — w okruszkach wystarczy początek. */}
            <BreadcrumbPage className="max-w-[30ch] truncate text-muted-foreground">
              {breadcrumb.current}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-6 text-display">
        <h1 className="enter-stagger [--enter-delay:var(--enter-title)] [--enter-step:40ms]">
          <Segments segments={[{ text: noOrphans(title) }]} split="block" />
        </h1>
        {lead && (
          <p
            className={cn(
              "enter-stagger text-muted-foreground [--enter-delay:var(--enter-lead)] [--enter-step:16ms]",
              compactLead && "mt-3 text-lg leading-snug font-normal tracking-normal sm:text-xl"
            )}
          >
            <Segments segments={[{ text: noOrphans(lead) }]} split="block" />
          </p>
        )}
      </div>
      {children && (
        <div className="mt-8 motion-safe:animate-enter motion-safe:[animation-delay:var(--enter-actions)]">
          {children}
        </div>
      )}
    </header>
  )
}
