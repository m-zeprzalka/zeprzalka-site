"use client"

import { useRef, useState } from "react"
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
 * Przycisk stoi poza drzewem Dialogu (inaczej panel nie mógłby być leniwy),
 * więc Radix nie zna wyzwalacza — fokus po zamknięciu wraca przez `returnFocusTo`.
 */
export function MobileNav({
  locale,
  links,
  labels,
  themeClassName,
}: {
  locale: Locale
  links: NavLink[]
  labels: MobileNavLabels
  /** Klasa przycisku motywu w panelu (liczona na serwerze). */
  themeClassName: string
}) {
  const [open, setOpen] = useState(false)
  const [requested, setRequested] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const request = () => setRequested(true)

  return (
    <>
      <button
        ref={triggerRef}
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
        className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-muted md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      {requested && (
        <MobileNavPanel
          locale={locale}
          links={links}
          labels={labels}
          themeClassName={themeClassName}
          open={open}
          onOpenChange={setOpen}
          returnFocusTo={triggerRef}
        />
      )}
    </>
  )
}
