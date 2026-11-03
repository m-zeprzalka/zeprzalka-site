import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants, type Button } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  /** Brak adresu = pozycja nieaktywna („Poprzednia” na pierwszej stronie). */
  href?: string
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  Omit<React.ComponentProps<typeof Link>, "href">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  href,
  children,
  "aria-label": ariaLabel,
  ...props
}: PaginationLinkProps) {
  const classes = cn(
    buttonVariants({
      variant: isActive ? "outline" : "ghost",
      size,
    }),
    className
  )

  // Nieaktywna pozycja to zwykły tekst, a nie link do bieżącej strony.
  // Bez `aria-disabled` i `aria-label` — oba są niedozwolone na elemencie bez roli.
  if (!href) {
    return (
      <span data-slot="pagination-link" className={cn(classes, "pointer-events-none opacity-50")}>
        {children}
      </span>
    )
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      aria-label={ariaLabel}
      data-slot="pagination-link"
      data-active={isActive}
      className={classes}
      {...props}
    >
      {children}
    </Link>
  )
}

/*
 * Etykiety przychodzą z treści serwisu (src/i18n), bo komponent stoi na obu
 * wersjach językowych. Nazwa dostępna jest równa widocznemu napisowi —
 * wcześniej angielskie aria-label przy polskim napisie łamało WCAG 2.5.3.
 */
function PaginationPrevious({
  className,
  label,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { label: string }) {
  return (
    <PaginationLink
      aria-label={label}
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">{label}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  label,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { label: string }) {
  return (
    <PaginationLink
      aria-label={label}
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">{label}</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
