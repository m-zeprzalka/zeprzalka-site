"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * Czy adres należy do pozycji menu: dokładne trafienie albo podstrona
 * (`/blog/wpis` → „Blog”). Strona główna tylko przy dokładnym trafieniu —
 * inaczej „/en” świeciłoby się na każdej angielskiej podstronie.
 */
export function isActivePath(pathname: string, href: string, home: string): boolean {
  if (href === home) return pathname === home
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Link nawigacji z `aria-current="page"` dla bieżącej sekcji. */
export function NavLink({
  href,
  home,
  className,
  children,
}: {
  href: string
  home: string
  className?: string
  children: ReactNode
}) {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      aria-current={isActivePath(pathname, href, home) ? "page" : undefined}
      className={className}
    >
      {children}
    </Link>
  )
}
