"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Menu } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { NavLink } from "@/i18n/navigation"

export interface MobileNavLabels {
  open: string
  close: string
  title: string
  nav: string
  theme: string
}

const MobileNavPanel = dynamic(() => import("@/components/layout/MobileNavPanel"), { ssr: false })

/**
 * Przycisk menu mobilnego. Panel (Radix Dialog, ok. 11 KB) pobiera się przy
 * pierwszym dotknięciu albo najechaniu — nie przy każdym wczytaniu strony.
 */
export function MobileNav({
  locale,
  links,
  labels,
}: {
  locale: Locale
  links: NavLink[]
  labels: MobileNavLabels
}) {
  const [open, setOpen] = useState(false)
  const [requested, setRequested] = useState(false)
  const request = () => setRequested(true)

  return (
    <>
      <button
        type="button"
        aria-label={labels.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={request}
        onFocus={request}
        onClick={() => {
          request()
          setOpen(true)
        }}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      {requested && (
        <MobileNavPanel
          locale={locale}
          links={links}
          labels={labels}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  )
}
