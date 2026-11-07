import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

import { buttonVariants, type Button } from "@/app/main-page/_components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
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
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

// zeprzalka: strona z adresem przez next/link (przejście bez przeładowania i prefetch);
// bez adresu (brzeg archiwum) — zwykły element, nie link.
function PaginationLink({
  className,
  isActive,
  size = "icon",
  href,
  ...props
}: PaginationLinkProps) {
  const Comp = href ? Link : "a"
  return (
    <Comp
      href={href as string}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

// zeprzalka: napis z treści serwisu (`label`) zamiast angielskiego na sztywno — także
// nazwa dla czytnika, gdy na telefonie widać samą strzałkę. Bez `href` (pierwsza albo
// ostatnia strona) element nie jest linkiem, więc nie dostaje nazwy.
function PaginationPrevious({
  className,
  label,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { label: string }) {
  return (
    <PaginationLink
      aria-label={props.href ? label : undefined}
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
      aria-label={props.href ? label : undefined}
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
      {/* zeprzalka: bez angielskiego „More pages” — element jest i tak `aria-hidden`. */}
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
