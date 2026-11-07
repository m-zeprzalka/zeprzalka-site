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
import type { Link as LinkData } from "@/app/main-page/_lib/types"

/**
 * Nagłówek podstrony — ten sam stopień i ta sama „harmonijka” co start:
 * okruszki, potem słowa tytułu i rozwinięcia wyostrzają się z rozmycia jedno
 * po drugim, na końcu dodatki (`children`: dane wpisu, działania). Tytuł i
 * rozwinięcie są osobnymi elementami (`h1` + `p`), a razem czytają się jak
 * dwutonowe zdanie startu. Kotwica `#start` — pierwsza pozycja spisu w lewym torze.
 */
export function PageHeader({
  breadcrumb,
  title,
  lead,
  children,
}: {
  breadcrumb: { label: string; trail: readonly LinkData[]; current: string }
  title: string
  lead?: string
  children?: ReactNode
}) {
  return (
    <header id={SECTION.start} className="column pt-14 md:pt-24">
      <Breadcrumb
        aria-label={breadcrumb.label}
        className="motion-safe:animate-enter motion-safe:[animation-delay:80ms]"
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
        <h1 className="enter-stagger [--enter-delay:140ms] [--enter-step:32ms]">
          <Segments segments={[{ text: noOrphans(title) }]} split="block" />
        </h1>
        {lead && (
          <p className="enter-stagger text-muted-foreground [--enter-delay:320ms] [--enter-step:14ms]">
            <Segments segments={[{ text: noOrphans(lead) }]} split="block" />
          </p>
        )}
      </div>
      {children && (
        <div className="mt-8 motion-safe:animate-enter motion-safe:[animation-delay:560ms]">
          {children}
        </div>
      )}
    </header>
  )
}
